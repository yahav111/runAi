import type { Route } from "@/lib/types";
import { buildNavUrl, buildRouteUrl } from "@/lib/url-builders";
import { sanitiseJson } from "./json-utils";

const SURFACE_MAP: Record<string, Route["surface"]> = {
  asphalt: "Asphalt",
  trail: "Trail",
  trails: "Trail",
  sand: "Sand",
  mixed: "Mixed",
};

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

export function normalizeRoute(raw: Record<string, unknown>): Route | null {
  const name = str(raw.name);
  if (!name) return null;

  const distance = str(raw.distance) || str(raw.dist);
  if (!distance) return null;

  const description = str(raw.description);
  if (!description) return null;

  const surfaceRaw = str(raw.surface) || str(raw.type);
  const surface: Route["surface"] =
    SURFACE_MAP[surfaceRaw.toLowerCase()] ?? "Mixed";

  const rtRaw = str(raw.route_type).toLowerCase();
  const route_type: Route["route_type"] = rtRaw.includes("point")
    ? "Point-to-Point"
    : "Loop";

  const start_point =
    str(raw.start_point) ||
    str(raw.start_landmark) ||
    str(raw.start_address) ||
    (typeof raw.waze_link === "string"
      ? getAddressFromWaze(raw.waze_link)
      : "") ||
    name;

  const end_point =
    str(raw.end_point) ||
    str(raw.end_landmark) ||
    str(raw.end_address) ||
    (route_type === "Loop" ? start_point : start_point);

  const nav_to_start =
    str(raw.nav_to_start) || str(raw.waze_link) || buildNavUrl(start_point);

  const view_full_route =
    str(raw.view_full_route) || buildRouteUrl(start_point, end_point);

  const post_run_treat = str(raw.post_run_treat, "Ask a local!");

  let highlights: string[] = [];
  if (Array.isArray(raw.highlights)) {
    highlights = raw.highlights
      .filter(
        (h): h is string => typeof h === "string" && h.trim().length > 0
      )
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

export function tryParseRoutes(jsonStr: string): Route[] | null {
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
