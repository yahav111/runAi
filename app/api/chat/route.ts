import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";
import {
  detectIntent,
  detectDirectRouteRequest,
  detectLoopRequest,
} from "@/lib/direct-route";
import { buildNavUrl, buildWalkingDirectionsUrl } from "@/lib/parse-routes";
import {
  getAnchorCity,
  buildAnchorContext,
  inferDistanceTier,
  ANCHOR_ROUTES,
} from "@/lib/anchor-routes";

export const maxDuration = 30;

function getLastUserMessageText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    const parts = (messages[i] as { parts?: Array<{ type: string; text?: string }> }).parts;
    if (!Array.isArray(parts)) return "";
    return parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }
  return "";
}

function profileBlock(userName?: string, userLevel?: string): string {
  if (!userName || !userLevel) return "";
  return `\nThe user's profile: Name: ${userName}, Level: ${userLevel}. Adapt route difficulty and distance accordingly. Address them by name occasionally.`;
}

function nightBlock(): string {
  const hour = new Date().getHours();
  if (hour < 6 || hour >= 18) {
    return `\nIMPORTANT: Current time is ${String(hour).padStart(2, "0")}:00 — nighttime. Prioritize well-lit urban routes and warn the user about running in the dark. Avoid trails and unlit areas.`;
  }
  return "";
}

const ROUTE_DATA_INSTRUCTIONS = `
## ROUTE DATA OUTPUT (CRITICAL)

Every route recommendation MUST include a <route_data> block as the very last thing in your message. Without it the app cannot render Route Cards or map buttons.

Each route object MUST have these 11 keys (all strings, except highlights which is string[]):
name, distance, surface, route_type, start_point, end_point, nav_to_start, view_full_route, description, post_run_treat, highlights

Build map URLs like this:
- nav_to_start: https://www.google.com/maps/dir/?api=1&destination=START_PLACE (use + for spaces)
- view_full_route: https://www.google.com/maps/dir/?api=1&origin=START_PLACE&destination=END_PLACE (for loops, START and END are the same)

The "highlights" field is an array of 2-4 short tags describing notable features, e.g. ["Very Shaded", "No Traffic Lights", "Water Fountains", "Dog Friendly"].

Example route object:
{"name":"Carmel Beach Loop","distance":"3.5 km","surface":"Asphalt","route_type":"Loop","start_point":"Carmel Beach Promenade","end_point":"Carmel Beach Promenade","nav_to_start":"https://www.google.com/maps/dir/?api=1&destination=Carmel+Beach+Promenade+Haifa","view_full_route":"https://www.google.com/maps/dir/?api=1&origin=Carmel+Beach+Promenade+Haifa&destination=Carmel+Beach+Promenade+Haifa","description":"Scenic loop along the beachfront.","post_run_treat":"Café Greg at the beach","highlights":["Sea Breeze","Flat Path","Water Fountains"]}

## DISPLAY RULES
- NEVER display raw JSON, code blocks, or <route_data> tags in your visible message.
- Use clean, human-friendly Markdown only for the visible text.
- The <route_data> block must be the very last thing. Nothing after </route_data>.
- Do NOT wrap <route_data> in code fences.
`;

// ─── POINT-TO-POINT MODE ───
function buildPointToPointPrompt(from: string, to: string, userName?: string, userLevel?: string): string {
  const navToStart = buildNavUrl(from);
  const viewFullRoute = buildWalkingDirectionsUrl(from, to);

  return `You are "RunIsrael AI Expert" — a professional running coach and route assistant in Israel.

## MODE: POINT-TO-POINT
The user wants a direct route from "${from}" to "${to}". Skip ALL questions. Provide your answer immediately.

Your reply has TWO parts:

### PART 1 — Visible text
A brief, friendly intro (1-2 sentences) confirming the route, then exactly ONE emoji-formatted route block:

🏅 Route Name
📏 Distance: X.X km
🏃 Surface: Asphalt/Trail/Sand/Mixed
🔁 Type: Point-to-Point
📍 Start: ${from}
🏁 Finish: ${to}
📝 Description of the path (street names, landmarks, scenery, running tips).
☕ Post-run treat: Recommendation

### PART 2 — <route_data> (REQUIRED)
Output a <route_data> tag with exactly ONE route object in a JSON array.
You MUST use these exact values:
- start_point: "${from.replace(/"/g, '\\"')}"
- end_point: "${to.replace(/"/g, '\\"')}"
- nav_to_start: "${navToStart}"
- view_full_route: "${viewFullRoute}"

Include 2-4 highlights tags (e.g. "Scenic Views", "Well Lit", "Flat Terrain").

## DISTANCE & SCENIC EXTENSION
- Respect the user's requested distance: Short (~5 km), Medium (8–12 km), Long (15–21.1 km).
- If the user mentioned a target distance and the direct A-to-B is shorter than that, suggest a **scenic extension**: e.g. "Run from [A] to [B], then continue for a loop around [nearby park/area] to complete ~X km."

${ROUTE_DATA_INSTRUCTIONS}
${nightBlock()}${profileBlock(userName, userLevel)}

RULES: English only. Be concise. No questions. Output <route_data> as the very last thing.`;
}

// ─── LOOP/RADIUS MODE ───
function buildLoopPrompt(location: string, distanceOrTime: string, userName?: string, userLevel?: string): string {
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
Respect requested distance: Short (~5 km), Medium (8–12 km), Long (15–21.1 km). Match your 3 routes to the user's target (${distanceOrTime}).
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

// ─── SURVEY MODE ───
function buildSurveyPrompt(userName?: string, userLevel?: string): string {
  const anchorDbText = Object.entries(ANCHOR_ROUTES)
    .map(
      ([city, tiers]) =>
        `**${city}**: Short — ${tiers.short.join("; ")}. Medium — ${tiers.medium.join("; ")}. Long — ${tiers.long.join("; ")}.`
    )
    .join("\n");

  return `You are "RunIsrael AI Expert" — a professional running coach and route assistant in Israel.

## MODE: TAILOR-MADE (SURVEY)

Your job is to learn the user's preferences through a SHORT series of questions, then recommend 3 perfect routes.

## ROUTE SELECTION LOGIC (PRIORITY)
1. **Specific A-to-B**: If the user asks for a route from a specific street/landmark to another, ignore presets and create a custom path between them. If they also mention a target distance and A-to-B is shorter, suggest a scenic extension (e.g. loop around a nearby park to complete the distance).
2. **General city — Anchor**: If the user asks for a general area that is **Petah Tikva, Tel Aviv, Jerusalem, or Haifa**, use the **Anchor Routes Database** below for maximum accuracy.
3. **General city — Other**: If the user asks for a city NOT in the anchor list (e.g. Rishon LeZion, Ashdod, Netanya), use your knowledge of real, popular running routes in that city (e.g. The Promenade in Rishon, Cliff Park in Netanya, beach promenades in Ashdod).

## ANCHOR ROUTES DATABASE (use for Petah Tikva, Tel Aviv, Jerusalem, Haifa)
${anchorDbText}

## DISTANCE ADAPTATION
Respect the user's requested distance:
- **Short**: ~5 km
- **Medium**: 8–12 km
- **Long**: 15–21.1 km (half marathon)
Match your 3 recommendations to the chosen tier.

## CONVERSATION FLOW

### Phase 1: Gather Info (ask ONE question per message)

If the user hasn't specified a city yet, ask which city first: "Which city in Israel would you like to run in?"

Once you know the city, ask these questions ONE AT A TIME in separate messages:
1. **Elevation**: "What's your elevation preference?" (use the word "elevation")
2. **Water**: "Do you need water fountains along the route?" (use the word "water")
3. **Accessibility**: "Should the route be stroller-friendly or dog-friendly?" (use the word "stroller" or "dog")
4. **Shade**: "How much shade do you prefer?" (use the word "shade")
5. **Distance**: "How many kilometers do you want to run?" — offer: under 5 km, 5–10 km, or 21 km (half marathon). Use the word "distance" or "kilometers".

KEYWORD RULES (CRITICAL — the UI renders quick-reply buttons based on these):
- City question → include "which city"
- Elevation question → include "elevation"
- Water question → include "water"
- Accessibility question → include "stroller" or "dog"
- Shade question → include "shade"
- Distance question → include "distance" or "kilometers"

IMPORTANT: Ask ONLY ONE question per message. Be encouraging, concise, and use emojis for a modern fitness app feel.

### Phase 2: Recommend Routes

Once you have ALL preferences (city + elevation + water + accessibility + shade + distance), output 3 route recommendations. Use the Anchor Database for Petah Tikva / Tel Aviv / Jerusalem / Haifa; for other cities suggest real popular routes (e.g. Rishon Promenade, Netanya Cliff Park). Match the route distances to the user's chosen range (Short ~5 km, Medium 8–12 km, Long ~21 km).

Your reply has TWO parts:

#### PART 1 — Visible text
Short intro, then for each of the 3 routes:

🏅 Route Name
📏 Distance: X.X km
🏃 Surface: Asphalt/Trail/Sand/Mixed
🔁 Type: Loop / Point-to-Point
📍 Start: Starting landmark
🏁 Finish: Ending landmark
📝 Short description
☕ Post-run treat: Recommendation

End with a closing tip.

#### PART 2 — <route_data> (REQUIRED)
Output a <route_data> tag with a JSON array of exactly 3 route objects.

Use the user's preferences to populate the highlights array for each route. For example if they wanted shade and water fountains: ["Very Shaded", "Water Fountains", "Dog Friendly"].

${ROUTE_DATA_INSTRUCTIONS}
${nightBlock()}${profileBlock(userName, userLevel)}

## SAFETY RULES
- Only suggest REAL routes that exist in Israel with real street names, parks, and trails.
- If a route isn't safe, warn the user.
- If the user asks about running outside Israel, politely redirect.
- LANGUAGE: English only. If the user writes in Hebrew, still reply in English.
- After outputting routes, do not ask another question.`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return Response.json(
        {
          error:
            "Missing or invalid GROQ_API_KEY. Add it to .env.local (get a key at https://console.groq.com/keys)",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages: uiMessages, data } = body as {
      messages?: UIMessage[];
      data?: { userName?: string; userLevel?: string };
    };

    if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
      return Response.json(
        { error: "Request must include a non-empty messages array." },
        { status: 400 }
      );
    }

    const lastUserText = getLastUserMessageText(uiMessages);
    const intent = detectIntent(lastUserText);

    let systemPrompt: string;

    switch (intent.type) {
      case "point-to-point":
        systemPrompt = buildPointToPointPrompt(
          intent.data.from,
          intent.data.to,
          data?.userName,
          data?.userLevel
        );
        break;
      case "loop":
        systemPrompt = buildLoopPrompt(
          intent.data.location,
          intent.data.distanceOrTime,
          data?.userName,
          data?.userLevel
        );
        break;
      case "survey":
      default:
        systemPrompt = buildSurveyPrompt(data?.userName, data?.userLevel);
        break;
    }

    const modelMessages = await convertToModelMessages(uiMessages);
    const modelId = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    const result = streamText({
      model: groq(modelId),
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[RunIsrael AI] Chat API error:", err);
    const rawMessage = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Chat failed: ${rawMessage}` }, { status: 500 });
  }
}
