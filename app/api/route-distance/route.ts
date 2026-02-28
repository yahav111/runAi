import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/route-distance?origin=...&destination=...
 * Returns walking distance in km from Google Directions API.
 * Used to validate displayed route distance is within 30% of actual.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin");
  const destination = request.nextUrl.searchParams.get("destination");
  if (!origin?.trim() || !destination?.trim()) {
    return NextResponse.json(
      { error: "Missing origin or destination" },
      { status: 400 }
    );
  }

  const key =
    process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_GEOCODING_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 503 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", origin.trim());
  url.searchParams.set("destination", destination.trim());
  url.searchParams.set("mode", "walking");
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    const data = (await res.json()) as {
      status: string;
      routes?: Array<{
        legs?: Array<{ distance?: { value: number } }>;
      }>;
    };

    // Return 200 with null so the client doesn't see 404; it just keeps the declared distance
    if (data.status !== "OK" || !data.routes?.[0]?.legs?.[0]) {
      return NextResponse.json(
        { distance_km: null, status: data.status },
        { status: 200 }
      );
    }

    const meters = data.routes[0].legs[0].distance?.value;
    if (typeof meters !== "number" || meters < 0) {
      return NextResponse.json(
        { error: "Invalid distance in response" },
        { status: 502 }
      );
    }

    const distance_km = Math.round((meters / 1000) * 10) / 10;
    return NextResponse.json({ distance_km });
  } catch (e) {
    console.error("[route-distance]", e);
    return NextResponse.json(
      { error: "Failed to fetch directions" },
      { status: 502 }
    );
  }
}
