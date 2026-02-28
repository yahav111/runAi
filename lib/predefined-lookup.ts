import { PREDEFINED_ROUTES } from "@/lib/constants/predefined-routes";
import { resolveCity } from "@/lib/constants/cities";
import { buildNavUrl, buildWalkingDirectionsUrl } from "@/lib/url-builders";
import type { PredefinedRoute, DistanceTier } from "@/lib/types";

export type { DistanceTier };

function tierForRoute(route: PredefinedRoute): DistanceTier {
  if (route.distance_km <= 4) return "short";
  if (route.distance_km <= 8) return "medium";
  return "long";
}

export function getRoutesForCity(
  cityInput: string,
  tier?: DistanceTier
): PredefinedRoute[] {
  const city = resolveCity(cityInput);
  if (!city) return [];
  let routes = PREDEFINED_ROUTES.filter((r) => r.city === city);
  if (tier) {
    routes = routes.filter((r) => tierForRoute(r) === tier);
  }
  return routes;
}

export function hasPredefinedCity(cityInput: string): boolean {
  return resolveCity(cityInput) !== null;
}

export function buildRouteDataJson(routes: PredefinedRoute[]): string {
  const objs = routes.slice(0, 3).map((r) => ({
    name: r.name,
    distance: `${r.distance_km} km`,
    surface: "Asphalt",
    route_type: r.route_type,
    start_point: r.start_point,
    end_point: r.end_point,
    nav_to_start: buildNavUrl(r.start_point),
    view_full_route: buildWalkingDirectionsUrl(r.start_point, r.end_point),
    description: r.description,
    post_run_treat: "Ask a local!",
    highlights: [],
  }));
  return JSON.stringify(objs);
}

export function buildRouteEmoji(routes: PredefinedRoute[]): string {
  return routes
    .slice(0, 3)
    .map(
      (r, i) =>
        `🏅 Route ${i + 1}: ${r.name}\n` +
        `📏 Distance: ${r.distance_km} km\n` +
        `🏃 Surface: Asphalt\n` +
        `🔁 Type: ${r.route_type}\n` +
        `📍 Start: ${r.start_point}\n` +
        `🏁 Finish: ${r.end_point}\n` +
        `📝 ${r.description}`
    )
    .join("\n\n");
}
