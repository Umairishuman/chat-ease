import { SignJWT, jwtVerify } from 'jose';

// Framework-agnostic session helpers. Kept free of `next/headers` so they can
// also be used from the Pages Router Socket.io handler.

export const SESSION_COOKIE = 'session_token';

const ONE_DAY_SECONDS = 24 * 60 * 60;
export const DEFAULT_SESSION_SECONDS = ONE_DAY_SECONDS;
export const REMEMBER_ME_SESSION_SECONDS = 30 * ONE_DAY_SECONDS;

const DEV_FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';

export interface SessionPayload {
    userId: string;
    email: string;
}

// Resolved lazily so `next build` does not require the secret to be present.
function getSecret(): Uint8Array {
    const secret = process.env.JOSE_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JOSE_SECRET environment variable must be set in production');
        }
        return new TextEncoder().encode(DEV_FALLBACK_SECRET);
    }
    return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload, maxAgeSeconds: number): Promise<string> {
    return new SignJWT({ userId: payload.userId, email: payload.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${maxAgeSeconds}s`)
        .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    // Outside the try so a missing secret surfaces as a configuration error, not a silent logout
    const secret = getSecret();
    try {
        const { payload } = await jwtVerify(token, secret);
        if (typeof payload.userId !== 'string' || typeof payload.email !== 'string') {
            return null;
        }
        return { userId: payload.userId, email: payload.email };
    } catch {
        return null;
    }
}

// Extracts the session token from a raw `Cookie` header (e.g. a WebSocket handshake).
export function getSessionTokenFromCookieHeader(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null;
    for (const part of cookieHeader.split(';')) {
        const [name, ...rest] = part.trim().split('=');
        if (name === SESSION_COOKIE) {
            return decodeURIComponent(rest.join('='));
        }
    }
    return null;
}
