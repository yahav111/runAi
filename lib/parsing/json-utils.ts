export function stripCodeFences(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n?```[a-z]*\s*\n?/gi, "\n")
    .replace(/\n?```\s*\n?/g, "\n");
}

export function sanitiseJson(raw: string): string {
  return raw
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/,(\s*[}\]])/g, "$1")
    .replace(/\s*\/\/[^\n]*/g, "")
    .trim();
}

export function tryTrimToValidArray(s: string): string | null {
  const str = s.trim();
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] !== "]") continue;
    const candidate = str.slice(0, i + 1);
    try {
      const parsed = JSON.parse(sanitiseJson(candidate));
      if (Array.isArray(parsed) && parsed.length > 0) return candidate;
    } catch {
      // continue
    }
  }
  return null;
}
