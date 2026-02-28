"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { MessageBubble } from "@/components/message-bubble";
import { SuggestionChips } from "@/components/suggestion-chips";
import { ModeCards } from "@/components/mode-cards";
import {
  getDynamicChips,
  CITY_CHIPS,
  RESET_CHIP,
} from "@/lib/get-suggestions";
import type { ChipGroup } from "@/lib/types";
import { KNOWN_CITIES } from "@/lib/constants/cities";
import { hasRoutes } from "@/lib/parsing";
import { MapPin } from "lucide-react";
import type { UserProfile } from "@/lib/use-user-profile";

interface ChatProps {
  profile: UserProfile | null;
}

function getPartsText(
  parts: Array<{ type: string; text?: string }>
): string {
  return parts
    .filter(
      (p): p is { type: "text"; text: string } => p.type === "text"
    )
    .map((p) => p.text)
    .join("");
}

const ELEVATION_CHIPS: ChipGroup = {
  category: "Elevation",
  chips: [
    { id: "flat", label: "🏃 Flat", text: "Flat" },
    { id: "rolling", label: "⛰️ Rolling Hills", text: "Rolling Hills" },
    { id: "steep", label: "🔼 Steep Climbs", text: "Steep Climbs" },
  ],
};

export function Chat({ profile }: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [chipsHidden, setChipsHidden] = useState(false);

  const { messages, setMessages, sendMessage, status, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const bodyData = profile
    ? { data: { userName: profile.name, userLevel: profile.level } }
    : undefined;

  const lastMessage = messages[messages.length - 1];
  const lastAssistantText =
    lastMessage?.role === "assistant"
      ? getPartsText(
          lastMessage.parts as Array<{ type: string; text?: string }>
        )
      : "";

  const routesShown = hasRoutes(lastAssistantText);

  const initialRouteType = (() => {
    const firstUser = messages.find((m) => m.role === "user");
    if (!firstUser) return null;
    const firstText = getPartsText(
      firstUser.parts as Array<{ type: string; text?: string }>
    ).toLowerCase();
    if (
      firstText.includes("point-to-point") ||
      firstText.includes("point to point")
    )
      return "point-to-point" as const;
    if (
      firstText.includes("circular loop") ||
      firstText.includes("circular loop run")
    )
      return "loop" as const;
    return null;
  })();

  const dynamicGroups = getDynamicChips(
    lastAssistantText,
    routesShown,
    initialRouteType
  );

  const cityAlreadyChosen = messages.some(
    (m) =>
      m.role === "user" &&
      KNOWN_CITIES.some((city) =>
        (m.parts as Array<{ type: string; text?: string }>)
          .filter(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          .some((p) => p.text.trim().toLowerCase().includes(city))
      )
  );

  const suggestionChipGroups: ChipGroup[] =
    dynamicGroups.length > 0
      ? dynamicGroups
      : lastMessage?.role === "assistant" && !routesShown
        ? [
            cityAlreadyChosen
              ? ELEVATION_CHIPS
              : { category: "City", chips: CITY_CHIPS },
            { category: "", chips: [RESET_CHIP] },
          ]
        : [];

  const showChips =
    suggestionChipGroups.length > 0 &&
    !isLoading &&
    lastMessage?.role === "assistant" &&
    !chipsHidden;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    sendMessage({ text }, { body: bodyData });
  }

  function handleChipSelect(text: string) {
    if (text === "__reset__") {
      setMessages([]);
      setChipsHidden(false);
      return;
    }
    setChipsHidden(true);
    sendMessage({ text }, { body: bodyData });
  }

  function handleModeSelect(prompt: string) {
    sendMessage({ text: prompt }, { body: bodyData });
  }

  useEffect(() => {
    if (!isLoading && lastMessage?.role === "assistant") {
      setChipsHidden(false);
    }
  }, [isLoading, lastMessage?.role]);

  const isWelcome = messages.length === 0 && !isLoading;

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin sm:px-6"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {isWelcome && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10">
                <MapPin className="h-8 w-8 text-lime-400" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">
                {profile
                  ? `Ready to run, ${profile.name}?`
                  : "Ready to run?"}
              </h2>
              <p className="mb-6 max-w-md text-center text-sm text-slate-400">
                Choose how you'd like to plan your route, or just type
                naturally — like "From Dizengoff to the beach".
              </p>
              <div className="w-full max-w-2xl">
                <ModeCards
                  onSelectMode={handleModeSelect}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error.message}
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-lime-400" />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-slate-800 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:300ms]" />
                    <span className="ml-1 text-xs text-slate-400">
                      Mapping your route...
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {showChips && (
        <SuggestionChips
          groups={suggestionChipGroups}
          onSelect={handleChipSelect}
          disabled={isLoading}
        />
      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
