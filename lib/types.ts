export interface Route {
  name: string;
  distance: string;
  surface: "Asphalt" | "Trail" | "Sand" | "Mixed";
  route_type: "Loop" | "Point-to-Point";
  start_point: string;
  end_point: string;
  nav_to_start: string;
  nav_to_end?: string;
  view_full_route: string;
  description: string;
  post_run_treat: string;
  highlights: string[];
  waypoint?: string;
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

export type DistanceTier = "short" | "medium" | "long";

export interface PredefinedRoute {
  id: string;
  name: string;
  city: string;
  distance_km: number;
  start_point: string;
  end_point: string;
  description: string;
  route_type: "Point-to-Point";
}

export interface DirectRouteRequest {
  from: string;
  to: string;
}

export interface LoopRouteRequest {
  location: string;
  distanceOrTime: string;
}

export type RouteIntent =
  | { type: "point-to-point"; data: DirectRouteRequest }
  | { type: "loop"; data: LoopRouteRequest }
  | { type: "survey" };

export interface SuggestionChip {
  id: string;
  label: string;
  text: string;
  variant?: "default" | "reset";
}

export interface ChipGroup {
  category: string;
  chips: SuggestionChip[];
}

export type InitialRouteType = "point-to-point" | "loop";

export interface SurveyCategory {
  key: string;
  label: string;
  keywords: string[];
}
