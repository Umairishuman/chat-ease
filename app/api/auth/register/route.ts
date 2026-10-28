import { NextResponse } from "next/server";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/app/(pages)/lib/db";
import { createSession } from "../../lib/serverAuth";
import { RATE_LIMITS, getClientIp, rateLimit, tooManyRequests } from "../../lib/rateLimit";

export async function POST(request: Request) {
    try {
        // `role` is intentionally not read from the body: new accounts are always regular users.
        const { name, email, password, handle } = await request.json();

        if (!name || !email || !password || !handle) {
            return NextResponse.json({ error: "Name, email, handle, and password are required" }, { status: 400 });
        }

        const limit = rateLimit(`register:ip:${getClientIp(request)}`, RATE_LIMITS.registerPerIp);
        if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 409 });

        const existingHandle = await User.findOne({ handle });
        if (existingHandle) return NextResponse.json({ error: "Handle is already taken" }, { status: 409 });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name,
            email,
            handle,
            password: hashedPassword,
        });

        // Sign the new user in straight away
        await createSession({ userId: newUser._id.toString(), email: newUser.email }, false);

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
