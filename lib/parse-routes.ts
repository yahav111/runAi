export interface Route {
  name: string;
  distance: string;
  surface: "Asphalt" | "Trail" | "Sand" | "Mixed";
  route_type: "Loop" | "Point-to-Point";
  start_point: string;
  end_point: string;
  nav_to_start: string;
  view_full_route: string;
  description: string;
  post_run_treat: string;
  highlights: string[];
}

export interface TextSegment {
  type: "text";
  content: string;
}

export interface RoutesSegment {
  type: "routes";
  routes: Route[];
}

export type MessageSegment = TextSegment | RoutesSegment;

const ROUTE_DATA_RE = /<route_data>([\s\S]*?)<\/route_data>/;
const DATA_HIDDEN_RE = /<data_hidden>([\s\S]*?)<\/data_hidden>/;
const ROUTES_TAG = "[ROUTES_JSON:";

function stripCodeFences(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n?```[a-z]*\s*\n?/gi, "\n")
    .replace(/\n?```\s*\n?/g, "\n");
}

function extractRouteData(text: string): { full: string; json: string } | null {
  const m = text.match(ROUTE_DATA_RE);
  if (!m) return null;
  return { full: m[0], json: m[1].trim() };
}

function extractDataHidden(text: string): { full: string; json: string } | null {
  const m = text.match(DATA_HIDDEN_RE);
  if (!m) return null;
  return { full: m[0], json: m[1].trim() };
}

function extractBracketCounting(text: string): { full: string; json: string } | null {
  const tagIdx = text.indexOf(ROUTES_TAG);
  if (tagIdx === -1) return null;

  const afterTag = text.slice(tagIdx + ROUTES_TAG.length);
  const arrStart = afterTag.indexOf("[");
  if (arrStart === -1) return null;

  let depth = 0;
  let inStr = false;
  let i = arrStart;

  while (i < afterTag.length) {
    const c = afterTag[i];
    if (inStr) {
      if (c === "\\") { i += 2; continue; }
      if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '"') { inStr = true; i++; continue; }
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) {
        const json = afterTag.slice(arrStart, i + 1);
        const rest = afterTag.slice(i + 1);
        const closingBracket = rest.match(/^\s*\]/);
        const fullLen =
          ROUTES_TAG.length + arrStart + (i - arrStart + 1) +
          (closingBracket ? closingBracket[0].length : 0);
        return { full: text.slice(tagIdx, tagIdx + fullLen), json };
      }
    }
    i++;
  }
  return null;
}

function extractRegex(text: string): { full: string; json: string } | null {
  const re = /\[ROUTES_JSON:\s*(\[[\s\S]*\])\s*\]/;
  const m = text.match(re);
  if (!m) return null;
  return { full: m[0], json: m[1] };
}

function extractBareArray(text: string): { full: string; json: string } | null {
  const re = /(\[\s*\{[\s\S]*?"(?:nav_to_start|waze_link|view_full_route)"[\s\S]*?\}\s*\])/;
  const m = text.match(re);
  if (!m) return null;
  return { full: m[0], json: m[0] };
}

const SURFACE_MAP: Record<string, Route["surface"]> = {
  asphalt: "Asphalt",
  trail: "Trail",
  trails: "Trail",
  sand: "Sand",
  mixed: "Mixed",
};

function sanitiseJson(raw: string): string {
  return raw
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/,(\s*[}\]])/g, "$1")
    .replace(/\s*\/\/[^\n]*/g, "")
    .trim();
}

function str(val: unknown, fallback = ""): string {
  if (typeof val === "string" && val.trim()) return val.trim();
  return fallback;
}

function getAddressFromWaze(wazeLink: string): string {
  try {
    const url = new URL(wazeLink);
    const q = url.searchParams.get("q");
    return q ? decodeURIComponent(q) : "";
  } catch {
    return "";
  }
}

export function buildNavUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function buildRouteUrl(origin: string, destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
}

/** Google Maps directions URL with walking mode (for direct point-to-point routes). */
export function buildWalkingDirectionsUrl(origin: string, destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
}

/** Match one emoji route block (name through post-run treat). Description may be multi-line. */
const EMOJI_ROUTE_BLOCK =
  /🏅\s*([^\n]+)\s*\n\s*📏\s*Distance:\s*([^\n]+)\s*\n\s*🏃\s*Surface:\s*([^\n]+)\s*\n\s*🔁\s*Type:\s*([^\n]+)\s*\n\s*📍\s*Start:\s*([^\n]+)\s*\n\s*🏁\s*Finish:\s*([^\n]+)\s*\n\s*📝\s*([\s\S]+?)\s*\n\s*☕\s*Post-run treat:\s*([^\n]+)/gi;

function parseSurface(s: string): Route["surface"] {
  const lower = s.toLowerCase();
  if (lower.includes("asphalt") && !lower.includes("sand") && !lower.includes("trail")) return "Asphalt";
  if (lower.includes("trail")) return "Trail";
  if (lower.includes("sand")) return "Sand";
  return "Mixed";
}

/**
 * Fallback: when the LLM didn't output <route_data>, try to parse the visible
 * emoji-formatted route blocks and build Route objects with generated map URLs.
 */
function parseRoutesFromEmojiText(content: string): Route[] | null {
  const routes: Route[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(EMOJI_ROUTE_BLOCK.source, "gi");
  while ((m = re.exec(content)) !== null) {
    const [, name, distance, surface, routeType, startPoint, endPoint, description, postRunTreat] = m;
    if (!name?.trim() || !startPoint?.trim() || !endPoint?.trim()) continue;
    const start = startPoint.trim();
    const end = endPoint.trim();
    routes.push({
      name: name.trim().replace(/^🏅\s*/, "").trim() || name.trim(),
      distance: (distance ?? "").trim(),
      surface: parseSurface(surface ?? ""),
      route_type: (routeType ?? "").toLowerCase().includes("point") ? "Point-to-Point" : "Loop",
      start_point: start,
      end_point: end,
      nav_to_start: buildNavUrl(start),
      view_full_route: buildRouteUrl(start, end),
      description: (description ?? "").trim(),
      post_run_treat: (postRunTreat ?? "").trim() || "Ask a local!",
      highlights: [],
    });
  }
  return routes.length >= 1 ? routes : null;
}

/**
 * Normalize any object the LLM might produce into our Route interface.
 * Handles both the new field names and all previous schema variations.
 */
function normalizeRoute(raw: Record<string, unknown>): Route | null {
  const name = str(raw.name);
  if (!name) return null;

  const distance = str(raw.distance) || str(raw.dist);
  if (!distance) return null;

  const description = str(raw.description);
  if (!description) return null;

  const surfaceRaw = str(raw.surface) || str(raw.type);
  const surface: Route["surface"] = SURFACE_MAP[surfaceRaw.toLowerCase()] ?? "Mixed";

  const rtRaw = str(raw.route_type).toLowerCase();
  const route_type: Route["route_type"] =
    rtRaw.includes("point") ? "Point-to-Point" : "Loop";

  const start_point =
    str(raw.start_point) ||
    str(raw.start_landmark) ||
    str(raw.start_address) ||
    (typeof raw.waze_link === "string" ? getAddressFromWaze(raw.waze_link) : "") ||
    name;

  const end_point =
    str(raw.end_point) ||
    str(raw.end_landmark) ||
    str(raw.end_address) ||
    (route_type === "Loop" ? start_point : start_point);

  const nav_to_start =
    str(raw.nav_to_start) ||
    str(raw.waze_link) ||
    buildNavUrl(start_point);

  const view_full_route =
    str(raw.view_full_route) ||
    buildRouteUrl(start_point, end_point);

  const post_run_treat = str(raw.post_run_treat, "Ask a local!");

  let highlights: string[] = [];
  if (Array.isArray(raw.highlights)) {
    highlights = raw.highlights
      .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
      .map((h) => h.trim());
  }

  return {
    name,
    distance,
    surface,
    route_type,
    start_point,
    end_point,
    nav_to_start,
    view_full_route,
    description,
    post_run_treat,
    highlights,
  };
}

function tryParseRoutes(jsonStr: string): Route[] | null {
  try {
    const parsed = JSON.parse(sanitiseJson(jsonStr));
    if (!Array.isArray(parsed)) return null;

    const routes: Route[] = [];
    for (const obj of parsed) {
      if (!obj || typeof obj !== "object") continue;
      const route = normalizeRoute(obj as Record<string, unknown>);
      if (route) routes.push(route);
    }
    return routes.length > 0 ? routes : null;
  } catch {
    return null;
  }
}

/**
 * Remove emoji route blocks from text so we can show intro/outro without duplicating route content.
 */
function stripEmojiRouteBlocks(text: string): string {
  return text
    .replace(EMOJI_ROUTE_BLOCK, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseMessageContent(content: string): MessageSegment[] {
  const norm = stripCodeFences(content);

  const extracted =
    extractRouteData(norm) ??
    extractDataHidden(norm) ??
    extractBracketCounting(norm) ??
    extractRegex(norm) ??
    extractBareArray(norm);

  if (extracted) {
    const { full, json } = extracted;
    const routes = tryParseRoutes(json);
    if (routes) {
      const segments: MessageSegment[] = [];
      const startIdx = norm.indexOf(full);
      const before = norm.slice(0, startIdx).trim();
      if (before) segments.push({ type: "text", content: cleanVisibleText(before) });
      segments.push({ type: "routes", routes });
      const after = norm.slice(startIdx + full.length).trim();
      if (after) segments.push({ type: "text", content: cleanVisibleText(after) });
      return segments;
    }
  }

  // Fallback: no <route_data> block — try to parse emoji-formatted route blocks and build cards with generated map URLs
  const routesFromEmoji = parseRoutesFromEmojiText(norm);
  if (routesFromEmoji && routesFromEmoji.length > 0) {
    const textWithoutBlocks = stripEmojiRouteBlocks(cleanVisibleText(norm));
    const segments: MessageSegment[] = [];
    if (textWithoutBlocks) segments.push({ type: "text", content: textWithoutBlocks });
    segments.push({ type: "routes", routes: routesFromEmoji });
    return segments;
  }

  return [{ type: "text", content: cleanVisibleText(content) }];
}

function cleanVisibleText(text: string): string {
  return text
    .replace(/<route_data>[\s\S]*?<\/route_data>/g, "")
    .replace(/<route_data>[\s\S]*/g, "")
    .replace(/<data_hidden>[\s\S]*?<\/data_hidden>/g, "")
    .replace(/<data_hidden>[\s\S]*/g, "")
    .replace(/\[ROUTES_JSON:[\s\S]*?\]\]/g, "")
    .replace(/\[ROUTES_JSON:[\s\S]*/g, "")
    .trim();
}

export function hasRoutes(text: string): boolean {
  return (
    ROUTE_DATA_RE.test(text) ||
    DATA_HIDDEN_RE.test(text) ||
    text.includes(ROUTES_TAG) ||
    /\[\s*\{[^}]*"(?:nav_to_start|waze_link|view_full_route)"/.test(text) ||
    (parseRoutesFromEmojiText(text)?.length ?? 0) > 0
  );
}
