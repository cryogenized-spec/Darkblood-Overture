# Portraits

Face-cropped portrait derivatives used by the browser HUD (the status roundel
in the top-left corner). Keep these small — they are loaded by the DOM, not by
the Phaser boot loader.

- `arabella-hud-portrait.png` — 128 × 128 crop of the monologue artwork
  (`../dialogue/arabella/arabella-monologue.png`), window centered on her face
  (focus 0.43 / 0.30, zoom 1.75) so her gaze meets the player.

Regenerate from the source artwork when the monologue portrait changes.
