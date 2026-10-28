import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { RATE_LIMITS, getClientIp, rateLimit, tooManyRequests } from '../../lib/rateLimit';
import { MAX_RESET_CODE_ATTEMPTS, resetCodeMatches } from '../../lib/resetCode';

const INVALID_CODE_RESPONSE = { error: 'Invalid or expired code' };

export async function POST(req: Request) {
    try {
        const { email, code, newPassword } = await req.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const limit = rateLimit(`reset:ip:${getClientIp(req)}`, RATE_LIMITS.resetPasswordPerIp);
        if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

        await connectDB();

        const user = await User.findOne({
            email,
            resetPasswordCode: { $exists: true },
            resetPasswordExpires: { $gt: new Date() } // Ensures the code hasn't expired
        });

        if (!user || !user.resetPasswordCode) {
            return NextResponse.json(INVALID_CODE_RESPONSE, { status: 400 });
        }

        if (!resetCodeMatches(String(code), user.resetPasswordCode)) {
            // Count wrong guesses against this code and burn it once the limit is reached
            const attempts = (user.resetPasswordAttempts ?? 0) + 1;
            if (attempts >= MAX_RESET_CODE_ATTEMPTS) {
                user.resetPasswordCode = undefined;
                user.resetPasswordExpires = undefined;
                user.resetPasswordAttempts = 0;
                await user.save();
                return NextResponse.json(
                    { error: 'Too many incorrect attempts. Please request a new code.' },
                    { status: 400 }
                );
            }
            user.resetPasswordAttempts = attempts;
            await user.save();
            return NextResponse.json(INVALID_CODE_RESPONSE, { status: 400 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user
        user.password = hashedPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordAttempts = 0;

        await user.save();

        return NextResponse.json({ message: 'Password has been successfully reset' }, { status: 200 });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
