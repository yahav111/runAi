import type { AnchorCity } from "./cities";

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
    medium: ["Great Park to Tel Afek", "Neve Gan to Yarkon Sources"],
    long: ["Petah Tikva to Tel Aviv Port (Yarkon Trail)"],
  },
  "Tel Aviv": {
    short: ["Tayelet (beach promenade) short loop", "Charles Clore Park"],
    medium: ["Tayelet north–south", "Yarkon Park loop", "Mesila Park"],
    long: [
      "Tayelet full length",
      "Tel Aviv Port to Jaffa",
      "Yarkon Trail section",
    ],
  },
  Jerusalem: {
    short: [
      "Mesila Park (Park HaMesila) loop",
      "Sacher Park loop",
      "Liberty Bell Garden",
    ],
    medium: [
      "Mesila Park out-and-back",
      "German Colony to First Station",
      "Old City walls loop",
    ],
    long: [
      "Mesila Park extended",
      "Jerusalem hills long run",
      "First Station to Ein Karem",
    ],
  },
  Haifa: {
    short: ["Bat Galim promenade short", "Carmel Beach loop"],
    medium: ["Bat Galim to Carmel Beach", "Stella Maris loop"],
    long: [
      "Bat Galim promenade long",
      "Carmel to Bat Galim",
      "Haifa coastline long run",
    ],
  },
};

export const ANCHOR_LANDMARKS: Record<AnchorCity, string[]> = {
  "Petah Tikva": [
    "Great Park",
    "Lake",
    "Beilinson",
    "Yad Labanim",
    "Neve Oz",
  ],
  "Tel Aviv": [
    "Tayelet",
    "Yarkon Park",
    "Tel Aviv Port",
    "Jaffa",
    "Charles Clore",
  ],
  Jerusalem: [
    "Mesila Park",
    "Sacher Park",
    "First Station",
    "German Colony",
    "Liberty Bell",
  ],
  Haifa: ["Bat Galim", "Carmel Beach", "Stella Maris", "Carmel Center"],
};

export const DISTANCE_TIERS = {
  short: "~5 km",
  medium: "8–12 km",
  long: "15–21.1 km (half marathon)",
} as const;
