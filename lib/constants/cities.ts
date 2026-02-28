export const ANCHOR_CITIES = ["Petah Tikva", "Tel Aviv", "Jerusalem", "Haifa"] as const;
export type AnchorCity = (typeof ANCHOR_CITIES)[number];

export const CITY_ALIASES: Record<string, string> = {
  "petah tikva": "Petah Tikva",
  "petah tikvah": "Petah Tikva",
  "פתח תקווה": "Petah Tikva",
  pt: "Petah Tikva",
  "tel aviv": "Tel Aviv",
  "tel-aviv": "Tel Aviv",
  "תל אביב": "Tel Aviv",
  ta: "Tel Aviv",
  jerusalem: "Jerusalem",
  "jerusalem israel": "Jerusalem",
  "ירושלים": "Jerusalem",
  jlm: "Jerusalem",
  haifa: "Haifa",
  "חיפה": "Haifa",
  eilat: "Eilat",
  "אילת": "Eilat",
};

export const KNOWN_CITIES = [
  "jerusalem",
  "tel aviv",
  "haifa",
  "eilat",
  "petah tikva",
  "rishon",
  "netanya",
  "ashdod",
];

export function resolveCity(input: string): string | null {
  return CITY_ALIASES[input.trim().toLowerCase()] ?? null;
}

export function getAnchorCity(location: string): AnchorCity | null {
  const resolved = resolveCity(location);
  if (!resolved) return null;
  return (ANCHOR_CITIES as readonly string[]).includes(resolved)
    ? (resolved as AnchorCity)
    : null;
}

export function isAnchorCity(location: string): boolean {
  return getAnchorCity(location) !== null;
}
