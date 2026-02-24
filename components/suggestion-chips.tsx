"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ChipGroup, SuggestionChip } from "@/lib/get-suggestions";

interface SuggestionChipsProps {
  groups: ChipGroup[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

function ChipButton({
  chip,
  onSelect,
  disabled,
  index,
}: {
  chip: SuggestionChip;
  onSelect: (text: string) => void;
  disabled?: boolean;
  index: number;
}) {
  return (
    <motion.button
      key={chip.id}
      type="button"
      disabled={disabled}
      onClick={() => onSelect(chip.text)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={
        chip.variant === "reset"
          ? "rounded-full border border-slate-500/40 bg-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-400/60 hover:bg-slate-600/50 hover:text-white disabled:pointer-events-none disabled:opacity-50"
          : "rounded-full border border-lime-500/40 bg-lime-500/10 px-4 py-2 text-sm font-medium text-lime-200 transition-all hover:border-lime-400/60 hover:bg-lime-500/20 hover:text-lime-100 hover:shadow-[0_0_20px_rgba(132,204,22,0.25)] disabled:pointer-events-none disabled:opacity-50"
      }
    >
      {chip.label}
    </motion.button>
  );
}

export function SuggestionChips({
  groups,
  onSelect,
  disabled,
}: SuggestionChipsProps) {
  if (groups.length === 0) return null;

  const key = groups.map((g) => g.category + ":" + g.chips.map((c) => c.id).join(",")).join("|");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto max-w-3xl space-y-3 px-4 pb-2 sm:px-6"
      >
        {groups.map((group) => (
          <div key={group.category || "__reset__"} className="flex flex-col items-center gap-2">
            {group.category ? (
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {group.category}
              </span>
            ) : null}
            <div className="flex flex-wrap justify-center gap-2">
              {group.chips.map((chip, i) => (
                <ChipButton
                  key={chip.id}
                  chip={chip}
                  onSelect={onSelect}
                  disabled={disabled}
                  index={i}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
