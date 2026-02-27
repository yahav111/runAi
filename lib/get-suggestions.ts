export interface SuggestionChip {
  id: string;
  label: string;
  text: string;
  variant?: "default" | "reset";
}

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

export interface ChipGroup {
  category: string;
  chips: SuggestionChip[];
}

const CHIP_RULES: { category: string; keywords: string[]; chips: SuggestionChip[] }[] = [
  {
    category: "City",
    keywords: [
      "which city",
      "what city",
      "where would you like to run",
      "where would you like to start",
      "start your run",
      "where to start",
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
      { id: "water-yes", label: "💧 Yes, need water", text: "Yes, I need water fountains" },
      { id: "water-no", label: "🚫 No, I carry my own", text: "No, I carry my own water" },
    ],
  },
  {
    category: "Accessibility",
    keywords: ["stroller", "dog friendly", "dog-friendly", "accessible"],
    chips: [
      { id: "stroller", label: "👶 Stroller-friendly", text: "Stroller-friendly" },
      { id: "dog", label: "🐕 Dog-friendly", text: "Dog-friendly" },
      { id: "neither", label: "🏃 Neither needed", text: "No special accessibility needed" },
    ],
  },
  {
    category: "Shade",
    keywords: ["shade", "sun exposure", "shaded"],
    chips: [
      { id: "full-shade", label: "🌳 Full Shade", text: "Full shade" },
      { id: "partial-shade", label: "⛅ Partial Shade", text: "Partial shade" },
      { id: "open-sun", label: "☀️ Open / No Preference", text: "Open sun is fine" },
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
      { id: "under5", label: "📏 Under 5 km", text: "Under 5 km" },
      { id: "five-ten", label: "📏 5–10 km", text: "5 to 10 km" },
      { id: "twenty-one", label: "📏 21 km (half marathon)", text: "21 km (half marathon)" },
    ],
  },
];

/** Returns the last question/segment of the message (so we show chips only for that). */
function getLastSegment(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  // Split by sentence-ending punctuation, take last segment
  const segments = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const last = segments[segments.length - 1];
  if (last) return last;
  // Fallback: last ~250 chars (covers one short paragraph)
  return trimmed.length > 250 ? trimmed.slice(-250) : trimmed;
}

/** Returns only chip groups that match the *last* question in the message (one category max). */
export function getDynamicChips(text: string, hasRoutes: boolean): ChipGroup[] {
  if (!text || typeof text !== "string") return [];

  if (hasRoutes) return [{ category: "", chips: [RESET_CHIP] }];

  const lastSegment = getLastSegment(text).toLowerCase();
  const fullLower = text.toLowerCase();

  // Prefer match in last segment only; if none, allow match in full message for backwards compatibility
  for (const { category, keywords, chips } of CHIP_RULES) {
    const matchInLast = keywords.some((kw) => lastSegment.includes(kw));
    if (matchInLast) {
      return [{ category, chips }, { category: "", chips: [RESET_CHIP] }];
    }
  }
  // Fallback: pick the category whose keyword appears *latest* in the message (current topic)
  let bestIndex = -1;
  let bestGroup: ChipGroup | null = null;
  for (const { category, keywords, chips } of CHIP_RULES) {
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
