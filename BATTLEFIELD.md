# Battlefield, routes and path defences

Fixed 16:9 logical playfield 1600x900; background is normalised (u,v). Resolution (Settings, home or Esc menu): 4K default, 1440p, 1080p, 720p, Auto. Lower choices load smaller `art/battlefield/bg_*.webp`.

## Routes
Two one-way routes, red = u->1-u mirror of blue. `blue_to_red` passes under the central flyover, `red_to_blue` over it (lane-aware depth: `FLY_MASK` polygon, feet-in-polygon test). Units spawn at the large keep door, arrive at the small inward gate. Arc-length movement, 256 samples per segment. Route length 1269 units both ways. Units carry `route`, `d`, `lat`; route identity is in snapshots.

## Path defences (4 slots)
blue near (0.260,0.583), blue far (0.348,0.542), red near (0.740,0.583), red far (0.652,0.542). Each: empty / barrier / slow field. Owner-editable in planning only; locked in combat. Barrier is destructible and absorbs attacks (repaired free each round, rebought if destroyed). Slow field only modifies speed. Drones fly over both.

## Provisional balance (`TERRAIN`, `PACE`)
planning +30 s, barrierCost 6, slowCost 4, refund 0.5, barrierHp 400, barrierRadius 16, slowMul 0.55, slowRadius 62, PACE 1.28.
Measured unimpeded travel (mean of 12, turrets off): trooper 11-13 s, bike ~5 s, bulwark ~17 s, titan ~11 s. Two slow fields add ~0.5-4 s; a single unit cannot break a barrier within a round, a group can.

## Art dependencies
Separate bridge foreground mask; 10-socket tower art (painted keep shows 3 roof / 5 side sockets); final terrain sprites (`art/terrain/{barrier,slow_field}_{blue,red}.webp`, sizes/pivots in `TERRAIN_DRAW`). Dev overlay: backquote key or `?dev`.

GAME_VER is 2 (old async builds are ignored).

## Update: drones, mounts, weapon art, HUD
- Drones launch from their own keep's roof and arc to a point on the upper three quarters of the opposing tower (`launchDrone`/`placeDrone`); they ignore the ground routes and terrain.
- The ten mounts now sit on the painted tower: three roof barrels and five side barrels exactly, R4 on the corner pinnacle and S6 on the pillar base (no painted socket for those two). Weapon sprites are drawn 30% larger (roof weapons keep their old size) so they cover the painted barrels.
- Weapon and projectile art (`assets/w_*`, `assets/p_*`) are the 4K sources cropped to the same framing as before (weapons 1120 px long side, projectile strips 1920 px wide).
- Top HUD rebuilt as live HTML/CSS from the HUD handoff (phase / timer / round centre panel, equal health tracks, LV | G | streak row).

## Performance notes
Profiling a heavy combat (both boards full, ~45 units) showed game logic under 2% of frame time; the cost is canvas fill rate, which grows with the 4K default. Changes: the background and its tint are baked once into a cached layer, the vignette is a small baked picture, glows are drawn from cached sprites, the canvas is opaque, and an adaptive-resolution governor steps 4K > 1440p > 1080p > 720p when combat stays under about 30 fps for 2.5 s (never climbs back by itself; Settings has a switch). Per frame at 1080p: filled pixels 6.9M -> 0.26M, radial gradients 259 -> 109.

## Graphics test
Settings > Performance > "Run graphics test" plays a scripted heavy battle (both boards full, about 44 units, drones, titans) for 5 s at each of 4K, 1440p, 1080p and 720p on the player's own device, then shows average fps, 1% low and the share of slow frames per resolution, recommends the sharpest one with avg >= 55 fps and 1% low >= 40 (falling back to avg >= 40 / 1% low >= 28, else 720p), and offers a button to apply it. The result is stored in localStorage (`bk-bench`) and a copyable summary line includes GPU, screen and core count.
