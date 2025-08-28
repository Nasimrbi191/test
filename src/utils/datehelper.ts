import jalaali from "jalaali-js";

/**
 * Convert a Persian date string (yyyy/mm/dd) to ISO string
 * @param persianDate - "1404/04/31"
 * @returns ISO string, e.g. "2025-07-22T00:00:00.000Z"
 */
export function persianToISOString(persianDate: string): string | null {
    if (!persianDate) return null;

    const parts = persianDate.split("/").map(Number);

    if (parts.length !== 3) return null;

    let [jy, jm, jd] = parts;

    try {
        // Validate and convert to Gregorian
        const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);

        // Create ISO string
        const date = new Date(gy, gm - 1, gd); // JS months are 0-based
        if (isNaN(date.getTime())) return null;

        return date.toISOString();
    } catch (err) {
        console.error("Invalid Persian date string:", persianDate);
        return null;
    }
}
