# Ballista Keep: online layer (async PvP, ranked PvP, leaderboard)

Read this before changing anything that touches saved builds, match logs, names or the leaderboard.

## What it does
- **Name**: one name box, shown on the HUD in every mode. Filtered for profanity and reserved words (`nameErr`).
- **Ranked PvP**: online matches (host or guest) are ranked automatically when the player has an account identity and a backend. Without them the match is a friendly.
- **Name ownership**: the name is claimed inside the player's own leaderboard record. Earliest claim wins (`claimName`).
- **Cross-check**: after a ranked match each player files a report `{opponent, winner, rounds}`. `tally()` counts a match only when both reports exist, name each other, agree on the winner and show 3+ rounds. One pair counts at most 10 matches. Leaderboard W/L comes only from `tally()`.
- **Async PvP**: "Find rival" picks a random saved build from other ranked players (`pvpPool`) and replays it round by round (`ghostSetup`). Not ranked, nothing recorded. Match files from the Esc menu can be imported as extra rivals.

## Where the code lives (search `ONLINE BACKEND` in `ballista-keep.html`)
| Piece | Function |
|---|---|
| Storage contract | `BK_CLAUDE` (8 methods) and `let BK = ...` |
| Identity + startup | `pvpInit`, `PVP.uid` |
| Name claim and gate | `claimName`, `rankedGate`, `nameErr` |
| Results | `pvpRecord`, `pvpPushReports`, `tally` |
| Builds | `ghostFromLog`, `pvpPushBuilds`, `pvpPool`, `startGhost`, `ghostSetup` |
| Leaderboard | `pvpLoadLb`, `lbHtml` |
| Player ids on the wire | snapshot `hu` (host id) and guest `in.ui` (guest id) |

## Backend contract (every call is async JSON; documents carry `v: SCHEMA`)
`init()` returns the player id or null. `getLb(uid)`, `listLb()`, `putLb(doc)`, `listBuilds()`, `putBuilds(handle, builds)`, `listReports()`, `putReports(m)`.
`put*` always writes the caller's own record. A backend must enforce that, or anyone can overwrite anyone.

## Moving to Steam
1. Add `BK_STEAM` with the same eight methods. `init()` returns the SteamID after the server verifies a Steam auth session ticket.
2. Put a small server behind it (a Cloudflare Worker with D1 works). It must:
   - verify the ticket on every write and only let a player write their own records;
   - run `nameErr` again and the earliest-claim rule for names (or use the Steam persona name and drop the box);
   - run `tally()` itself and serve the totals, so clients cannot change them;
   - keep the 10-matches-per-pair cap and the 3-round minimum.
3. Replace the room code (`roomNS`, `hostRoom`, `joinRoom`) with Steam lobbies and networking. The ids already travel with the snapshot (`hu`, `in.ui`), so use SteamIDs there.
4. Wrap the page in the desktop shell (Electron or Tauri with steamworks). Nothing else in the game changes.

## Checklist when the game is updated
- **Turrets or cores added**: append to `ROSTER` and `ITEMS`. Never reorder or delete, because saved builds store the index. If you must, bump `GAME_VER`: old builds are then ignored.
- **Routes or terrain changed (GAME_VER 2)**: see BATTLEFIELD.md.
- **Stats or balance changed a lot**: bump `GAME_VER` so old builds stop being used as rivals. (Leaderboard history stays.)
- **Match log format changed** (`logRound`, `packUnit`): update `ghostFromLog` and `pvpRecord` together, and bump `SCHEMA`.
- **New stored field**: add it to the matching `BK` method, to the server, and to the `SCHEMA` note. Old documents lack it, so read it with a default.
- **New game mode**: decide whether it is ranked. Only host/guest matches call `pvpRecord`.
- **Names**: add new bad words to `BAD` and reserved ones to `RESERVED`.
- **After any change**: run the two-account test (claim a name twice, file matching and mismatching reports, load a ghost) before publishing.
- **Publishing**: update the Artifact, rebuild `index.html`, push `main` and `gh-pages` (see the publish steps in the repo notes).

## Run uploads (match logs)
Settings › "Send my match runs automatically" is on by default. When a match ends, `logFlush()` uploads every finished, unsent log:
- **Inside Claude:** `BK.putRun(id, doc)` writes `runs/{uid}/m/{matchId}`. Capability rules: `runs` read/write `owner`, `runs/{self}` write `interact`. The owner (and Claude, through ArtifactData) can read them for analysis.
- **Anywhere else:** set `RUN_ENDPOINT` in the page to a deployed `worker/runs.js` (Cloudflare Worker + D1, see `worker/`). Empty by default; the client holds no secrets.
Sent ids are remembered in `bk-runs-sent`; failed uploads retry on the next match end, on startup and when the box is re-checked. Unchecking it keeps logs on the device only.
