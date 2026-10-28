import { createHash, randomInt, timingSafeEqual } from 'crypto';

export const RESET_CODE_TTL_MS = 15 * 60 * 1000;
// After this many wrong guesses the code is invalidated and a new one must be requested.
export const MAX_RESET_CODE_ATTEMPTS = 5;

export function generateResetCode(): string {
    return randomInt(100000, 1000000).toString();
}

// Codes are stored hashed so a database leak does not expose live reset codes.
export function hashResetCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
}

export function resetCodeMatches(code: string, storedHash: string): boolean {
    const candidate = Buffer.from(hashResetCode(code), 'hex');
    const expected = Buffer.from(storedHash, 'hex');
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
