# Accessibility Audit

This document audits the 114 mini-games in `games/` for accessibility
signals: how each accepts input (keyboard, mouse/click, touch), whether
its primary `<canvas>` exposes keyboard focus (`tabindex`), and whether
the source contains red/green color literals that may double as gameplay
signaling.

The findings drive a prioritized fix list at the end. The helper module at
`lib/a11y.js` provides the building blocks (keyboard nav, focus trap,
aria-live announcements, colorblind filters, reduced-motion detection).

## Methodology

Each game file is scanned for input event registrations:

- **Keyboard:** `keydown`, `keyup`, `keypress`, `onkeydown` listeners.
- **Mouse:** `mousedown`/`move`/`up`, `pointerdown`/`move`/`up`. Bare
  `click` listeners count as mouse only when no keyboard handler exists
  (otherwise treated as start-button glue).
- **Touch:** `touchstart`/`move`/`end`.
- **Focus exposure:** `<canvas ... tabindex=...>` attribute present.
- **Color risk:** red and green CSS literals (`red`, `#f00`, `#ff0000`,
  `rgb(255,0,0)` and green equivalents) both appearing at least twice,
  a proxy for red/green-only signaling that fails for protanopes /
  deuteranopes.

Counts are heuristic — false positives are possible (e.g., the literal
`"red"` in a player-name string) — but at the 114-game scale the signal
is good enough to prioritize manual review.

## Summary

| Metric | Count |
|---|---|
| Total games | 114 |
| Keyboard-friendly (keyboard-only or both) | 89 |
| Keyboard-only (no mouse) | 76 |
| Both keyboard + mouse | 13 |
| Mouse-only (no keyboard alternative) | 25 |
| Touch-friendly | 5 |
| Canvas without `tabindex` (focus not exposed) | 104 |
| Red/green color-signaling risk | 15 |

Headline numbers: **89/114 keyboard-friendly, 25 mouse-only, 5 touch-friendly.**

## Per-Game Table

Columns: keyboard input registered, mouse/click input registered, touch
input registered, canvas exposes focus (`tabindex`), red/green color
signaling risk. `n/a` for tabindex means the game does not use a canvas.

| Game | Keyboard | Mouse | Touch | Canvas focusable | R/G risk |
|---|---|---|---|---|---|
| `2048` | yes | no | no | n/a | no |
| `8bit-quest` | yes | no | no | no | yes |
| `agar` | no | yes | no | no | no |
| `apex-predator` | yes | no | no | no | yes |
| `arcade-classic` | yes | no | yes | no | yes |
| `arcade-fever` | yes | no | yes | no | no |
| `asteroids` | yes | no | no | no | no |
| `aurora-burst` | yes | no | no | no | no |
| `aurora-dance` | yes | no | no | no | no |
| `binary-blast` | yes | no | no | no | no |
| `block-squad` | yes | no | no | no | no |
| `bounce-palace` | no | yes | no | no | no |
| `breakout` | yes | no | no | no | no |
| `brick-blaster` | no | yes | no | no | no |
| `bullet-hell` | yes | yes | no | no | no |
| `cartridge-dash` | yes | no | no | no | no |
| `cassette-quest` | yes | no | no | no | yes |
| `chain-reaction` | no | yes | no | no | no |
| `chip-tune-battle` | no | yes | no | no | yes |
| `chrono-jump` | yes | no | no | no | no |
| `cipher-crack` | no | yes | no | n/a | no |
| `code-runner` | yes | no | no | no | yes |
| `color-match` | no | yes | no | no | no |
| `combo-master` | yes | no | no | no | no |
| `crystal-dash` | yes | no | no | no | no |
| `crystal-fusion` | no | yes | no | no | no |
| `cyber-breach` | yes | no | no | no | yes |
| `cyber-rush` | yes | no | no | no | no |
| `data-surge` | yes | no | no | no | no |
| `digital-maze` | yes | no | no | no | no |
| `earth-digger` | yes | no | no | no | no |
| `earthquake-survival` | yes | no | no | no | no |
| `echo-sync` | yes | yes | no | no | no |
| `eclipse-runner` | yes | no | no | no | yes |
| `fast-reflex` | no | yes | no | no | no |
| `flappy` | yes | no | no | no | no |
| `flappy-fall` | yes | yes | no | no | no |
| `flow-state` | no | yes | no | no | no |
| `forest-guardian` | yes | yes | no | no | no |
| `frogger` | yes | no | no | no | yes |
| `frost-maze` | yes | no | no | no | no |
| `gravity-ball` | no | yes | no | no | no |
| `hanoi` | yes | no | no | n/a | no |
| `hexagon-defense` | no | yes | no | no | no |
| `inferno-dash` | yes | no | no | no | no |
| `infinity-burst` | yes | yes | no | no | no |
| `jump-quest` | yes | no | no | no | no |
| `laser-defender` | yes | no | no | no | no |
| `laser-grid` | yes | no | no | no | no |
| `lightning-strike` | yes | no | no | no | no |
| `logic-gate` | yes | yes | no | no | no |
| `marble-run` | no | yes | no | no | no |
| `math-marathon` | yes | no | no | n/a | yes |
| `matrix-trace` | yes | yes | no | no | no |
| `memory` | no | yes | no | n/a | no |
| `meteor-strike` | yes | no | no | no | no |
| `minesweeper` | no | yes | no | n/a | no |
| `minimalist-zen` | no | yes | no | no | no |
| `nature-collector` | yes | no | no | no | no |
| `nebula-collector` | yes | no | no | no | no |
| `neon-portal` | yes | no | no | no | no |
| `neon-surge` | yes | no | no | no | no |
| `nexus-blocks` | yes | no | no | no | no |
| `nexus-painter` | yes | yes | no | no | no |
| `nova-strike` | yes | no | no | no | yes |
| `ocean-explorer` | yes | no | no | no | no |
| `orbit-defender` | yes | no | no | no | no |
| `pacman` | yes | no | no | no | no |
| `phantom-path` | yes | no | no | no | no |
| `ping-pong-2p` | yes | no | no | no | no |
| `pixel-blast` | yes | yes | no | no | no |
| `pixel-painter` | no | yes | no | no | no |
| `pixel-perfect` | no | yes | no | no | no |
| `plasma-collector` | yes | yes | no | no | no |
| `pong` | yes | no | no | no | no |
| `prism-match` | no | yes | no | no | no |
| `pulse-beat` | yes | no | yes | no | no |
| `pulse-runner` | yes | no | no | no | no |
| `puzzle-match` | no | yes | no | n/a | no |
| `quake-runner` | yes | no | no | no | no |
| `quantum-sync` | no | yes | no | no | no |
| `quick-tap` | no | yes | no | no | yes |
| `resonance-grid` | yes | no | no | no | no |
| `retro-racer` | yes | no | no | no | no |
| `rhythm-master` | yes | no | no | no | no |
| `rhythm-tap` | yes | no | no | no | no |
| `riddle-realm` | yes | no | no | n/a | no |
| `rotator` | yes | no | no | no | no |
| `sequence-solver` | no | yes | no | no | no |
| `shadow-dash` | yes | no | no | no | no |
| `simon` | no | yes | no | n/a | no |
| `sky-flyer` | yes | no | no | no | no |
| `snake` | yes | no | no | no | yes |
| `sokoban` | yes | no | no | no | no |
| `solar-flare` | yes | no | no | no | no |
| `space-invaders` | yes | no | no | no | yes |
| `space-maze` | yes | no | no | no | no |
| `spectrum-runner` | yes | no | yes | no | no |
| `surge-defender` | yes | yes | no | no | no |
| `synth-wave` | yes | no | no | no | no |
| `tempest-surge` | yes | no | no | no | no |
| `tetris` | yes | no | no | no | no |
| `tidal-wave` | yes | no | no | no | no |
| `time-racer` | yes | yes | yes | no | no |
| `titan-clash` | yes | no | no | no | yes |
| `tornado-vortex` | yes | no | no | no | no |
| `tsunami-escape` | yes | no | no | no | no |
| `vaporwave-escape` | yes | no | no | no | no |
| `velocity-zero` | yes | yes | no | no | no |
| `void-collector` | yes | no | no | no | no |
| `void-escape` | yes | no | no | no | no |
| `void-jumper` | yes | no | no | no | no |
| `volcanic-eruption` | yes | no | no | no | no |
| `whack-a-mole` | no | yes | no | n/a | no |

## Mouse-Only Games (need keyboard alternatives)

25 games register no key listeners. They are unreachable for
keyboard-only users and screen-reader users. Most are point-and-click,
drag, or tap-board games where keyboard navigation across a grid plus
Enter/Space to activate would be a reasonable retrofit:

- `agar`
- `bounce-palace`
- `brick-blaster`
- `chain-reaction`
- `chip-tune-battle`
- `cipher-crack`
- `color-match`
- `crystal-fusion`
- `fast-reflex`
- `flow-state`
- `gravity-ball`
- `hexagon-defense`
- `marble-run`
- `memory`
- `minesweeper`
- `minimalist-zen`
- `pixel-painter`
- `pixel-perfect`
- `prism-match`
- `puzzle-match`
- `quantum-sync`
- `quick-tap`
- `sequence-solver`
- `simon`
- `whack-a-mole`

## Canvases Without Exposed Focus

104 of 104 games render to a
`<canvas>` element with no `tabindex` attribute. The element cannot
receive keyboard focus, so even games whose JS *does* listen for key
events may not actually respond unless focus is elsewhere on `window`.
Adding `tabindex="0"` plus `role="application"` (what
`A11y.enableKeyboardNav()` does automatically) is a one-line fix per
game.

Affected games:

- `8bit-quest`
- `agar`
- `apex-predator`
- `arcade-classic`
- `arcade-fever`
- `asteroids`
- `aurora-burst`
- `aurora-dance`
- `binary-blast`
- `block-squad`
- `bounce-palace`
- `breakout`
- `brick-blaster`
- `bullet-hell`
- `cartridge-dash`
- `cassette-quest`
- `chain-reaction`
- `chip-tune-battle`
- `chrono-jump`
- `code-runner`
- `color-match`
- `combo-master`
- `crystal-dash`
- `crystal-fusion`
- `cyber-breach`
- `cyber-rush`
- `data-surge`
- `digital-maze`
- `earth-digger`
- `earthquake-survival`
- `echo-sync`
- `eclipse-runner`
- `fast-reflex`
- `flappy`
- `flappy-fall`
- `flow-state`
- `forest-guardian`
- `frogger`
- `frost-maze`
- `gravity-ball`
- `hexagon-defense`
- `inferno-dash`
- `infinity-burst`
- `jump-quest`
- `laser-defender`
- `laser-grid`
- `lightning-strike`
- `logic-gate`
- `marble-run`
- `matrix-trace`
- `meteor-strike`
- `minimalist-zen`
- `nature-collector`
- `nebula-collector`
- `neon-portal`
- `neon-surge`
- `nexus-blocks`
- `nexus-painter`
- `nova-strike`
- `ocean-explorer`
- `orbit-defender`
- `pacman`
- `phantom-path`
- `ping-pong-2p`
- `pixel-blast`
- `pixel-painter`
- `pixel-perfect`
- `plasma-collector`
- `pong`
- `prism-match`
- `pulse-beat`
- `pulse-runner`
- `quake-runner`
- `quantum-sync`
- `quick-tap`
- `resonance-grid`
- `retro-racer`
- `rhythm-master`
- `rhythm-tap`
- `rotator`
- `sequence-solver`
- `shadow-dash`
- `sky-flyer`
- `snake`
- `sokoban`
- `solar-flare`
- `space-invaders`
- `space-maze`
- `spectrum-runner`
- `surge-defender`
- `synth-wave`
- `tempest-surge`
- `tetris`
- `tidal-wave`
- `time-racer`
- `titan-clash`
- `tornado-vortex`
- `tsunami-escape`
- `vaporwave-escape`
- `velocity-zero`
- `void-collector`
- `void-escape`
- `void-jumper`
- `volcanic-eruption`

## Red/Green Color-Signaling Risk

15 games contain at least two red and two green color literals,
a proxy for using red-vs-green as the *only* gameplay signal (good vs
bad, safe vs danger, friendly vs enemy). These need a manual pass to add
a redundant cue — shape, label, position, or pattern — or to switch to
the colorblind-safe Wong/Okabe palette. The `A11y.setColorblindMode()`
helper can also be wired to a Settings menu so end users can apply a
simulation filter to verify legibility for themselves.

| Game | `red` matches | `green` matches |
|---|---|---|
| `8bit-quest` | 2 | 2 |
| `apex-predator` | 3 | 8 |
| `arcade-classic` | 2 | 11 |
| `cassette-quest` | 2 | 3 |
| `chip-tune-battle` | 3 | 2 |
| `code-runner` | 2 | 16 |
| `cyber-breach` | 2 | 19 |
| `eclipse-runner` | 3 | 2 |
| `frogger` | 2 | 8 |
| `math-marathon` | 2 | 2 |
| `nova-strike` | 3 | 12 |
| `quick-tap` | 3 | 6 |
| `snake` | 2 | 7 |
| `space-invaders` | 2 | 12 |
| `titan-clash` | 3 | 3 |

## Touch-Friendly Games

Only 5 games register touch event listeners directly.
Most others happen to work on mobile only because the browser
synthesizes `click` from a tap — fine for board-style games, poor for
action games that need swipes or held buttons:

- `arcade-classic`
- `arcade-fever`
- `pulse-beat`
- `spectrum-runner`
- `time-racer`

## Prioritized Fix List

Top 10 to fix first, picked from the "well-known classic" cohort
(highest visibility / most-played-looking) so a11y improvements compound
across discovery and screenshots:

1. **`snake`** — canvas missing `tabindex`; red/green signaling risk; no touch support.
2. **`tetris`** — canvas missing `tabindex`; no touch support.
3. **`pong`** — canvas missing `tabindex`; no touch support.
4. **`pacman`** — canvas missing `tabindex`; no touch support.
5. **`space-invaders`** — canvas missing `tabindex`; red/green signaling risk; no touch support.
6. **`breakout`** — canvas missing `tabindex`; no touch support.
7. **`frogger`** — canvas missing `tabindex`; red/green signaling risk; no touch support.
8. **`asteroids`** — canvas missing `tabindex`; no touch support.
9. **`minesweeper`** — mouse-only — add keyboard nav; no touch support.
10. **`memory`** — mouse-only — add keyboard nav; no touch support.

## How to Use `lib/a11y.js`

```html
<script src="../lib/a11y.js"></script>
<script>
  const canvas = document.getElementById("game");
  // Make the canvas focusable and route arrow keys + space.
  A11y.enableKeyboardNav(canvas, {
    up:    () => player.move(0, -1),
    down:  () => player.move(0,  1),
    left:  () => player.move(-1, 0),
    right: () => player.move( 1, 0),
    space: () => player.fire(),
    enter: () => game.start(),
  });

  if (A11y.prefersReducedMotion()) game.disableScreenShake();

  // Wire a settings dropdown to apply a CV simulation filter.
  cbSelect.addEventListener("change",
    e => A11y.setColorblindMode(canvas, e.target.value));

  // Announce score milestones to screen readers.
  game.on("levelUp", n => A11y.announce(`Level ${n}`));

  // Trap focus inside the pause-menu modal.
  const release = A11y.focusTrap(pauseMenu);
  // ...later, when the modal closes: release();
</script>
```

## Per-Mode Indexes

### Keyboard-only (76)

- `2048`
- `8bit-quest`
- `apex-predator`
- `arcade-classic`
- `arcade-fever`
- `asteroids`
- `aurora-burst`
- `aurora-dance`
- `binary-blast`
- `block-squad`
- `breakout`
- `cartridge-dash`
- `cassette-quest`
- `chrono-jump`
- `code-runner`
- `combo-master`
- `crystal-dash`
- `cyber-breach`
- `cyber-rush`
- `data-surge`
- `digital-maze`
- `earth-digger`
- `earthquake-survival`
- `eclipse-runner`
- `flappy`
- `frogger`
- `frost-maze`
- `hanoi`
- `inferno-dash`
- `jump-quest`
- `laser-defender`
- `laser-grid`
- `lightning-strike`
- `math-marathon`
- `meteor-strike`
- `nature-collector`
- `nebula-collector`
- `neon-portal`
- `neon-surge`
- `nexus-blocks`
- `nova-strike`
- `ocean-explorer`
- `orbit-defender`
- `pacman`
- `phantom-path`
- `ping-pong-2p`
- `pong`
- `pulse-beat`
- `pulse-runner`
- `quake-runner`
- `resonance-grid`
- `retro-racer`
- `rhythm-master`
- `rhythm-tap`
- `riddle-realm`
- `rotator`
- `shadow-dash`
- `sky-flyer`
- `snake`
- `sokoban`
- `solar-flare`
- `space-invaders`
- `space-maze`
- `spectrum-runner`
- `synth-wave`
- `tempest-surge`
- `tetris`
- `tidal-wave`
- `titan-clash`
- `tornado-vortex`
- `tsunami-escape`
- `vaporwave-escape`
- `void-collector`
- `void-escape`
- `void-jumper`
- `volcanic-eruption`

### Both keyboard + mouse (13)

- `bullet-hell`
- `echo-sync`
- `flappy-fall`
- `forest-guardian`
- `infinity-burst`
- `logic-gate`
- `matrix-trace`
- `nexus-painter`
- `pixel-blast`
- `plasma-collector`
- `surge-defender`
- `time-racer`
- `velocity-zero`

### Mouse-only (25)

- `agar`
- `bounce-palace`
- `brick-blaster`
- `chain-reaction`
- `chip-tune-battle`
- `cipher-crack`
- `color-match`
- `crystal-fusion`
- `fast-reflex`
- `flow-state`
- `gravity-ball`
- `hexagon-defense`
- `marble-run`
- `memory`
- `minesweeper`
- `minimalist-zen`
- `pixel-painter`
- `pixel-perfect`
- `prism-match`
- `puzzle-match`
- `quantum-sync`
- `quick-tap`
- `sequence-solver`
- `simon`
- `whack-a-mole`
