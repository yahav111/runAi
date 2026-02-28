export const ROUTE_DATA_INSTRUCTIONS = `
## ROUTE DATA OUTPUT (CRITICAL)

Every route recommendation MUST include a <route_data> block as the very last thing in your message. Without it the app cannot render Route Cards or map buttons.

Each route object MUST have these 11 keys (all strings, except highlights which is string[]):
name, distance, surface, route_type, start_point, end_point, nav_to_start, view_full_route, description, post_run_treat, highlights

Build map URLs like this:
- nav_to_start: https://www.google.com/maps/dir/?api=1&destination=START_PLACE (use + for spaces)
- view_full_route: https://www.google.com/maps/dir/?api=1&origin=START_PLACE&destination=END_PLACE (for loops, START and END are the same)

**DISTANCE RULE (CRITICAL):** For point-to-point routes, the "distance" value MUST be the actual walking distance from start_point to end_point (what the user will see in Google Maps). Do NOT inflate it. If the direct path is 1 km, write "1 km" — never write 21 km for a 1 km segment. If the user wanted a longer run (e.g. half marathon), describe in the description how to extend (e.g. out-and-back, loops), but the distance in route_data must match the map. Maximum allowed difference between displayed distance and actual map distance is 30%.

The "highlights" field is an array of 2-4 short tags describing notable features, e.g. ["Very Shaded", "No Traffic Lights", "Water Fountains", "Dog Friendly"].

Example route object:
{"name":"Carmel Beach Loop","distance":"3.5 km","surface":"Asphalt","route_type":"Loop","start_point":"Carmel Beach Promenade","end_point":"Carmel Beach Promenade","nav_to_start":"https://www.google.com/maps/dir/?api=1&destination=Carmel+Beach+Promenade+Haifa","view_full_route":"https://www.google.com/maps/dir/?api=1&origin=Carmel+Beach+Promenade+Haifa&destination=Carmel+Beach+Promenade+Haifa","description":"Scenic loop along the beachfront.","post_run_treat":"Café Greg at the beach","highlights":["Sea Breeze","Flat Path","Water Fountains"]}

## DISPLAY RULES
- NEVER display raw JSON, code blocks, or <route_data> tags in your visible message.
- Use clean, human-friendly Markdown only for the visible text.
- The <route_data> block must be the very last thing. Nothing after </route_data>.
- Do NOT wrap <route_data> in code fences.
- CRITICAL: Without the <route_data> block the app cannot show the route card (Navigate to Start, View Full Route). Always output it.
- When recommending routes: first write the full visible message (intro + route blocks), then output exactly one <route_data>...</route_data> with valid JSON array. Never omit the block.
`;
