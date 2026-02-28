export function profileBlock(userName?: string, userLevel?: string): string {
  if (!userName || !userLevel) return "";
  return `\nThe user's profile: Name: ${userName}, Level: ${userLevel}. Adapt route difficulty and distance accordingly. Address them by name occasionally.`;
}

export function nightBlock(): string {
  const hour = new Date().getHours();
  if (hour < 6 || hour >= 18) {
    return `\nIMPORTANT: Current time is ${String(hour).padStart(2, "0")}:00 — nighttime. Prioritize well-lit urban routes and warn the user about running in the dark. Avoid trails and unlit areas.`;
  }
  return "";
}
