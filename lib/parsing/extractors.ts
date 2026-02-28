import { tryTrimToValidArray } from "./json-utils";

export interface Extraction {
  full: string;
  json: string;
}

const ROUTE_DATA_RE = /<route_data>([\s\S]*?)<\/route_data>/;
const ROUTE_DATA_OPEN_RE = /<route_data>([\s\S]*)$/;
const DATA_HIDDEN_RE = /<data_hidden>([\s\S]*?)<\/data_hidden>/;
const ROUTES_TAG = "[ROUTES_JSON:";

export { ROUTE_DATA_RE, ROUTE_DATA_OPEN_RE, DATA_HIDDEN_RE, ROUTES_TAG };

function mergeJsonParts(parts: string[]): string {
  const items: string[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith("[")) {
      const inner = trimmed.slice(1, trimmed.lastIndexOf("]")).trim();
      if (inner) items.push(inner);
    } else if (trimmed.startsWith("{")) {
      items.push(trimmed);
    }
  }
  return `[${items.join(",")}]`;
}

export function extractRouteData(text: string): Extraction | null {
  const globalRe = new RegExp(ROUTE_DATA_RE.source, "g");
  const matches = [...text.matchAll(globalRe)];

  if (matches.length === 1) {
    return { full: matches[0][0], json: matches[0][1].trim() };
  }

  if (matches.length > 1) {
    const jsonParts = matches.map((m) => m[1].trim());
    const firstStart = text.indexOf(matches[0][0]);
    const lastMatch = matches[matches.length - 1];
    const lastEnd = text.lastIndexOf(lastMatch[0]) + lastMatch[0].length;
    return {
      full: text.slice(firstStart, lastEnd),
      json: mergeJsonParts(jsonParts),
    };
  }

  const open = text.match(ROUTE_DATA_OPEN_RE);
  if (open) {
    const raw = open[1].trim();
    const arrMatch = raw.match(/(\[\s*\{[\s\S]*)\s*$/);
    if (arrMatch) {
      const json = tryTrimToValidArray(arrMatch[1]);
      if (json)
        return { full: text.slice(text.indexOf("<route_data>")), json };
    }
  }
  return null;
}

export function extractDataHidden(text: string): Extraction | null {
  const m = text.match(DATA_HIDDEN_RE);
  if (!m) return null;
  return { full: m[0], json: m[1].trim() };
}

export function extractBracketCounting(text: string): Extraction | null {
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
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '"') {
      inStr = true;
      i++;
      continue;
    }
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) {
        const json = afterTag.slice(arrStart, i + 1);
        const rest = afterTag.slice(i + 1);
        const closingBracket = rest.match(/^\s*\]/);
        const fullLen =
          ROUTES_TAG.length +
          arrStart +
          (i - arrStart + 1) +
          (closingBracket ? closingBracket[0].length : 0);
        return { full: text.slice(tagIdx, tagIdx + fullLen), json };
      }
    }
    i++;
  }
  return null;
}

export function extractRegex(text: string): Extraction | null {
  const re = /\[ROUTES_JSON:\s*(\[[\s\S]*\])\s*\]/;
  const m = text.match(re);
  if (!m) return null;
  return { full: m[0], json: m[1] };
}

export function extractBareArray(text: string): Extraction | null {
  const re =
    /(\[\s*\{[\s\S]*?"(?:nav_to_start|waze_link|view_full_route)"[\s\S]*?\}\s*\])/;
  const m = text.match(re);
  if (!m) return null;
  return { full: m[0], json: m[0] };
}

export function extractFirst(text: string): Extraction | null {
  return (
    extractRouteData(text) ??
    extractDataHidden(text) ??
    extractBracketCounting(text) ??
    extractRegex(text) ??
    extractBareArray(text)
  );
}
