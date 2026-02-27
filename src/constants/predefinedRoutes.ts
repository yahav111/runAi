/**
 * Predefined running routes across Israeli cities.
 * All routes are Point-to-Point. Uses real streets and landmarks.
 */

export interface PredefinedRoute {
  id: string;
  name: string;
  city: string;
  distance_km: number;
  start_point: string;
  end_point: string;
  description: string;
  route_type: "Point-to-Point";
}

export const PREDEFINED_ROUTES: PredefinedRoute[] = [
  // ========== PETAH TIKVA (12 routes) ==========
  // 5km × 4
  {
    id: "pt-5-1",
    name: "Em HaMoshavot to Park HaGadol",
    city: "Petah Tikva",
    distance_km: 5,
    start_point: "Em HaMoshavot Street (Central PT)",
    end_point: "Park HaGadol (Isaac Ohayon Park) main entrance, Basel Street",
    description:
      "Urban run from the historic Em HaMoshavot center to the Great Park. Passes Jabotinsky and Arlozorov, then into the park's eastern approach.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-5-2",
    name: "Kfar Ganim Loop Approach",
    city: "Petah Tikva",
    distance_km: 5,
    start_point: "Kfar Ganim neighborhood, Sokolov Street",
    end_point: "Park HaGadol ecological pond",
    description:
      "From Kfar Ganim through residential streets to Park HaGadol. Flat, shaded sections near the ecological pond.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-5-3",
    name: "Hadar Ganim to Kiryat Matalon",
    city: "Petah Tikva",
    distance_km: 5,
    start_point: "Hadar Ganim, Gordon Street",
    end_point: "Kiryat Matalon industrial zone (east)",
    description:
      "Eastbound run from Hadar Ganim via Rambam and local streets to Kiryat Matalon. Good for early morning.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-5-4",
    name: "Segula to Beilinson",
    city: "Petah Tikva",
    distance_km: 5,
    start_point: "Segula neighborhood, Rotenberg Street",
    end_point: "Beilinson Hospital / Rabin Medical Center area",
    description:
      "North–south run through Segula and past Yad Labanim toward the medical center. Mix of quiet and busier roads.",
    route_type: "Point-to-Point",
  },
  // 10km × 4
  {
    id: "pt-10-1",
    name: "Em HaMoshavot – Park HaGadol – Kfar Ganim",
    city: "Petah Tikva",
    distance_km: 10,
    start_point: "Em HaMoshavot Street, city center",
    end_point: "Kfar Ganim, Mahane Yehuda Street",
    description:
      "Extended point-to-point: center to Park HaGadol (Basel Street), then through the park and out to Kfar Ganim. Varied terrain.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-2",
    name: "Jabotinsky Corridor North",
    city: "Petah Tikva",
    distance_km: 10,
    start_point: "Jabotinsky Street near Grand Mall (Red Line)",
    end_point: "Kiryat Arye / northern Petah Tikva limit",
    description:
      "Straight north along Jabotinsky (Road 481). Urban and well-lit; best at off-peak hours.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-3",
    name: "Park HaGadol to Ein Ganim Return Leg",
    city: "Petah Tikva",
    distance_km: 10,
    start_point: "Park HaGadol main entrance, Basel Street",
    end_point: "Ein Ganim, A.D. Gordon Street",
    description:
      "From the Great Park south through residential areas to Ein Ganim. Includes park loop and neighborhood streets.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-4",
    name: "Kfar Ganim – Hadar Ganim – Segula",
    city: "Petah Tikva",
    distance_km: 10,
    start_point: "Kfar Ganim, Sokolov Street",
    end_point: "Segula, Rotenberg Street",
    description:
      "Traverse three neighborhoods: Kfar Ganim, Hadar Ganim, and Segula. Mostly residential with some commercial.",
    route_type: "Point-to-Point",
  },
  // 21km × 4
  {
    id: "pt-21-1",
    name: "Petah Tikva Half: Em HaMoshavot to Eastern Edge",
    city: "Petah Tikva",
    distance_km: 21,
    start_point: "Em HaMoshavot Street, city center",
    end_point: "Eastern city limit (toward Rosh HaAyin)",
    description:
      "Half-marathon distance across Petah Tikva: center, Park HaGadol, Kfar Ganim, Hadar Ganim, Segula, and east. Mix of parks and urban roads.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-21-2",
    name: "Great Park Double Loop Plus Kfar Ganim",
    city: "Petah Tikva",
    distance_km: 21,
    start_point: "Park HaGadol, Basel Street entrance",
    end_point: "Kfar Ganim, Ein Ganim junction",
    description:
      "Start at Park HaGadol, use park loops and exits to extend toward Kfar Ganim and Ein Ganim. Scenic and relatively flat.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-21-3",
    name: "Jabotinsky Full North–South",
    city: "Petah Tikva",
    distance_km: 21,
    start_point: "Jabotinsky Street (south, near Bnei Brak)",
    end_point: "Jabotinsky Street (north, Kiryat Arye area)",
    description:
      "Full north–south axis along Jabotinsky with detours through Park HaGadol and Em HaMoshavot to reach half-marathon distance.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-21-4",
    name: "Em HaMoshavot – All Parks – Beilinson",
    city: "Petah Tikva",
    distance_km: 21,
    start_point: "Em HaMoshavot Street",
    end_point: "Beilinson Hospital / Rabin Medical Center",
    description:
      "Half marathon from the center through Park HaGadol, Kfar Ganim, Hadar Ganim, Segula, and finish at the medical center. Full tour of PT landmarks.",
    route_type: "Point-to-Point",
  },

  // ========== TEL AVIV (6 routes) ==========
  // 5km × 2
  {
    id: "tlv-5-1",
    name: "Charles Clore to Jaffa Port",
    city: "Tel Aviv",
    distance_km: 5,
    start_point: "Charles Clore Park",
    end_point: "Jaffa Port (Old Jaffa)",
    description:
      "Coastal run south from Charles Clore Park along the promenade to Jaffa Port. Sea views and flat terrain.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-5-2",
    name: "Dizengoff to Yarkon Park South",
    city: "Tel Aviv",
    distance_km: 5,
    start_point: "Dizengoff Square",
    end_point: "Yarkon Park (Ganei Yehoshua) southern entrance, Rokach Boulevard",
    description:
      "North from Dizengoff via Ibn Gabirol and Arlozorov to the southern tip of Yarkon Park. Urban to park transition.",
    route_type: "Point-to-Point",
  },
  // 10km × 2
  {
    id: "tlv-10-1",
    name: "Tel Aviv Port to Charles Clore",
    city: "Tel Aviv",
    distance_km: 10,
    start_point: "Tel Aviv Port (Namal)",
    end_point: "Charles Clore Park",
    description:
      "Beachfront run from the Port south past Hilton Beach and Gordon Beach to Charles Clore. Mostly promenade.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-10-2",
    name: "Rothschild to Yarkon and Back Leg",
    city: "Tel Aviv",
    distance_km: 10,
    start_point: "Rothschild Boulevard (Neve Tzedek end)",
    end_point: "Yarkon Park, Sportek / Rokach area",
    description:
      "From Rothschild and Neve Tzedek through Allenby and north to Yarkon Park (Sportek). Cultural and green sections.",
    route_type: "Point-to-Point",
  },
  // 21km × 2
  {
    id: "tlv-21-1",
    name: "Jaffa Port to Yarkon Park North",
    city: "Tel Aviv",
    distance_km: 21,
    start_point: "Jaffa Port",
    end_point: "Yarkon Park northern end (near Tel Aviv University)",
    description:
      "Half marathon along the coast and Yarkon: Jaffa, Charles Clore, beaches, Namal, then Yarkon Park north. Classic TLV long run.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-21-2",
    name: "Dizengoff – Yarkon – Port – Jaffa",
    city: "Tel Aviv",
    distance_km: 21,
    start_point: "Dizengoff Square",
    end_point: "Old Jaffa Clock Tower",
    description:
      "City and waterfront half: Dizengoff to Yarkon Park, then south via the port and promenade to Jaffa. Varied scenery.",
    route_type: "Point-to-Point",
  },

  // ========== JERUSALEM (6 routes) ==========
  // 5km × 2
  {
    id: "jlm-5-1",
    name: "Sacher Park to Givat Ram",
    city: "Jerusalem",
    distance_km: 5,
    start_point: "Sacher Park (Gan Sacher) main entrance",
    end_point: "Givat Ram, Israel Museum / Knesset area",
    description:
      "West from Sacher Park toward Givat Ram. Park paths and then streets past the Knesset and museums.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-5-2",
    name: "Jaffa Road to Old City Walls",
    city: "Jerusalem",
    distance_km: 5,
    start_point: "Jaffa Road (light rail corridor)",
    end_point: "Old City (Jaffa Gate)",
    description:
      "East along Jaffa Road (pedestrian/light rail zone) to the Old City. Historic and mostly flat.",
    route_type: "Point-to-Point",
  },
  // 10km × 2
  {
    id: "jlm-10-1",
    name: "German Colony to Sacher Park",
    city: "Jerusalem",
    distance_km: 10,
    start_point: "German Colony, Emek Refaim Street",
    end_point: "Sacher Park (Gan Sacher)",
    description:
      "From the German Colony via Talbiya and Rehavia to Sacher Park. Rolling hills and historic neighborhoods.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-10-2",
    name: "Ben Yehuda to Mount Scopus Approach",
    city: "Jerusalem",
    distance_km: 10,
    start_point: "Ben Yehuda Street (downtown)",
    end_point: "Mount Scopus (Hebrew University area)",
    description:
      "East from downtown (Ben Yehuda, Jaffa Road) toward Mount Scopus. Uphill; best as an outbound run.",
    route_type: "Point-to-Point",
  },
  // 21km × 2
  {
    id: "jlm-21-1",
    name: "Jerusalem Half: Sacher to Old City Loop Leg",
    city: "Jerusalem",
    distance_km: 21,
    start_point: "Sacher Park",
    end_point: "Mamilla / Jaffa Gate area",
    description:
      "Half marathon linking Sacher Park, Givat Ram, downtown, and Old City approach. Hilly; includes Jerusalem Marathon-style segments.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-21-2",
    name: "German Colony – Old City – Givat Ram",
    city: "Jerusalem",
    distance_km: 21,
    start_point: "German Colony, Emek Refaim",
    end_point: "Givat Ram Stadium / Sacher Park",
    description:
      "Long point-to-point: German Colony, Old City vicinity, then west to Givat Ram and Sacher. Full Jerusalem tour.",
    route_type: "Point-to-Point",
  },

  // ========== HAIFA (6 routes) ==========
  // 5km × 2
  {
    id: "haifa-5-1",
    name: "Bat Galim Promenade to Carmel Beach",
    city: "Haifa",
    distance_km: 5,
    start_point: "Bat Galim, Pinhas Margolin Street / promenade",
    end_point: "Carmel Beach (Hof HaCarmel)",
    description:
      "Coastal run from Bat Galim east along the sea to Carmel Beach. Flat and scenic.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-5-2",
    name: "Louis Promenade Out and Back Leg",
    city: "Haifa",
    distance_km: 5,
    start_point: "Louis Promenade (Yefe Nof Street) – Sculpture Garden",
    end_point: "Haifa Zoo / end of Louis Promenade",
    description:
      "Along Yefe Nof (Louis Promenade) on Mount Carmel. Stunning bay views; hilly.",
    route_type: "Point-to-Point",
  },
  // 10km × 2
  {
    id: "haifa-10-1",
    name: "Bat Galim to Hof HaCarmel Extended",
    city: "Haifa",
    distance_km: 10,
    start_point: "Bat Galim beach (Casino area)",
    end_point: "Hof HaCarmel / Dado Beach area",
    description:
      "Extended waterfront from Bat Galim via Nahlieli and coastal streets to Dado Beach. Sea views throughout.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-10-2",
    name: "Carmel Center to German Colony",
    city: "Haifa",
    distance_km: 10,
    start_point: "Carmel Center (Moriah Avenue)",
    end_point: "German Colony (Ben-Gurion Avenue)",
    description:
      "Down the Carmel via Moriah and Ben-Gurion Avenue to the German Colony. Net downhill; historic neighborhoods.",
    route_type: "Point-to-Point",
  },
  // 21km × 2
  {
    id: "haifa-21-1",
    name: "Haifa Half: Bat Galim to Carmel Summit",
    city: "Haifa",
    distance_km: 21,
    start_point: "Bat Galim promenade",
    end_point: "Carmel summit (University / Technion area)",
    description:
      "Half marathon from sea level at Bat Galim up through Carmel Beach and Louis Promenade to the summit. Challenging climb.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-21-2",
    name: "Carmel Beach to Kfar Galim Coastal",
    city: "Haifa",
    distance_km: 21,
    start_point: "Carmel Beach (Hof HaCarmel)",
    end_point: "Kfar Galim / HaHotrim area (south)",
    description:
      "Long coastal run south from Carmel Beach toward Kfar Galim. Flat, with Mediterranean views.",
    route_type: "Point-to-Point",
  },

  // ========== EILAT (6 routes) ==========
  // 5km × 2
  {
    id: "eilat-5-1",
    name: "North Beach Promenade to Marina",
    city: "Eilat",
    distance_km: 5,
    start_point: "North Beach promenade (HaTmarim / hotel strip)",
    end_point: "Eilat Marina",
    description:
      "Flat run along the Red Sea from North Beach to the Marina. Promenade and waterfront.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-5-2",
    name: "Marina to Coral Beach Approach",
    city: "Eilat",
    distance_km: 5,
    start_point: "Eilat Marina",
    end_point: "Coral Beach Nature Reserve entrance",
    description:
      "South from the Marina toward Coral Beach. Scenic Red Sea views; best in cooler hours.",
    route_type: "Point-to-Point",
  },
  // 10km × 2
  {
    id: "eilat-10-1",
    name: "North Beach to Coral Beach",
    city: "Eilat",
    distance_km: 10,
    start_point: "North Beach promenade",
    end_point: "Coral Beach Nature Reserve",
    description:
      "Full waterfront run from North Beach past the Marina and Dolphin Reef to Coral Beach. Flat and iconic.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-10-2",
    name: "HaNevi'im to Southern Beaches",
    city: "Eilat",
    distance_km: 10,
    start_point: "HaNevi'im Street (north)",
    end_point: "Coral Beach / Underwater Observatory area",
    description:
      "City and coast combination: HaNevi'im and HaTmarim to the southern beaches and observatory.",
    route_type: "Point-to-Point",
  },
  // 21km × 2
  {
    id: "eilat-21-1",
    name: "Eilat Half: North to Coral and Return Leg",
    city: "Eilat",
    distance_km: 21,
    start_point: "North Beach (northern end)",
    end_point: "Coral Beach Nature Reserve (southern end)",
    description:
      "Half marathon along the Red Sea: North Beach, Marina, Dolphin Reef, and Coral Beach. Out-and-back style point-to-point for distance.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-21-2",
    name: "Marina to Timna Approach (Desert Gate)",
    city: "Eilat",
    distance_km: 21,
    start_point: "Eilat Marina",
    end_point: "Northern Eilat / road to Timna (turnaround point)",
    description:
      "Northbound half from the Marina toward the desert gate (Timna direction). Flat then gradual incline; early morning recommended.",
    route_type: "Point-to-Point",
  },
];
