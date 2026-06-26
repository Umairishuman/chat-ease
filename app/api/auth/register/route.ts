import { NextResponse } from "next/server";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import connectDB from "@/app/(pages)/lib/db";

export async function POST(request: Request) {
    const { name, email, password, handle, role } = await request.json();

    try {
        await connectDB();

        if (!name || !email || !password || !handle) {
            return NextResponse.json({ error: "Name, email, handle, and password are required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 401 });

        const existingHandle = await User.findOne({ handle });
        if (existingHandle) return NextResponse.json({ error: "Handle is already taken" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name, 
            email, 
            handle,
            password: hashedPassword,
            role: role ? role : 'user'
        })
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: newUser._id.toString(), role: newUser.role })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1d")
            .sign(secret);

        return NextResponse.json({ message: "User created successfully", token }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
