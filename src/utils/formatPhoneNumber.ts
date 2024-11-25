export function formatPhoneNumber(number: string): string | null {
    const cleanedNumber = number.replace(/\D/g, "");
    if (cleanedNumber.length !== 12) {
        return null;
    }

    if (cleanedNumber.startsWith("992")) {
        return `+${cleanedNumber}`;
    } else {
        return null;
    }
}
