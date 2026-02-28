import type { UIMessage } from "ai";
import { SURVEY_CATEGORIES } from "@/lib/constants/survey-categories";
import { KNOWN_CITIES } from "@/lib/constants/cities";

export function getMessageText(msg: UIMessage): string {
  const parts = (msg as { parts?: Array<{ type: string; text?: string }> })
    .parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof p.text === "string"
    )
    .map((p) => p.text)
    .join("");
}

export function getLastUserMessageText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    return getMessageText(messages[i]);
  }
  return "";
}

export function looksLikeCityOnly(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t.length > 50) return false;
  return KNOWN_CITIES.some(
    (city) =>
      t === city || t.startsWith(city + " ") || t === city.replace(" ", "")
  );
}

export function getAnsweredPreferences(
  messages: UIMessage[]
): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role !== "user") continue;
    const prev = messages[i - 1];
    if (prev.role !== "assistant") continue;
    const prevText = getMessageText(prev).toLowerCase();
    const userText = getMessageText(messages[i]).trim();
    if (!userText) continue;
    if (!out.city && looksLikeCityOnly(userText)) {
      out.city = userText.trim();
    }
    for (const cat of SURVEY_CATEGORIES) {
      if (out[cat.key]) continue;
      if (cat.keywords.some((kw) => prevText.includes(kw))) {
        out[cat.key] = userText;
        break;
      }
    }
  }
  return out;
}
