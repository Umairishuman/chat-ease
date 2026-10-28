import { cookies } from 'next/headers';
import {
    SESSION_COOKIE,
    DEFAULT_SESSION_SECONDS,
    REMEMBER_ME_SESSION_SECONDS,
    signSessionToken,
    verifySessionToken,
    type SessionPayload,
} from './session';

export async function getAuthenticatedUser(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
        return null;
    }

    return verifySessionToken(token);
}

// Issues a signed session token and stores it in an httpOnly cookie.
export async function createSession(payload: SessionPayload, rememberMe: boolean): Promise<void> {
    const maxAgeSeconds = rememberMe ? REMEMBER_ME_SESSION_SECONDS : DEFAULT_SESSION_SECONDS;
    const token = await signSessionToken(payload, maxAgeSeconds);

    const cookieStore = await cookies();
    cookieStore.set({
        name: SESSION_COOKIE,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAgeSeconds,
        sameSite: 'lax',
    });
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
