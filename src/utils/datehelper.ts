// utils/dateHelpers.ts
import jalaali from "jalaali-js";

/**
 * Convert Persian (Shamsi) date string to ISO string
 * @param persianDate - format "۱۴۰۴/۶/۱" or "1404/6/1"
 * @returns ISO string "2025-08-27T08:55:20.737Z"
 */
export const persianToISOString = (persianDate: string): string => {
    // Convert Persian digits to English
    const englishDate = persianDate.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776));

    // Split into year, month, day
    const [jy, jm, jd] = englishDate.split("/").map(Number);

    // Convert to Gregorian
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);

    // Get current time
    const now = new Date();
    const isoDate = new Date(
        gy,
        gm - 1,
        gd,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
    );

    return isoDate.toISOString();
};
