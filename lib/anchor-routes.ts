/**
 * RunIsrael AI — Anchor Routes Database
 * Use for maximum accuracy when user asks for general area (city) without specific A-to-B.
 * Priority: 1) Specific A-to-B → custom path. 2) Anchor city → this DB. 3) Other city → AI knowledge.
 */

export const ANCHOR_CITIES = ["Petah Tikva", "Tel Aviv", "Jerusalem", "Haifa"] as const;
export type AnchorCity = (typeof ANCHOR_CITIES)[number];

/** Normalized city names for matching (Hebrew + English, lowercase). */
const CITY_ALIASES: Record<string, AnchorCity> = {
  "petah tikva": "Petah Tikva",
  "petah tikvah": "Petah Tikva",
  "פתח תקווה": "Petah Tikva",
  "pt": "Petah Tikva",
  "tel aviv": "Tel Aviv",
  "tel-aviv": "Tel Aviv",
  "תל אביב": "Tel Aviv",
  "ta": "Tel Aviv",
  "jerusalem": "Jerusalem",
  "jerusalem israel": "Jerusalem",
  "ירושלים": "Jerusalem",
  "jlm": "Jerusalem",
  "haifa": "Haifa",
  "חיפה": "Haifa",
};

export interface AnchorRouteTier {
  short: string[];
  medium: string[];
  long: string[];
}

export const ANCHOR_ROUTES: Record<AnchorCity, AnchorRouteTier> = {
  "Petah Tikva": {
    short: [
      "Yarkon Park PT Loop",
      "Em Hamoshavot Promenade",
      "Kfar Ganim C trail",
    ],
    medium: [
      "Great Park to Tel Afek",
      "Neve Gan to Yarkon Sources",
    ],
    long: [
      "Petah Tikva to Tel Aviv Port (Yarkon Trail)",
    ],
  },
  "Tel Aviv": {
    short: ["Tayelet (beach promenade) short loop", "Charles Clore Park"],
    medium: ["Tayelet north–south", "Yarkon Park loop", "Mesila Park"],
    long: ["Tayelet full length", "Tel Aviv Port to Jaffa", "Yarkon Trail section"],
  },
  Jerusalem: {
    short: ["Mesila Park (Park HaMesila) loop", "Sacher Park loop", "Liberty Bell Garden"],
    medium: ["Mesila Park out-and-back", "German Colony to First Station", "Old City walls loop"],
    long: ["Mesila Park extended", "Jerusalem hills long run", "First Station to Ein Karem"],
  },
  Haifa: {
    short: ["Bat Galim promenade short", "Carmel Beach loop"],
    medium: ["Bat Galim to Carmel Beach", "Stella Maris loop"],
    long: ["Bat Galim promenade long", "Carmel to Bat Galim", "Haifa coastline long run"],
  },
};

/** Landmarks per anchor city (for context in prompts). */
export const ANCHOR_LANDMARKS: Record<AnchorCity, string[]> = {
  "Petah Tikva": ["Great Park", "Lake", "Beilinson", "Yad Labanim", "Neve Oz"],
  "Tel Aviv": ["Tayelet", "Yarkon Park", "Tel Aviv Port", "Jaffa", "Charles Clore"],
  Jerusalem: ["Mesila Park", "Sacher Park", "First Station", "German Colony", "Liberty Bell"],
  Haifa: ["Bat Galim", "Carmel Beach", "Stella Maris", "Carmel Center"],
};

export const DISTANCE_TIERS = {
  short: "~5 km",
  medium: "8–12 km",
  long: "15–21.1 km (half marathon)",
} as const;

/**
 * Returns anchor city if the given location string matches an anchor city (case-insensitive, Hebrew/English).
 */
export function getAnchorCity(location: string): AnchorCity | null {
  const normalized = location.trim().toLowerCase();
  if (!normalized) return null;
  return CITY_ALIASES[normalized] ?? null;
}

/**
 * Returns true if the location is one of the anchor cities.
 */
export function isAnchorCity(location: string): boolean {
  return getAnchorCity(location) !== null;
}

/**
 * Infers distance tier from a string like "5 km", "10km", "21 km", "30 minutes".
 */
export function inferDistanceTier(distanceOrTime: string): "short" | "medium" | "long" | undefined {
  const s = distanceOrTime.trim().toLowerCase();
  const kmMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:km|k|miles?|mi)/);
  const num = kmMatch ? parseFloat(kmMatch[1]) : null;
  if (num == null) return undefined;
  if (num <= 6) return "short";
  if (num <= 14) return "medium";
  return "long";
}

/**
 * Builds a prompt fragment for the AI: use anchor routes for this city, with distance tiers.
 */
export function buildAnchorContext(city: AnchorCity, distanceTier?: "short" | "medium" | "long"): string {
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
    lines.push("", `Prioritize **${distanceTier}** options from the list above.`);
  }
  return lines.join("\n");
}
