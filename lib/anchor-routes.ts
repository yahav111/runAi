export {
  type AnchorCity,
  ANCHOR_CITIES,
  getAnchorCity,
  isAnchorCity,
} from "@/lib/constants/cities";

export {
  type AnchorRouteTier,
  ANCHOR_ROUTES,
  ANCHOR_LANDMARKS,
  DISTANCE_TIERS,
} from "@/lib/constants/anchor-routes-data";

import type { AnchorCity } from "@/lib/constants/cities";
import {
  ANCHOR_ROUTES,
  ANCHOR_LANDMARKS,
} from "@/lib/constants/anchor-routes-data";

export function inferDistanceTier(
  distanceOrTime: string
): "short" | "medium" | "long" | undefined {
  const s = distanceOrTime.trim().toLowerCase();
  const kmMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:km|k|miles?|mi)/);
  const num = kmMatch ? parseFloat(kmMatch[1]) : null;
  if (num == null) return undefined;
  if (num <= 6) return "short";
  if (num <= 14) return "medium";
  return "long";
}

export function buildAnchorContext(
  city: AnchorCity,
  distanceTier?: "short" | "medium" | "long"
): string {
  const routes = ANCHOR_ROUTES[city];
  const landmarks = ANCHOR_LANDMARKS[city];
  const lines: string[] = [
    `## ANCHOR ROUTES (use for maximum accuracy) — ${city}`,
    `Landmarks: ${landmarks.join(", ")}.`,
    "",
    "- **Short (~5 km):** " + routes.short.join("; "),
    "- **Medium (8–12 km):** " + routes.medium.join("; "),
    "- **Long (15–21.1 km):** " + routes.long.join("; "),
  ];
  if (distanceTier) {
    lines.push(
      "",
      `Prioritize **${distanceTier}** options from the list above.`
    );
  }
  return lines.join("\n");
}
