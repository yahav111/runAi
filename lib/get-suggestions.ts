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
    keywords: ["which city", "what city", "where would you like to run"],
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
    keywords: ["distance", "how far", "how long", "kilometers", "kilometer", "how many km"],
    chips: [
      { id: "under5", label: "📏 Under 5 km", text: "Under 5 km" },
      { id: "five-ten", label: "📏 5–10 km", text: "5 to 10 km" },
      { id: "twenty-one", label: "📏 21 km (half marathon)", text: "21 km (half marathon)" },
    ],
  },
];

/** Returns all chip groups whose keywords appear in the message (e.g. City + Distance). */
export function getDynamicChips(text: string, hasRoutes: boolean): ChipGroup[] {
  if (!text || typeof text !== "string") return [];

  if (hasRoutes) return [{ category: "", chips: [RESET_CHIP] }];

  const lower = text.toLowerCase();
  const groups: ChipGroup[] = [];

  for (const { category, keywords, chips } of CHIP_RULES) {
    const matched = keywords.some((kw) => lower.includes(kw));
    if (matched) groups.push({ category, chips });
  }

  if (groups.length === 0) return [];
  groups.push({ category: "", chips: [RESET_CHIP] });
  return groups;
}
