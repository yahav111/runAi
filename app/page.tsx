"use client";

import { Chat } from "@/components/chat";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useUserProfile } from "@/lib/use-user-profile";
import { Footprints } from "lucide-react";

export default function Home() {
  const { profile, setProfile, isNewUser } = useUserProfile();

  return (
    <div className="flex h-dvh flex-col bg-slate-950">
      <header className="flex shrink-0 items-center gap-3 border-b border-white/5 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Footprints className="h-6 w-6 text-lime-400" />
          <h1 className="text-lg font-bold tracking-tight text-white">
            Run<span className="text-lime-400">Israel</span> AI
          </h1>
        </div>
        {profile && (
          <span className="ml-auto text-sm text-slate-400">
            {profile.name} &middot; {profile.level}
          </span>
        )}
      </header>

      <Chat profile={profile} />

      <WelcomeDialog open={isNewUser} onSave={setProfile} />
    </div>
  );
}
