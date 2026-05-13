# 90s Games

> 114 self-contained, retro-inspired HTML5 Canvas games. Zero dependencies. Single-file. Plays in any modern browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Made with: HTML5 + Vanilla JS](https://img.shields.io/badge/HTML5-Vanilla%20JS-orange)](#)
[![Dependencies: None](https://img.shields.io/badge/dependencies-none-brightgreen)](#)

## What's inside

114 small, focused arcade and puzzle games — breakout, asteroids, snake, tetris, pong, plus dozens of original takes on classic mechanics. Each game is one HTML file. Open it in a browser, play it. No installer, no build, no package manager.

## Quick start

```bash
git clone https://github.com/prateek121/90s-games.git
cd 90s-games
open index.html       # macOS
# or: xdg-open index.html   (Linux)
# or: start index.html      (Windows)
```

Or just double-click `index.html` in your file manager.

To play a single game directly, open its file in `games/`:

```bash
open games/asteroids.html
```

## Repo layout

```
90s-games/
├── index.html        # Landing page that links to all 114 games
├── games/            # 114 single-file HTML5 games
├── lib/              # Optional shared helpers (game-framework.js, utils.js)
├── docs/             # Developer docs (API, design, dev guide)
├── LICENSE           # MIT
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## Design principles

- **Single file per game.** No external CSS, JS, fonts, or images. Easy to inspect, fork, embed.
- **Vanilla JS only.** No frameworks, no transpilation, no build step.
- **`localStorage` for high scores.** Persistent across sessions, fully offline.
- **Keyboard + mouse + touch.** Most games work on phones and tablets.
- **Readable.** Each game is ~400–600 lines, designed to be read and modified.

## Browser support

Tested on the latest two versions of Chrome, Firefox, Safari, and Edge. Requires Canvas 2D, `requestAnimationFrame`, and `localStorage` — supported by every browser shipped since ~2013.

## Use cases

- Drop-in arcade for personal websites, kiosk demos, classroom labs
- Reference implementations for game-mechanic prototypes
- Teaching material — every game is short enough to read top-to-bottom

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for game submission standards and code style.

## License

[MIT](LICENSE) — use it for anything, just keep the copyright notice.
