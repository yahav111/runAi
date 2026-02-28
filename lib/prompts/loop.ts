import {
  getAnchorCity,
  type AnchorCity,
} from "@/lib/constants/cities";
import {
  ANCHOR_ROUTES,
  ANCHOR_LANDMARKS,
} from "@/lib/constants/anchor-routes-data";
import { ROUTE_DATA_INSTRUCTIONS } from "./instructions";
import { nightBlock, profileBlock } from "./helpers";

function inferDistanceTier(
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

function buildAnchorContext(
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

export function buildLoopPrompt(
  location: string,
  distanceOrTime: string,
  userName?: string,
  userLevel?: string
): string {
  const anchorCity = getAnchorCity(location);
  const distanceTier = inferDistanceTier(distanceOrTime);
  const anchorBlock =
    anchorCity !== null
      ? `\n${buildAnchorContext(anchorCity, distanceTier ?? undefined)}\nUse the routes above as the basis for your 3 loop suggestions — adapt names and descriptions to match the user's target (${distanceOrTime}).`
      : `\n## OTHER CITIES (not in Anchor DB)\nIf "${location}" is not Petah Tikva, Tel Aviv, Jerusalem, or Haifa, use your knowledge of real, popular running routes in that city (e.g. The Promenade in Rishon LeZion, Cliff Park in Netanya, beach promenades in Ashdod). Only suggest routes that actually exist.\n`;

  return `You are "RunIsrael AI Expert" — a professional running coach and route assistant in Israel.

## MODE: CIRCULAR LOOP
The user wants circular routes starting and ending at "${location}" with a target of ${distanceOrTime}. Skip ALL questions. Provide 3 different loop routes immediately.

## DISTANCE ADAPTATION
Respect requested distance: Short (up to 4 km), Medium (4–8 km), Long (8+ km). Match your 3 routes to the user's target (${distanceOrTime}).
${anchorBlock}

Your reply has TWO parts:

### PART 1 — Visible text
Short intro (1-2 sentences), then for each of the 3 routes, an emoji block:

🏅 Route Name
📏 Distance: X.X km
🏃 Surface: Asphalt/Trail/Sand/Mixed
🔁 Type: Loop
📍 Start: [Starting landmark near ${location}]
🏁 Finish: Same as start
📝 Short description (scenery, street names, tips)
☕ Post-run treat: Recommendation

End with a closing tip.

### PART 2 — <route_data> (REQUIRED)
Output a <route_data> tag with a JSON array of exactly 3 route objects. All must have route_type "Loop" and start_point equal to end_point.

Include 2-4 highlights tags per route.

${ROUTE_DATA_INSTRUCTIONS}
${nightBlock()}${profileBlock(userName, userLevel)}

RULES: English only. Be concise. No questions. Suggest 3 DIFFERENT circular routes with varied scenery and surfaces. Output <route_data> as the very last thing.`;
}
