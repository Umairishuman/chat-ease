import { NextResponse } from 'next/server';

// Fixed-window, in-memory rate limiter. State lives in this Node.js process, which
// matches the single-instance deployment the Socket.io server requires. To run several
// instances, move these counters to a shared store such as Redis.

interface Bucket {
    count: number;
    resetAt: number;
}

export interface RateLimitRule {
    limit: number;
    windowMs: number;
}

export interface RateLimitResult {
    allowed: boolean;
    retryAfterSeconds: number;
}

const MAX_TRACKED_KEYS = 10_000;
const buckets = new Map<string, Bucket>();

function sweepExpired(now: number): void {
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}

// Records one hit for `key` and reports whether it is still within `rule`.
export function rateLimit(key: string, rule: RateLimitRule): RateLimitResult {
    const now = Date.now();
    if (buckets.size > MAX_TRACKED_KEYS) sweepExpired(now);

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
    }

    bucket.count += 1;
    return {
        allowed: bucket.count <= rule.limit,
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
}

// Checks several limits at once; every rule is counted so all windows advance together.
export function rateLimitAll(checks: { key: string; rule: RateLimitRule }[]): RateLimitResult {
    const results = checks.map(({ key, rule }) => rateLimit(key, rule));
    const blocked = results.filter(result => !result.allowed);
    if (blocked.length === 0) return { allowed: true, retryAfterSeconds: 0 };
    return { allowed: false, retryAfterSeconds: Math.max(...blocked.map(result => result.retryAfterSeconds)) };
}

export function clearRateLimit(key: string): void {
    buckets.delete(key);
}

// Behind the host's reverse proxy (Render, Railway, Fly, nginx…) the rightmost x-forwarded-for
// entry is the one the proxy appended; earlier entries are client-supplied and can be spoofed.
export function getClientIp(req: Request): string {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const hops = forwardedFor.split(',').map(hop => hop.trim()).filter(Boolean);
        if (hops.length > 0) return hops[hops.length - 1];
    }
    return req.headers.get('x-real-ip') ?? 'unknown';
}

export function tooManyRequests(retryAfterSeconds: number): NextResponse {
    const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
    return NextResponse.json(
        { error: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export const RATE_LIMITS = {
    loginPerAccount: { limit: 10, windowMs: FIFTEEN_MINUTES },
    loginPerIp: { limit: 50, windowMs: FIFTEEN_MINUTES },
    registerPerIp: { limit: 5, windowMs: ONE_HOUR },
    forgotPasswordPerEmail: { limit: 3, windowMs: FIFTEEN_MINUTES },
    forgotPasswordPerIp: { limit: 10, windowMs: FIFTEEN_MINUTES },
    resetPasswordPerIp: { limit: 20, windowMs: FIFTEEN_MINUTES },
} satisfies Record<string, RateLimitRule>;
