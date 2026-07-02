import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JOSE_SECRET || 'fallback-secret-key-12345');

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const verified = await jwtVerify(token, SECRET);
        return verified.payload as { userId: string, email: string };
    } catch (err) {
        return null;
    }
}
