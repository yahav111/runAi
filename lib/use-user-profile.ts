"use client";

import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const STORAGE_KEY = "runisrael-profile";

export function useUserProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfileState(JSON.parse(stored));
      } catch {
        setIsNewUser(true);
      }
    } else {
      setIsNewUser(true);
    }
    setLoaded(true);
  }, []);

  function setProfile(p: UserProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfileState(p);
    setIsNewUser(false);
  }

  return { profile, setProfile, isNewUser: loaded && isNewUser };
}
