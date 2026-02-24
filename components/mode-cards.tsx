"use client";

import { MapPinned, RotateCcw, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ModeCardsProps {
  onSelectMode: (prompt: string) => void;
  disabled?: boolean;
}

const MODES = [
  {
    id: "point-to-point",
    icon: MapPinned,
    title: "A to B Route",
    description: "Run from one location to another. Just tell us start and end.",
    prompt: "I want to plan a point-to-point run. Where should I start and finish?",
  },
  {
    id: "loop",
    icon: RotateCcw,
    title: "Circular Loop",
    description: "Start and end at the same spot. Tell us where and how far.",
    prompt: "I want a circular loop run. I'll tell you where and how far.",
  },
  {
    id: "survey",
    icon: Sparkles,
    title: "Tailor-made Run",
    description: "Answer a few quick questions and we'll find the perfect route.",
    prompt: "Help me find a tailor-made running route in Israel.",
  },
] as const;

export function ModeCards({ onSelectMode, disabled }: ModeCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelectMode(mode.prompt)}
          className="text-left transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
        >
          <Card className="overflow-hidden border border-slate-600/50 bg-slate-800/80 shadow-lg transition-all hover:border-lime-500/40 hover:shadow-[0_0_30px_rgba(132,204,22,0.15)]">
            <div className="h-1 bg-gradient-to-r from-lime-500 to-lime-400" />
            <CardContent className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-lime-500/15">
                <mode.icon className="h-5 w-5 text-lime-400" />
              </div>
              <h3 className="mb-1 font-semibold text-white">
                {mode.title}
              </h3>
              <p className="text-sm text-slate-400">{mode.description}</p>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}
