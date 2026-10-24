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
Separate bridge foreground mask; 10-socket tower art (painted keep now shows 4 roof / 6 side barrels); final terrain sprites (`art/terrain/{barrier,slow_field}_{blue,red}.webp`, sizes/pivots in `TERRAIN_DRAW`). Dev overlay: backquote key or `?dev`.

GAME_VER is 4 (old async builds are ignored).

## Update: drones, mounts, weapon art, HUD
- Drones launch from their own keep's roof and arc to a point on the upper three quarters of the opposing tower (`launchDrone`/`placeDrone`); they ignore the ground routes and terrain.
- The ten mounts sit on the painted tower, one per barrel: four roof barrels and six side barrels (new bg art). Note: the bg_red_* / bg_blue_* end-screen paintings still show the older 3 roof / 5 side tower (no painted socket for those two). Weapon sprites are drawn 30% larger (roof weapons keep their old size) so they cover the painted barrels.
- Weapon and projectile art (`assets/w_*`, `assets/p_*`) are the 4K sources cropped to the same framing as before (weapons 1120 px long side, projectile strips 1920 px wide).
- Top HUD rebuilt as live HTML/CSS from the HUD handoff (phase / timer / round centre panel, equal health tracks, LV | G | streak row).

## Performance notes
Profiling a heavy combat (both boards full, ~45 units) showed game logic under 2% of frame time; the cost is canvas fill rate, which grows with the 4K default. Changes: the background and its tint are baked once into a cached layer, the vignette is a small baked picture, glows are drawn from cached sprites, the canvas is opaque, and an adaptive-resolution governor steps 4K > 1440p > 1080p > 720p when combat stays under about 30 fps for 2.5 s (never climbs back by itself; Settings has a switch). Per frame at 1080p: filled pixels 6.9M -> 0.26M, radial gradients 259 -> 109.

## Graphics test
Settings > Performance > "Run graphics test" plays a scripted heavy battle (both boards full, about 44 units, drones, titans) for 5 s at each of 4K, 1440p, 1080p and 720p on the player's own device, then shows average fps, 1% low and the share of slow frames per resolution, recommends the sharpest one with avg >= 55 fps and 1% low >= 40 (falling back to avg >= 40 / 1% low >= 28, else 720p), and offers a button to apply it. The result is stored in localStorage (`bk-bench`) and a copyable summary line includes GPU, screen and core count.

## Balance pass (GAME_VER 3)
Tuned from ~600 headless Hard-vs-Hard demo matches:
- Roof mounts (R1-R4): only arcing launchers get a bonus (`ROOF_FX`): Plasma Mortar and Hellfire Rack range x1.3 / damage x2.3, Swarm Pod x1.3 / x1.9, Flak Nest range x1.3. Guns, beams and lightning are identical on every mount. Launcher tooltips and the How to play Basics tab state the roof bonus; the Hard CPU prefers launchers on R1-R4.
- Round 1-2 spawn easing (`EARLY_EASE`); explosive/sniper/heavy traits now tier at 2 and 3 pieces; cryo trait is +25%/+50% on slowed foes.
- Bike breach 18 -> 11 and spawn weight lowered; drones breach 16 -> 30, 28 HP, higher spawn weight, so ignoring air defence now hurts.
- Weapons: cryo 3.6, torch 6.4, swarm 8.8, hellfire 32, sunlance 6.4, mortar 34 damage.
- CPU: per-weapon values retuned and trait-aware buying (`cpuSyn`).
- Terrain: a barrier adds only about 3 points of round win rate; the "slow-only boards lose" skew in logs is selection (a broken barrier marks a side already under pressure).

## Exploit pass (GAME_VER 4)
Found with a fixed-board lab (same saved round, swap blue's board, replay) plus full-match economy bots:
- Rally: 12 gold, 16 s cooldown, +10% speed, -10% damage taken (was 10 g, +35% / -25%, which lifted round win rate from 56% to 88%).
- Cores: Nano Lens stacks to +30% range; Tri-Barrel adds one extra target at 60% damage (+15% per further copy); core and trait splash/pull radius capped at x2.
- Heavy trait shield 150 / 350 (was 250 / 600). Torch range 260, dmg 4.6; Glacier range 310.
- Armor: damage floor 50% of the hit (was 30%); Titan armor 4.
- Slow field speed multiplier 0.70. Drone breach scaling capped at x2 and at most 12 drones in the air per side in rounds 1-3. Titan drops capped at 2 per drop before round 10.
- CPU values Glacier higher (64). Economy tests found no exploit: hoarding, tanking, XP rush, upgrade rush and max wagers all stayed within noise or lost.

## End-of-match screen
- The match summary card opens with a large VICTORY / DEFEAT banner (spectators see "<side> wins"); the final round's after-action report carries it too.
- When the match ends the battlefield swaps to the winner's painting: `art/battlefield/bg_red_{4k,1440,1080,720}.webp` (red wins, blue keep wrecked) or `bg_blue_*.webp` (blue wins, red keep wrecked). These have no bridges, so mechs and terrain are not drawn on them. They are preloaded once either Tactician is at 30 HP or less. A draw keeps the normal background.

- Backdrops: `bg_*` (4 roof / 6 side barrels) is used for planning and combat; `bg_menu_*` (the previous painting) stays behind the main menu; `bg_red_*` / `bg_blue_*` are the end screens.

## Barrier nerf
Barrier HP 400 -> 240, cost 6 -> 7 gold, and a damaged barrier now mends only half its damage between rounds (it was fully repaired free, including at combat start). Lab (40 fights per cell, +/-8 pts noise): at round 9 the slow-field + near-barrier combo gained +30 win points over no terrain before the change and about +17 after; a lone near-gate barrier keeps roughly +100 keep HP.

## Keep health windows
`bg_{4k,1440,1080,720}.webp` are now RGBA (from `Battlefield_Health_Window_Marks_4K.png`): each keep has a transparent pointed-arch window. `drawKeepWindows()` paints a dark glass backing plus glowing faction liquid (keep HP / `KEEP_HP`, drains top to bottom, calibration in `art/battlefield/keep_health_voids.json`) under the background, so the gold tracery stays in front. The old keep bar above each keep is dropped on this backdrop; its text label stays. The menu (`bg_menu_*`) and end-screen (`bg_red_*`, `bg_blue_*`) paintings are opaque and draw no windows. Backgrounds are cache-busted with `?v=3`.

## Mobile layout

`html[data-ui]` is `mobile` or `desktop`; `data-o` is `p` (portrait) or `l` (landscape). The default is automatic: mobile when the device has a coarse pointer and its short side is 820 px or less, or the window is 640 px wide or less. Settings > Layout > Interface can force Mobile or Desktop (`bk-ui` in localStorage). Portrait stacks HUD, 16:9 field and a dock with no inner scroll; landscape gives the field the screen and slides the planning dock up as a sheet (Build/Hide button).

## Background v4 (Glass & Gilt art)
New `bg_*` painting (infinity-loop bridge, 4 roof + 6 side barrels, windowed keeps). Re-measured from the 4K art: roof mounts v 0.077, u 0.0665/0.0906/0.1146/0.1387 (red mirrored: 0.9335/0.9091/0.8846/0.8602); side mounts on the barrel mouths, u 0.1644 (red 0.8338), v 0.1751/0.2399/0.3046/0.3701/0.4349/0.4981. Keep health windows: blue 275,380,177x757 and red 3382,380,175x757 (art px, fill 380..1136). Route (blue_to_red) is a 20-segment Catmull-Rom spline through the deck centres, door (0.095,0.74) -> under the crossing at (0.5,0.635) -> right loop -> red small gate (0.86,0.612); length 1359, so PACE is 1.5 (was 1.4 on 1269). `FLY_MASK` is the over-deck patch at the crossing. Backgrounds are cache-busted with `?v=4`. Path-defence slots no longer exist (removed earlier), so the old coordinates above are history.
