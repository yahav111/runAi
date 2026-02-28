import type { MessageSegment } from "@/lib/types";
import { stripCodeFences } from "./json-utils";
import { extractFirst, ROUTE_DATA_RE, ROUTE_DATA_OPEN_RE, DATA_HIDDEN_RE, ROUTES_TAG } from "./extractors";
import { tryParseRoutes } from "./normalizer";
import {
  parseRoutesFromEmojiText,
  parseLooseRouteFromProse,
  stripEmojiRouteBlocks,
} from "./emoji-parser";

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

export function parseMessageContent(content: string): MessageSegment[] {
  const norm = stripCodeFences(content);

  const extracted = extractFirst(norm);

  if (extracted) {
    const { full, json } = extracted;
    const routes = tryParseRoutes(json);
    if (routes) {
      const segments: MessageSegment[] = [];
      const startIdx = norm.indexOf(full);
      const before = norm.slice(0, startIdx).trim();
      const after = norm.slice(startIdx + full.length).trim();
      const allText = [before, after].filter(Boolean).join("\n");

      const extraRoutes = parseRoutesFromEmojiText(allText);
      if (extraRoutes) {
        const names = new Set(routes.map((r) => r.name.toLowerCase()));
        for (const r of extraRoutes) {
          if (!names.has(r.name.toLowerCase())) {
            routes.push(r);
            names.add(r.name.toLowerCase());
          }
        }
      }

      const cleanBefore = before
        ? stripEmojiRouteBlocks(cleanVisibleText(before))
        : "";
      if (cleanBefore) segments.push({ type: "text", content: cleanBefore });
      segments.push({ type: "routes", routes });
      const cleanAfter = after
        ? stripEmojiRouteBlocks(cleanVisibleText(after))
        : "";
      if (cleanAfter) segments.push({ type: "text", content: cleanAfter });
      return segments;
    }
  }

  const routesFromEmoji = parseRoutesFromEmojiText(norm);
  if (routesFromEmoji && routesFromEmoji.length > 0) {
    const textWithoutBlocks = stripEmojiRouteBlocks(cleanVisibleText(norm));
    const segments: MessageSegment[] = [];
    if (textWithoutBlocks)
      segments.push({ type: "text", content: textWithoutBlocks });
    segments.push({ type: "routes", routes: routesFromEmoji });
    return segments;
  }

  const looseRoute = parseLooseRouteFromProse(norm);
  if (looseRoute) {
    const cleaned = cleanVisibleText(norm);
    const segments: MessageSegment[] = [];
    if (cleaned) segments.push({ type: "text", content: cleaned });
    segments.push({ type: "routes", routes: [looseRoute] });
    return segments;
  }

  return [{ type: "text", content: cleanVisibleText(content) }];
}

export function hasRoutes(text: string): boolean {
  return (
    ROUTE_DATA_RE.test(text) ||
    ROUTE_DATA_OPEN_RE.test(text) ||
    DATA_HIDDEN_RE.test(text) ||
    text.includes(ROUTES_TAG) ||
    /\[\s*\{[^}]*"(?:nav_to_start|waze_link|view_full_route)"/.test(text) ||
    (parseRoutesFromEmojiText(text)?.length ?? 0) > 0 ||
    parseLooseRouteFromProse(stripCodeFences(text)) !== null
  );
}
