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
