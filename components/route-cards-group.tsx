"use client";

import { RouteCard } from "@/components/route-card";
import type { Route } from "@/lib/parse-routes";
import { MapPin } from "lucide-react";

interface RouteCardsGroupProps {
  routes: Route[];
}

export function RouteCardsGroup({ routes }: RouteCardsGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-400/90">
        <MapPin className="h-3.5 w-3.5" />
        Route options
      </div>
      <div className="grid gap-4">
        {routes.map((route, i) => (
          <RouteCard key={`${route.name}-${i}`} route={route} index={i} />
        ))}
      </div>
    </div>
  );
}
