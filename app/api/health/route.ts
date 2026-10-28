import { NextResponse } from 'next/server';
import connectDB from '@/app/(pages)/lib/db';

// Liveness/readiness probe for hosting platforms. Reports whether MongoDB is reachable.
export async function GET() {
    try {
        const conn = await connectDB();
        await conn.connection.db?.admin().ping();
        return NextResponse.json({ status: 'ok', database: 'connected' }, { status: 200 });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({ status: 'error', database: 'unreachable' }, { status: 503 });
    }
}
