import type {
  DirectRouteRequest,
  LoopRouteRequest,
  RouteIntent,
} from "@/lib/types";

const FROM_TO_RE = /from\s+(.+?)\s+to\s+(.+)/i;

const LOOP_PATTERNS = [
  /(\d+(?:\.\d+)?\s*(?:km|k|miles?|mi|minutes?|mins?|hours?|hrs?))\s+(?:loop|run|route|jog)?\s*(?:around|near|from|starting\s+(?:at|from)|at)\s+(.+)/i,
  /(?:loop|circular|circle)\s+(?:of\s+)?(\d+(?:\.\d+)?\s*(?:km|k|miles?|mi|minutes?|mins?|hours?|hrs?))\s+(?:around|near|from|at)\s+(.+)/i,
  /(?:around|near|from|at)\s+(.+?)\s*[,\-–]\s*(\d+(?:\.\d+)?\s*(?:km|k|miles?|mi|minutes?|mins?|hours?|hrs?))/i,
];

export function detectDirectRouteRequest(
  text: string
): DirectRouteRequest | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const match = trimmed.match(FROM_TO_RE);
  if (!match) return null;

  const from = match[1].trim();
  const to = match[2].trim();

  if (!from || !to || from.length < 2 || to.length < 2) return null;
  return { from, to };
}

export function detectLoopRequest(text: string): LoopRouteRequest | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  for (const re of LOOP_PATTERNS) {
    const m = trimmed.match(re);
    if (!m) continue;

    if (re === LOOP_PATTERNS[2]) {
      const location = m[1].trim();
      const distanceOrTime = m[2].trim();
      if (location.length >= 2 && distanceOrTime)
        return { location, distanceOrTime };
    } else {
      const distanceOrTime = m[1].trim();
      const location = m[2].trim();
      if (location.length >= 2 && distanceOrTime)
        return { location, distanceOrTime };
    }
  }
  return null;
}

export function detectIntent(text: string): RouteIntent {
  const direct = detectDirectRouteRequest(text);
  if (direct) return { type: "point-to-point", data: direct };

  const loop = detectLoopRequest(text);
  if (loop) return { type: "loop", data: loop };

  return { type: "survey" };
}
