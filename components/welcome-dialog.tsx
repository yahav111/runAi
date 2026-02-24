"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footprints } from "lucide-react";
import type { UserProfile } from "@/lib/use-user-profile";

interface WelcomeDialogProps {
  open: boolean;
  onSave: (profile: UserProfile) => void;
}

export function WelcomeDialog({ open, onSave }: WelcomeDialogProps) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState<UserProfile["level"]>("Beginner");

  function handleSave() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), level });
  }

  return (
    <Dialog open={open}>
      <DialogContent className="border-slate-700 bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10">
            <Footprints className="h-6 w-6 text-lime-400" />
          </div>
          <DialogTitle className="text-center text-xl text-white">
            Welcome to RunIsrael AI
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Tell us a bit about yourself so we can personalize your routes.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Your Name
            </label>
            <Input
              placeholder="e.g. Yossi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Running Level
            </label>
            <Select
              value={level}
              onValueChange={(v) => setLevel(v as UserProfile["level"])}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full bg-lime-500 font-semibold text-slate-950 hover:bg-lime-400"
          >
            Let&apos;s Run
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
