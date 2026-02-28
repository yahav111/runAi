import type { SurveyCategory } from "@/lib/types";

export const SURVEY_CATEGORIES: SurveyCategory[] = [
  {
    key: "city",
    label: "City",
    keywords: [
      "which city",
      "what city",
      "where would you like to run",
      "where to start",
      "where would you like to start",
    ],
  },
  {
    key: "elevation",
    label: "Elevation",
    keywords: ["elevation", "hills", "flat or", "rolling", "steep"],
  },
  {
    key: "water",
    label: "Water",
    keywords: [
      "water fountain",
      "water along",
      "need water",
      "water stops",
      "carry your own water",
    ],
  },
  {
    key: "accessibility",
    label: "Accessibility",
    keywords: ["stroller", "dog friendly", "dog-friendly", "accessible"],
  },
  {
    key: "shade",
    label: "Shade",
    keywords: ["shade", "sun exposure", "shaded"],
  },
  {
    key: "distance",
    label: "Distance",
    keywords: [
      "distance",
      "kilometers",
      "how many km",
      "how far",
      "5-10 km",
      "under 5",
      "21 km",
      "half marathon",
    ],
  },
];
