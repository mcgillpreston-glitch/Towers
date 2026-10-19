# Of Blood & Glass: how the lore is used in the game

Source of truth: *Of Blood & Glass: Master Lore Book* (kept by the project owner; the game quotes it verbatim for dialogue and summarises it elsewhere).

## In the game now
| Lore element | Where it appears | Code |
|---|---|---|
| Title, 2489, The Last Accord | Main menu, clock label, page title | `showOverlay` demo branch, `<title>` |
| Azurecourt / Sapphire Keep (left), Vermilion / Crimson Keep (right) | HUD, banners, reports | `SIDES`, `LORE_SIDE` |
| Mounts R1-R4 (roof) and S1-S6 (inward side) | Mount chips, reports | `MOUNT_LABEL` |
| Ten station chiefs, five per Keep, paired stations | Install line when a turret is seated; losing crew's lines on the match-over screen; Crews wiki tab | `CHIEFS`, `STATION`, `chiefBark`, `endingHtml` |
| Last Witness (16 Romeo/Juliette exchanges) | Start of planning in rounds 1, 4, 7...; Voices wiki tab | `WITNESS`, `updateWitness` |
| Blue and red endings | Match-over screen after a decisive result, with the matching exchange | `ENDING`, `endingHtml` |
| World, towns, arsenal, machines, cores | Wiki tabs (also reachable from the main menu) | `wikiHtml` |

## Rules from the lore book to keep
- The two endings are alternatives, never consecutive events. Their exchanges appear only after the matching victory, never as a pre-battle prediction.
- Romeo and Juliette are projections beside the Keeps. They never occupy a mount and are not an eleventh operator.
- A chief's specialty never restricts what can be installed on a mount.
- Both victories carry a cost for the defeated town. Do not write either ending as a clean triumph.
- Minions are repeatable chassis, not named characters. Turret and chassis art must not borrow a crew member's identity.

## Not built yet (described in the book)
- **Path defences:** each attack path has two designated areas for barriers or slow fields, a continuous route always remains, and planning gains 30 seconds to build them. This is a new gameplay mechanic and is not in the game.
- Portrait art for Romeo and Juliette (the book reserves portrait ids; the game shows name plates only).
- Chief lines for low tower integrity and for casual fire orders (only some chiefs have them in the book).
- The thirteen-day story chapters (days 1 to 13) and campaign gating of dialogue.
- Nano Lens core art.

## When the lore book changes
Update the data blocks in `ballista-keep.html` (`CHIEFS`, `WITNESS`, `ENDING`, the wiki text), keep quoted lines word for word, then follow the publish steps in `ONLINE.md`'s checklist. Names stored in saved builds are turret indexes, not lore names, so lore edits never invalidate saved builds.
