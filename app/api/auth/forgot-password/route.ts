import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import nodemailer from 'nodemailer';
import { RATE_LIMITS, getClientIp, rateLimitAll, tooManyRequests } from '../../lib/rateLimit';
import { RESET_CODE_TTL_MS, generateResetCode, hashResetCode } from '../../lib/resetCode';

// Same response whether or not the account exists, so this endpoint cannot be used
// to discover which emails are registered.
const GENERIC_RESPONSE = { message: 'If an account exists for that email, a reset code has been sent.' };

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const limit = rateLimitAll([
            { key: `forgot:email:${email.trim().toLowerCase()}`, rule: RATE_LIMITS.forgotPasswordPerEmail },
            { key: `forgot:ip:${getClientIp(req)}`, rule: RATE_LIMITS.forgotPasswordPerIp },
        ]);
        if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
        }

        const code = generateResetCode();

        user.resetPasswordCode = hashResetCode(code);
        user.resetPasswordExpires = new Date(Date.now() + RESET_CODE_TTL_MS);
        user.resetPasswordAttempts = 0;
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Chat-Ease Password Reset Code',
            text: `Your password reset code is: ${code}\nThis code will expire in 15 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password for your Chat-Ease account.</p>
                    <p>Your password reset code is:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(GENERIC_RESPONSE, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
