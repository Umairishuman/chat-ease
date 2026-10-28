import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectDB from '@/app/(pages)/lib/db';
import User from '@/app/models/User';
import { createSession } from '../../lib/serverAuth';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
    try {
        const { credential } = await req.json();

        if (!credential) {
            return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Invalid Google token payload' }, { status: 400 });
        }

        const { email, name, picture } = payload;

        await connectDB();

        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random handle based on their name
            const baseHandle = name ? name.replace(/\s+/g, '').toLowerCase() : 'user';
            const randomSuffix = Math.floor(Math.random() * 10000).toString();
            const handle = `${baseHandle}${randomSuffix}`;

            user = await User.create({
                name: name || 'Google User',
                email,
                handle,
                avatar: picture || '',
                // Password is left undefined since they use OAuth
            });
        }

        // Always issue a "remember me" length session for Google Sign In
        await createSession({ userId: user._id.toString(), email: user.email }, true);

        const userObj = user.toObject();
        delete userObj.password;

        return NextResponse.json({ message: 'Google Login successful', user: userObj }, { status: 200 });

    } catch (error) {
        console.error('Google Auth error:', error);
        return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
    }
}
