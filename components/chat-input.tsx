"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { type FormEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="shrink-0 border-t border-white/5 bg-slate-950 px-4 py-3 sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Where do you want to run today?"
          disabled={isLoading}
          className="flex-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-lime-500"
          autoFocus
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !value.trim()}
          className="shrink-0 bg-lime-500 text-slate-950 hover:bg-lime-400 disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
