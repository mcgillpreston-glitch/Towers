# Ballista Keep

A glass-and-gold auto-battler set in 2489: two rival keeps, one divided bridge, and a last accord.

Each round you get 60 seconds to plan: buy turrets from a shop of five, merge three copies into a stronger star, stack traits and fit cores onto your keep's 10 mounts. Then 30 seconds of combat runs on its own as both keeps send identical armies at each other. Lose a round and you lose HP. The last tactician standing wins.

## Play

Open `index.html` in a browser, or play it on GitHub Pages once Pages is turned on for this repo (Settings → Pages → Deploy from a branch → `main` / root).

- **Against the CPU:** Easy or Hard.
- **Against a friend:** one player chooses **Create room** and sends the page link and room code. The other opens the link, types the code and chooses **Join**. Browsers connect directly to each other, introduced by the free PeerJS service, so no account is needed.

Keys during planning: **D** reroll, **F** buy XP, **E** sell. **Tab** shows the match stats, **Esc** opens the menu (audio and video settings, leave game).

## Files

- `index.html` — the whole game (canvas, logic, UI).
- `ballista_bby.mp3` — menu and planning music.
- `OoooooOOOooo.mp3` — combat music.


## Art
The keeps, turrets, minions, cores, projectiles and arena background are painted sprites in `assets/`. If an image fails to load the game falls back to its built-in vector art.

## Online layer
Ranked PvP, async rivals and the leaderboard are described in [ONLINE.md](ONLINE.md), including the Steam port plan and the checklist to follow when the game changes.

## Lore
How the Master Lore Book is used in the game, and what is still to build, is in [LORE.md](LORE.md).

## Credits and licences
Shown in the game under Menu / Settings, About. Music: Suno (paid plan). Art: ChatGPT (paid plan), edited by the creator. Intro video: Runway (paid plan). PeerJS (MIT); Cinzel and Chakra Petch (SIL OFL 1.1).
