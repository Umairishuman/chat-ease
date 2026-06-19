import { NextResponse } from "next/server";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt

export async function POST(request: Request) {
    const { name, email, password, role } = await request.json();

    try {
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await User.find({ email });
        if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 401 });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword,
            role: role ? role : 'user'
        })
        const token = awit 

    } catch (error) {}
}
