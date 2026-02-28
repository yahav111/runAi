import type {
  SuggestionChip,
  ChipGroup,
  InitialRouteType,
} from "@/lib/types";

export type { SuggestionChip, ChipGroup, InitialRouteType };

export const RESET_CHIP: SuggestionChip = {
  id: "__reset__",
  label: "🔄 Start Over",
  text: "__reset__",
  variant: "reset",
};

export const CITY_CHIPS: SuggestionChip[] = [
  { id: "telaviv", label: "🏙️ Tel Aviv", text: "Tel Aviv" },
  { id: "jerusalem", label: "🕌 Jerusalem", text: "Jerusalem" },
  { id: "haifa", label: "⛰️ Haifa", text: "Haifa" },
  { id: "eilat", label: "🏖️ Eilat", text: "Eilat" },
];

interface ChipRule {
  category: string;
  keywords: string[];
  chips: SuggestionChip[];
}

const CHIP_RULES: ChipRule[] = [
  {
    category: "City",
    keywords: [
      "which city",
      "what city",
      "where would you like to run",
      "where would you like to start",
      "where you'd like to start",
      "start and finish",
      "where to start",
      "where to start and finish",
      "start your run",
      "landmark",
      "popular area",
    ],
    chips: CITY_CHIPS,
  },
  {
    category: "Elevation",
    keywords: ["elevation", "hills", "flat or"],
    chips: [
      { id: "flat", label: "🏃 Flat", text: "Flat" },
      { id: "rolling", label: "⛰️ Rolling Hills", text: "Rolling Hills" },
      { id: "steep", label: "🔼 Steep Climbs", text: "Steep Climbs" },
    ],
  },
  {
    category: "Water",
    keywords: ["water fountain", "water along", "need water"],
    chips: [
      {
        id: "water-yes",
        label: "💧 Yes, need water",
        text: "Yes, I need water fountains",
      },
      {
        id: "water-no",
        label: "🚫 No, I carry my own",
        text: "No, I carry my own water",
      },
    ],
  },
  {
    category: "Accessibility",
    keywords: ["stroller", "dog friendly", "dog-friendly", "accessible"],
    chips: [
      {
        id: "stroller",
        label: "👶 Stroller-friendly",
        text: "Stroller-friendly",
      },
      { id: "dog", label: "🐕 Dog-friendly", text: "Dog-friendly" },
      {
        id: "neither",
        label: "🏃 Neither needed",
        text: "No special accessibility needed",
      },
    ],
  },
  {
    category: "Shade",
    keywords: ["shade", "sun exposure", "shaded"],
    chips: [
      { id: "full-shade", label: "🌳 Full Shade", text: "Full shade" },
      {
        id: "partial-shade",
        label: "⛅ Partial Shade",
        text: "Partial shade",
      },
      {
        id: "open-sun",
        label: "☀️ Open / No Preference",
        text: "Open sun is fine",
      },
    ],
  },
  {
    category: "Route type",
    keywords: ["route type", "circular loop", "point-to-point"],
    chips: [
      { id: "loop", label: "🔄 Circular Loop", text: "Circular loop" },
      { id: "p2p", label: "➡️ Point-to-Point", text: "Point-to-point" },
    ],
  },
  {
    category: "Surface",
    keywords: ["surface", "paved", "asphalt", "terrain"],
    chips: [
      { id: "asphalt", label: "🛣️ Asphalt", text: "Asphalt" },
      { id: "trails", label: "🌲 Trails", text: "Trails" },
      { id: "sand", label: "🏖️ Sand", text: "Sand" },
      { id: "mixed", label: "🔀 Mixed", text: "Mixed" },
    ],
  },
  {
    category: "Distance",
    keywords: [
      "distance",
      "how far",
      "how long",
      "kilometers",
      "kilometer",
      "how many km",
      "desired distance",
      "your distance",
      "which one sounds",
      "which one",
      "short (about",
      "medium (about",
      "long (about",
      "5-10 km",
      "10-15 km",
      "15-21 km",
    ],
    chips: [
      {
        id: "short",
        label: "📏 Short (up to 4 km)",
        text: "Short – up to 4 km",
      },
      {
        id: "medium",
        label: "📏 Medium (4–8 km)",
        text: "Medium – 4 to 8 km",
      },
      {
        id: "long",
        label: "📏 Long (8+ km)",
        text: "Long – 8 km or more",
      },
    ],
  },
];

function getLastSegment(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const segments = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const last = segments[segments.length - 1];
  if (last) return last;
  return trimmed.length > 250 ? trimmed.slice(-250) : trimmed;
}

export function getDynamicChips(
  text: string,
  hasRoutes: boolean,
  initialRouteType?: InitialRouteType | null
): ChipGroup[] {
  if (!text || typeof text !== "string") return [];

  if (hasRoutes) return [{ category: "", chips: [RESET_CHIP] }];

  const lastSegment = getLastSegment(text).toLowerCase();
  const fullLower = text.toLowerCase();

  const skipRouteType = (category: string) =>
    category === "Route type" && initialRouteType != null;

  for (const { category, keywords, chips } of CHIP_RULES) {
    if (skipRouteType(category)) continue;
    const matchInLast = keywords.some((kw) => lastSegment.includes(kw));
    if (matchInLast) {
      return [{ category, chips }, { category: "", chips: [RESET_CHIP] }];
    }
  }

  let bestIndex = -1;
  let bestGroup: ChipGroup | null = null;
  for (const { category, keywords, chips } of CHIP_RULES) {
    if (skipRouteType(category)) continue;
    for (const kw of keywords) {
      const idx = fullLower.lastIndexOf(kw);
      if (idx !== -1 && idx > bestIndex) {
        bestIndex = idx;
        bestGroup = { category, chips };
      }
    }
  }
  if (bestGroup) {
    return [bestGroup, { category: "", chips: [RESET_CHIP] }];
  }
  return [];
}
