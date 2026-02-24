"use client";

import type { UIMessage } from "ai";
import { parseMessageContent, type MessageSegment } from "@/lib/parse-routes";
import { RouteCardsGroup } from "@/components/route-cards-group";
import { Footprints } from "lucide-react";

interface MessageBubbleProps {
  message: UIMessage;
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const text = getTextContent(message);

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-lime-600 px-4 py-2.5 text-sm text-white sm:max-w-[70%]">
          {text}
        </div>
      </div>
    );
  }

  if (!text) return null;

  const segments: MessageSegment[] = parseMessageContent(text);

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700/80 ring-1 ring-slate-600/50">
        <Footprints className="h-4 w-4 text-lime-400" />
      </div>
      <div className="min-w-0 max-w-[85%] space-y-4 sm:max-w-[75%]">
        {segments.map((segment, i) => {
          if (segment.type === "text") {
            return (
              <div
                key={i}
                className="rounded-2xl rounded-tl-md border border-slate-700/60 bg-slate-800/90 px-4 py-3 shadow-sm"
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
                  {segment.content}
                </p>
              </div>
            );
          }
          return <RouteCardsGroup key={i} routes={segment.routes} />;
        })}
      </div>
    </div>
  );
}
