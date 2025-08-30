import jalaali from "jalaali-js";

/**
 * Convert Persian date string (with Persian digits) to ISO string
 */
export function persianToISOString(persianDate: string): string | null {
    if (!persianDate) return null;

    // Convert Persian digits to English digits
    const normalized = persianDate.replace(/[۰-۹]/g, d =>
        String(d.charCodeAt(0) - 1776)
    );

    const parts = normalized.split("/").map(Number);
    if (parts.length !== 3) return null;

    const [jy, jm, jd] = parts;

    // Validate month
    if (jm < 1 || jm > 12) return null;

    // Validate day based on month
    const maxDays = jm <= 6 ? 31 : jm <= 11 ? 30 : (jalaali.isLeapJalaaliYear(jy) ? 30 : 29);
    if (jd < 1 || jd > maxDays) return null;

    try {
        const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
        const date = new Date(Date.UTC(gy, gm - 1, gd)); // use UTC to avoid timezone shifts
        if (isNaN(date.getTime())) return null;

        return date.toISOString();
    } catch (err) {
        console.error("Invalid Persian date string:", persianDate, err);
        return null;
    }
}
