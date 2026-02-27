"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Footprints,
  MapPin,
  Flag,
  MessageCircle,
  Navigation,
  Route as RouteIcon,
  TreePine,
  Waves,
  Repeat,
  ArrowRight,
} from "lucide-react";
import type { Route } from "@/lib/parse-routes";

interface RouteCardProps {
  route: Route;
  index: number;
}

const surfaceConfig: Record<string, { icon: React.ReactNode; label: string }> =
  {
    Asphalt: { icon: <span className="text-xs">🛣️</span>, label: "Asphalt" },
    Trail: { icon: <TreePine className="h-3 w-3" />, label: "Trail" },
    Sand: { icon: <Waves className="h-3 w-3" />, label: "Sand" },
    Mixed: { icon: <span className="text-xs">🔀</span>, label: "Mixed" },
  };

export function RouteCard({ route, index }: RouteCardProps) {
  const surface = surfaceConfig[route.surface] || surfaceConfig.Mixed;
  const isLoop = route.route_type === "Loop";

  return (
    <Card className="overflow-hidden border border-slate-600/50 bg-slate-800/90 shadow-xl shadow-black/25 backdrop-blur-sm transition-all hover:border-lime-500/30 hover:shadow-2xl">
      <div className="h-1 bg-gradient-to-r from-lime-500 via-lime-400 to-lime-500" />
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/15 text-xs font-bold text-lime-400">
              {index + 1}
            </span>
            <h3 className="font-semibold leading-tight text-white">
              {route.name}
            </h3>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-lime-500/30 bg-lime-500/10 text-lime-400"
          >
            {route.distance}
          </Badge>
        </div>

        {/* Badges: surface + route type */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-600/50 bg-slate-700/30 px-2 py-1 text-xs font-medium text-slate-300">
            <Footprints className="h-3 w-3" />
            {surface.icon} {surface.label}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-600/50 bg-slate-700/30 px-2 py-1 text-xs font-medium text-slate-300">
            {isLoop ? (
              <Repeat className="h-3 w-3 text-sky-400" />
            ) : (
              <ArrowRight className="h-3 w-3 text-orange-400" />
            )}
            {isLoop ? "Circular Loop" : "Point-to-Point"}
          </div>
        </div>

        {/* Highlights */}
        {route.highlights && route.highlights.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {route.highlights.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-sky-500/30 bg-sky-500/10 text-sky-300 text-[11px]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          {route.description}
        </p>

        {/* Start, optional waypoint (turnaround), End */}
        <div className="mb-3 space-y-1.5 rounded-lg bg-slate-900/50 p-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-lime-400" />
            <span className="font-medium text-slate-400">Start:</span>
            <span>{route.start_point}</span>
          </div>
          {route.waypoint && (
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Repeat className="h-3.5 w-3.5 shrink-0 text-sky-400" />
              <span className="font-medium text-slate-400">Turnaround:</span>
              <span>{route.waypoint}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Flag className="h-3.5 w-3.5 shrink-0 text-rose-400" />
            <span className="font-medium text-slate-400">Finish:</span>
            <span>{route.end_point}</span>
          </div>
        </div>

        {/* Post-run treat */}
        {route.post_run_treat && (
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-slate-900/50 p-2.5">
            <Coffee className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                Post-run treat
              </span>
              <p className="text-xs leading-relaxed text-slate-300">
                {route.post_run_treat}
              </p>
            </div>
          </div>
        )}

        {/* Out-and-back hint when waypoint is set */}
        {route.waypoint && (
          <p className="mb-3 text-[11px] text-slate-500">
            Map shows the leg to the turnaround; run back the same way to the start.
          </p>
        )}

        {/* Navigation buttons — only show when we have valid map URLs */}
        {((route.nav_to_start?.startsWith("http") ?? false) ||
          (route.nav_to_end?.startsWith("http") ?? false) ||
          (route.view_full_route?.startsWith("http") ?? false)) && (
        <div className="flex flex-wrap items-center gap-2">
          {route.nav_to_start?.startsWith("http") && (
          <a
            href={route.nav_to_start}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white"
            >
              <Navigation className="mr-1.5 h-3.5 w-3.5" />
              Navigate to Start
            </Button>
          </a>
          )}
          {route.nav_to_end?.startsWith("http") && (
          <a
            href={route.nav_to_end}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white"
            >
              <Navigation className="mr-1.5 h-3.5 w-3.5" />
              Navigate to End
            </Button>
          </a>
          )}
          {route.view_full_route?.startsWith("http") && (
          <a
            href={route.view_full_route}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full border-lime-500/30 bg-lime-500/10 text-lime-400 hover:bg-lime-500/20 hover:text-lime-300"
            >
              <RouteIcon className="mr-1.5 h-3.5 w-3.5" />
              {route.waypoint ? "View route to turnaround" : "View Full Route"}
            </Button>
          </a>
          )}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Check out this ${route.distance} run: ${route.name}. Start here: ${route.nav_to_start}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share route"
            className="shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-lime-500 bg-transparent text-lime-400 hover:bg-lime-500/20 hover:border-lime-400 hover:text-lime-300"
              aria-label="Share route"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:ml-1.5">Share route</span>
            </Button>
          </a>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
