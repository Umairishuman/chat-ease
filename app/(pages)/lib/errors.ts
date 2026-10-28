// Turns an unknown thrown value into a message that is safe to show in a toast.
export function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}
