/**
 * Route distance validation: keep displayed distance within 30% of actual (map) distance.
 */

/** Parse declared distance string to number (e.g. "21 km" -> 21, "3.5 km" -> 3.5). */
export function parseDeclaredKm(distanceStr: string): number | null {
  if (!distanceStr || typeof distanceStr !== "string") return null;
  const m = distanceStr.trim().match(/^(\d+(?:\.\d+)?)\s*(?:km|k|m)?$/i);
  return m ? parseFloat(m[1]) : null;
}

/** Format km number for display (e.g. 1 -> "1 km", 3.5 -> "3.5 km"). */
export function formatDistanceKm(km: number): string {
  return Number.isInteger(km) ? `${km} km` : `${km.toFixed(1)} km`;
}

const TOLERANCE = 0.3; // 30%

/**
 * Returns true if declared is within 30% of actual (either direction).
 * If actual is 0 we consider it within tolerance (avoid div by zero).
 */
export function isWithinTolerance(
  declaredKm: number,
  actualKm: number,
  tolerancePercent: number = 30
): boolean {
  if (actualKm <= 0) return true;
  const ratio = declaredKm / actualKm;
  const tolerance = tolerancePercent / 100;
  return ratio >= 1 - tolerance && ratio <= 1 + tolerance;
}

/**
 * If declared distance is outside the allowed tolerance from actual,
 * return the actual distance string for display; otherwise return null (keep declared).
 */
export function correctDistanceIfNeeded(
  declaredStr: string,
  actualKm: number,
  tolerancePercent: number = 30
): string | null {
  const declared = parseDeclaredKm(declaredStr);
  if (declared == null || actualKm <= 0) return null;
  if (isWithinTolerance(declared, actualKm, tolerancePercent)) return null;
  return formatDistanceKm(Math.round(actualKm * 10) / 10);
}
