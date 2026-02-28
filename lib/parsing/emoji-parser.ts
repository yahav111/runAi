import type { Route } from "@/lib/types";
import { buildNavUrl, buildRouteUrl } from "@/lib/url-builders";

const EMOJI_ROUTE_BLOCK =
  /🏅\s*([^\n]+)\s*\n\s*📏\s*Distance:\s*([^\n]+)\s*\n\s*🏃\s*Surface:\s*([^\n]+)\s*\n\s*🔁\s*Type:\s*([^\n]+)\s*\n\s*📍\s*Start:\s*([^\n]+)\s*\n\s*🏁\s*(?:Finish|End):\s*([^\n]+)\s*\n\s*📝\s*([\s\S]+?)\s*\n\s*☕\s*(?:Post-run treat|Post-run):\s*([^\n]+)/gi;

function parseSurface(s: string): Route["surface"] {
  const lower = s.toLowerCase();
  if (
    lower.includes("asphalt") &&
    !lower.includes("sand") &&
    !lower.includes("trail")
  )
    return "Asphalt";
  if (lower.includes("trail")) return "Trail";
  if (lower.includes("sand")) return "Sand";
  return "Mixed";
}

export function parseRoutesFromEmojiText(content: string): Route[] | null {
  const routes: Route[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(EMOJI_ROUTE_BLOCK.source, "gi");

  while ((m = re.exec(content)) !== null) {
    const [
      ,
      name,
      distance,
      surface,
      routeType,
      startPoint,
      endPoint,
      description,
      postRunTreat,
    ] = m;
    if (!name?.trim() || !startPoint?.trim() || !endPoint?.trim()) continue;

    const start = startPoint.trim();
    const end = endPoint.trim();
    routes.push({
      name: name.trim().replace(/^🏅\s*/, "").trim() || name.trim(),
      distance: (distance ?? "").trim(),
      surface: parseSurface(surface ?? ""),
      route_type: (routeType ?? "").toLowerCase().includes("point")
        ? "Point-to-Point"
        : "Loop",
      start_point: start,
      end_point: end,
      nav_to_start: buildNavUrl(start),
      view_full_route: buildRouteUrl(start, end),
      description: (description ?? "").trim(),
      post_run_treat: (postRunTreat ?? "").trim() || "Ask a local!",
      highlights: [],
    });
  }
  return routes.length >= 1 ? routes : null;
}

export function parseLooseRouteFromProse(content: string): Route | null {
  const startMatch = content.match(/(?:Start|start):\s*([^\n]+)/i);
  const finishMatch = content.match(
    /(?:Finish|Finish point|End|end):\s*([^\n]+)/i
  );
  const distanceMatch = content.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (!startMatch?.[1]?.trim() || !finishMatch?.[1]?.trim() || !distanceMatch)
    return null;

  const start_point = startMatch[1].trim();
  const end_point = finishMatch[1].trim();
  const distance = `${distanceMatch[1]} km`;

  let description = "Route as described.";
  const descMatch = content.match(
    /(?:Description of the path|Description):\s*([^\n]+(?:\n[^\n]+)?)/i
  );
  if (descMatch?.[1]?.trim()) description = descMatch[1].trim().slice(0, 500);

  let post_run_treat = "Ask a local!";
  const treatMatch =
    content.match(/Post-run treat:\s*([^\n]+)/i) ??
    content.match(/Enjoy\s+([^.\n]+)/i);
  if (treatMatch?.[1]?.trim())
    post_run_treat = treatMatch[1].trim().slice(0, 200);

  const nameMatch = content.match(
    /(?:Israel |Suggested )?(?:Coastal |Running )?Route\s*[:\s]*([^\n]+?)(?=\s*\n|$)/i
  );
  const name =
    nameMatch?.[1]?.trim() && nameMatch[1].length < 60
      ? nameMatch[1].trim()
      : "Suggested route";

  return {
    name,
    distance,
    surface: "Asphalt",
    route_type: "Point-to-Point",
    start_point,
    end_point,
    nav_to_start: buildNavUrl(start_point),
    view_full_route: buildRouteUrl(start_point, end_point),
    description,
    post_run_treat,
    highlights: [],
  };
}

export function stripEmojiRouteBlocks(text: string): string {
  return text
    .replace(EMOJI_ROUTE_BLOCK, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
