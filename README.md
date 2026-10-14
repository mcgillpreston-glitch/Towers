# Ballista Keep

A neon auto-battler set in 2187, in a timeline where gunpowder never stopped evolving.

Each round you get 60 seconds to plan: buy turrets from a shop of five, merge three copies into a stronger star, stack traits and fit cores onto your keep's 10 mounts. Then 30 seconds of combat runs on its own as both keeps send identical armies at each other. Lose a round and you lose HP. The last tactician standing wins.

## Play

Open `index.html` in a browser, or play it on GitHub Pages once Pages is turned on for this repo (Settings → Pages → Deploy from a branch → `main` / root).

- **Against the CPU:** Easy or Hard.
- **Against a friend:** one player chooses **Create room** and sends the page link and room code. The other opens the link, types the code and chooses **Join**. Browsers connect directly to each other, introduced by the free PeerJS service, so no account is needed.

Keys during planning: **D** reroll, **F** buy XP, **E** sell, **Esc** cancel a selection.

## Files

- `index.html` — the whole game (canvas, logic, UI).
- `ballista_bby.mp3` — menu and planning music.
- `OoooooOOOooo.mp3` — combat music.
