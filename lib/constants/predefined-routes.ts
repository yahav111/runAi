import type { PredefinedRoute } from "@/lib/types";

export const PREDEFINED_ROUTES: PredefinedRoute[] = [
  // ========== PETAH TIKVA (10 routes) ==========
  {
    id: "pt-5-1",
    name: "Em HaMoshavot to Park HaGadol",
    city: "Petah Tikva",
    distance_km: 3.5,
    start_point: "Em HaMoshavot Street, Petah Tikva",
    end_point: "Park HaGadol main entrance, Basel Street, Petah Tikva",
    description:
      "Urban run from the historic Em HaMoshavot center to the Great Park via Jabotinsky and Arlozorov.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-5-2",
    name: "Kfar Ganim to Park HaGadol",
    city: "Petah Tikva",
    distance_km: 4,
    start_point: "Kfar Ganim, Sokolov Street, Petah Tikva",
    end_point: "Park HaGadol ecological pond, Petah Tikva",
    description:
      "From Kfar Ganim through residential streets to Park HaGadol. Flat, shaded sections near the ecological pond.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-5-3",
    name: "Segula to Beilinson Hospital",
    city: "Petah Tikva",
    distance_km: 3,
    start_point: "Segula neighborhood, Petah Tikva",
    end_point: "Beilinson Hospital, Jabotinsky 39, Petah Tikva",
    description:
      "North–south run through Segula and past Yad Labanim toward the medical center. Mix of quiet and busier roads.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-1",
    name: "Em HaMoshavot – Park HaGadol – Kfar Ganim",
    city: "Petah Tikva",
    distance_km: 6,
    start_point: "Em HaMoshavot Street, Petah Tikva",
    end_point: "Kfar Ganim, Mahane Yehuda Street, Petah Tikva",
    description:
      "Extended run: center to Park HaGadol (Basel Street), through the park and out to Kfar Ganim. Varied terrain.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-2",
    name: "Jabotinsky Corridor: Grand Mall to Kiryat Arye",
    city: "Petah Tikva",
    distance_km: 5,
    start_point: "Grand Mall, Jabotinsky 72, Petah Tikva",
    end_point: "Kiryat Arye industrial zone, Petah Tikva",
    description:
      "North along Jabotinsky (Road 481). Urban and well-lit; best at off-peak hours.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-3",
    name: "Park HaGadol to Ein Ganim",
    city: "Petah Tikva",
    distance_km: 6,
    start_point: "Park HaGadol main entrance, Basel Street, Petah Tikva",
    end_point: "Ein Ganim, A.D. Gordon Street, Petah Tikva",
    description:
      "From the Great Park south through residential areas to Ein Ganim. Park paths and neighborhood streets.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-10-4",
    name: "Kfar Ganim – Hadar Ganim – Segula",
    city: "Petah Tikva",
    distance_km: 7,
    start_point: "Kfar Ganim, Sokolov Street, Petah Tikva",
    end_point: "Segula neighborhood, Petah Tikva",
    description:
      "Traverse three neighborhoods: Kfar Ganim, Hadar Ganim, and Segula. Mostly residential with some commercial.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-long-1",
    name: "South Petah Tikva to Rosh HaAyin Border",
    city: "Petah Tikva",
    distance_km: 9,
    start_point: "Kfar Ganim, southern Petah Tikva",
    end_point: "Eastern city limit, toward Rosh HaAyin",
    description:
      "Cross-city run from the southern neighborhoods through the center and east toward Rosh HaAyin. Mix of parks and urban roads.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-long-2",
    name: "Beilinson to Kiryat Arye via Park HaGadol",
    city: "Petah Tikva",
    distance_km: 8,
    start_point: "Beilinson Hospital, Jabotinsky 39, Petah Tikva",
    end_point: "Kiryat Arye industrial zone, northern Petah Tikva",
    description:
      "From the medical center north through Park HaGadol and onward to Kiryat Arye. Green start, urban finish.",
    route_type: "Point-to-Point",
  },
  {
    id: "pt-long-3",
    name: "Em HaMoshavot Full City Traverse",
    city: "Petah Tikva",
    distance_km: 10,
    start_point: "Em HaMoshavot Street, Petah Tikva",
    end_point: "Eastern city limit, near Rosh HaAyin junction",
    description:
      "Longest point-to-point across PT: center, Park HaGadol, Kfar Ganim, Hadar Ganim, Segula, and east. Full city tour.",
    route_type: "Point-to-Point",
  },

  // ========== TEL AVIV (8 routes) ==========
  {
    id: "tlv-short-1",
    name: "Charles Clore Park to Jaffa Port",
    city: "Tel Aviv",
    distance_km: 2.5,
    start_point: "Charles Clore Park, Tel Aviv",
    end_point: "Jaffa Port, Old Jaffa",
    description:
      "Coastal run south from Charles Clore Park along the promenade to Jaffa Port. Sea views and flat terrain.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-short-2",
    name: "Dizengoff Square to Yarkon Park",
    city: "Tel Aviv",
    distance_km: 3.5,
    start_point: "Dizengoff Square, Tel Aviv",
    end_point: "Yarkon Park southern entrance, Rokach Boulevard",
    description:
      "North from Dizengoff via Ibn Gabirol and Arlozorov to the southern tip of Yarkon Park. Urban to park transition.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-med-1",
    name: "Tel Aviv Port to Charles Clore",
    city: "Tel Aviv",
    distance_km: 6,
    start_point: "Tel Aviv Port (Namal Tel Aviv)",
    end_point: "Charles Clore Park, Tel Aviv",
    description:
      "Beachfront run from the Port south past Hilton Beach and Gordon Beach to Charles Clore. Mostly promenade.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-med-2",
    name: "Rothschild to Yarkon Park Sportek",
    city: "Tel Aviv",
    distance_km: 5.5,
    start_point: "Rothschild Boulevard, Neve Tzedek end, Tel Aviv",
    end_point: "Yarkon Park, Sportek area, Rokach Boulevard",
    description:
      "From Rothschild and Neve Tzedek through Allenby and north to Yarkon Park (Sportek). Cultural and green sections.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-long-1",
    name: "Tel Aviv Port to Jaffa Port (Full Tayelet)",
    city: "Tel Aviv",
    distance_km: 7.5,
    start_point: "Tel Aviv Port (Namal Tel Aviv)",
    end_point: "Jaffa Port, Old Jaffa",
    description:
      "The classic full-length Tel Aviv beach promenade (Tayelet). Port to Jaffa along the Mediterranean. Flat and iconic.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-long-2",
    name: "Jaffa to Yarkon Park North",
    city: "Tel Aviv",
    distance_km: 13,
    start_point: "Jaffa Port, Old Jaffa",
    end_point: "Yarkon Park northern end, near Tel Aviv University",
    description:
      "Half marathon route: Jaffa coast northward via the Tayelet to Tel Aviv Port, then east along Yarkon River to the park's northern end near TAU.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-long-3",
    name: "Dizengoff – Yarkon – Port – Jaffa",
    city: "Tel Aviv",
    distance_km: 15,
    start_point: "Dizengoff Square, Tel Aviv",
    end_point: "Old Jaffa Clock Tower",
    description:
      "Long city and waterfront run: Dizengoff to Yarkon Park, then south via the port and the full Tayelet promenade to Jaffa.",
    route_type: "Point-to-Point",
  },
  {
    id: "tlv-long-4",
    name: "Herzliya Marina to Jaffa Port",
    city: "Tel Aviv",
    distance_km: 18,
    start_point: "Herzliya Marina, Herzliya",
    end_point: "Jaffa Port, Old Jaffa",
    description:
      "Extended coastal half-marathon route from Herzliya Marina south along the beach through Tel Aviv to Jaffa. Flat, scenic, iconic.",
    route_type: "Point-to-Point",
  },

  // ========== JERUSALEM (8 routes) ==========
  {
    id: "jlm-short-1",
    name: "Sacher Park to Israel Museum",
    city: "Jerusalem",
    distance_km: 1.5,
    start_point: "Sacher Park (Gan Sacher) main entrance, Jerusalem",
    end_point: "Israel Museum, Ruppin Boulevard, Jerusalem",
    description:
      "Short scenic run from Sacher Park west to the Israel Museum and Knesset area. Park paths and Ruppin Boulevard.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-short-2",
    name: "Jaffa Road to Jaffa Gate",
    city: "Jerusalem",
    distance_km: 2.5,
    start_point: "Central Bus Station, Jaffa Road, Jerusalem",
    end_point: "Jaffa Gate, Old City, Jerusalem",
    description:
      "East along the full length of Jaffa Road (pedestrian/light rail zone) to the Old City walls.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-med-1",
    name: "German Colony to Sacher Park",
    city: "Jerusalem",
    distance_km: 3,
    start_point: "German Colony, Emek Refaim Street, Jerusalem",
    end_point: "Sacher Park (Gan Sacher), Jerusalem",
    description:
      "From the German Colony via Talbiya and Rehavia to Sacher Park. Rolling hills and historic neighborhoods.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-med-2",
    name: "Ben Yehuda to Mount Scopus",
    city: "Jerusalem",
    distance_km: 4,
    start_point: "Ben Yehuda Street (downtown), Jerusalem",
    end_point: "Mount Scopus, Hebrew University, Jerusalem",
    description:
      "East from downtown (Ben Yehuda, Jaffa Road) toward Mount Scopus. Significant uphill; best as a challenge run.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-med-3",
    name: "First Station to Old City",
    city: "Jerusalem",
    distance_km: 3.5,
    start_point: "First Station (HaTachana HaRishona), Jerusalem",
    end_point: "Jaffa Gate, Old City, Jerusalem",
    description:
      "From the restored First Station complex through the German Colony area and Mamilla Promenade to Jaffa Gate.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-long-1",
    name: "Malha to Old City via Train Track Park",
    city: "Jerusalem",
    distance_km: 7,
    start_point: "Malha Mall / Teddy Stadium, Jerusalem",
    end_point: "Jaffa Gate, Old City, Jerusalem",
    description:
      "Follow the Train Track Park (Park HaMesila) from Malha northward through the German Colony to the First Station, then via Mamilla to the Old City.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-long-2",
    name: "Ein Karem to Old City",
    city: "Jerusalem",
    distance_km: 8,
    start_point: "Ein Karem village, Jerusalem",
    end_point: "Jaffa Gate, Old City, Jerusalem",
    description:
      "From the picturesque Ein Karem village east through the Jerusalem hills, past Malha, German Colony, and up to the Old City. Hilly and scenic.",
    route_type: "Point-to-Point",
  },
  {
    id: "jlm-long-3",
    name: "Mount Scopus to First Station via Old City",
    city: "Jerusalem",
    distance_km: 6,
    start_point: "Mount Scopus, Hebrew University, Jerusalem",
    end_point: "First Station (HaTachana HaRishona), Jerusalem",
    description:
      "Downhill from Mount Scopus through the Old City area, Mamilla, and south to the First Station. Full Jerusalem panorama.",
    route_type: "Point-to-Point",
  },

  // ========== HAIFA (8 routes) ==========
  {
    id: "haifa-short-1",
    name: "Bat Galim to Dado Beach",
    city: "Haifa",
    distance_km: 5,
    start_point: "Bat Galim promenade, Haifa",
    end_point: "Dado Beach (Hof Dado), Haifa",
    description:
      "Coastal run along the Aryeh Gurel Promenade from Bat Galim south to Dado Beach. Flat, sea views throughout.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-short-2",
    name: "German Colony to Baha'i Gardens",
    city: "Haifa",
    distance_km: 2,
    start_point: "German Colony, Ben-Gurion Avenue, Haifa",
    end_point: "Baha'i Gardens lower terraces, Sderot HaZiyonut",
    description:
      "Up Ben-Gurion Avenue from the German Colony to the lower entrance of the Baha'i Gardens. Short but scenic uphill.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-med-1",
    name: "Bat Galim to Hof HaCarmel",
    city: "Haifa",
    distance_km: 5.5,
    start_point: "Bat Galim beach, Haifa",
    end_point: "Hof HaCarmel (Carmel Beach), Haifa",
    description:
      "Extended waterfront from Bat Galim via the coastal promenade and Dado Beach to Hof HaCarmel. Sea views throughout.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-med-2",
    name: "Bat Galim to German Colony via Downtown",
    city: "Haifa",
    distance_km: 4,
    start_point: "Bat Galim promenade, Haifa",
    end_point: "German Colony, Ben-Gurion Avenue, Haifa",
    description:
      "From the beach through downtown Haifa to the German Colony at the foot of the Baha'i Gardens. Flat start then gradual uphill.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-long-1",
    name: "Bat Galim to Carmel Center",
    city: "Haifa",
    distance_km: 7,
    start_point: "Bat Galim promenade, Haifa",
    end_point: "Carmel Center, Moriah Avenue / HaNassi Boulevard, Haifa",
    description:
      "Sea level to the Carmel: from Bat Galim beach through downtown and up to the Carmel Center. Challenging climb with great views.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-long-2",
    name: "Hof HaCarmel to Tirat Carmel",
    city: "Haifa",
    distance_km: 6.5,
    start_point: "Hof HaCarmel (Carmel Beach), Haifa",
    end_point: "Tirat Carmel, southern Haifa area",
    description:
      "Coastal run south from Hof HaCarmel toward Tirat Carmel. Flat, Mediterranean views, quieter southern stretch.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-long-3",
    name: "Bat Galim to University via Carmel",
    city: "Haifa",
    distance_km: 9,
    start_point: "Bat Galim promenade, Haifa",
    end_point: "University of Haifa, Mount Carmel",
    description:
      "From sea level at Bat Galim up through the city, Carmel Center, and continuing to the University of Haifa on the Carmel summit. Major climb.",
    route_type: "Point-to-Point",
  },
  {
    id: "haifa-long-4",
    name: "Full Haifa Coast: Bat Galim to Hof HaCarmel South",
    city: "Haifa",
    distance_km: 6.5,
    start_point: "Bat Galim promenade, Haifa",
    end_point: "Southern end of Hof HaCarmel, near Haifa Mall area",
    description:
      "Full coastal route along Haifa's beaches from Bat Galim through Dado Beach to the southern end of Carmel Beach.",
    route_type: "Point-to-Point",
  },

  // ========== EILAT (8 routes) ==========
  {
    id: "eilat-short-1",
    name: "North Beach to Marina",
    city: "Eilat",
    distance_km: 1.5,
    start_point: "North Beach promenade, HaTmarim Boulevard, Eilat",
    end_point: "Eilat Marina",
    description:
      "Short beach run from the hotel strip to the Marina. Flat and easy, good for warm-up.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-short-2",
    name: "Marina to Coral Beach",
    city: "Eilat",
    distance_km: 5,
    start_point: "Eilat Marina",
    end_point: "Coral Beach Nature Reserve entrance, Eilat",
    description:
      "South from the Marina toward Coral Beach. Scenic Red Sea views; best in cooler hours.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-med-1",
    name: "North Beach to Coral Beach",
    city: "Eilat",
    distance_km: 7,
    start_point: "North Beach promenade, Eilat",
    end_point: "Coral Beach Nature Reserve, Eilat",
    description:
      "Full Eilat waterfront: North Beach past the Marina, Dolphin Reef, to Coral Beach. The classic Eilat coastal run.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-med-2",
    name: "North Eilat to Underwater Observatory",
    city: "Eilat",
    distance_km: 7,
    start_point: "Northern Eilat, HaNevi'im Street",
    end_point: "Underwater Observatory Marine Park, Eilat",
    description:
      "City and coast: from the northern residential area south along the coast past Dolphin Reef to the observatory. Run early to avoid heat.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-long-1",
    name: "North Beach to Taba Border",
    city: "Eilat",
    distance_km: 10,
    start_point: "North Beach promenade, Eilat",
    end_point: "Taba Border Crossing area, southern Eilat",
    description:
      "Full Eilat coast and beyond: North Beach to Coral Beach, then south toward the Taba border area. The longest Eilat coastal route.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-long-2",
    name: "Eilat to Red Canyon Trailhead",
    city: "Eilat",
    distance_km: 12,
    start_point: "Eilat Marina",
    end_point: "Red Canyon trailhead, Route 12 (northwest Eilat)",
    description:
      "Desert run from the Marina northwest on Route 12 toward the Red Canyon. Gradual incline; carry water, early morning only.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-long-3",
    name: "Eilat Marina to Mount Tzfachot Trailhead",
    city: "Eilat",
    distance_km: 8,
    start_point: "Eilat Marina",
    end_point: "Mount Tzfachot trailhead, northern Eilat",
    description:
      "North from the Marina toward the desert mountains. Road running through northern Eilat to the Tzfachot trail area.",
    route_type: "Point-to-Point",
  },
  {
    id: "eilat-long-4",
    name: "Full Coast: North Beach to Taba via Coral Beach",
    city: "Eilat",
    distance_km: 11,
    start_point: "North Beach, northern end, Eilat",
    end_point: "Taba Border area, Eilat",
    description:
      "The ultimate Eilat run: entire coastline from the northern tip to the Egyptian border. Flat coastal path with Red Sea views.",
    route_type: "Point-to-Point",
  },
];
