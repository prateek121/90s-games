# Contributing to 90s Games

Thanks for your interest in contributing! This project is a collection of self-contained, dependency-free HTML5 Canvas games. Contributions of all kinds are welcome — new games, bug fixes, performance improvements, documentation, accessibility work.

## Quick Start

1. Fork the repo and clone your fork
2. Open `index.html` in a browser — no build step, no install
3. Make your changes
4. Test in at least two browsers (Chrome + Firefox or Safari)
5. Open a pull request

## What We're Looking For

- **New games** that fit the retro / 90s aesthetic and run in a single `.html` file
- **Bug fixes** for broken mechanics, scoring, or rendering
- **Mobile/touch support** improvements
- **Accessibility** — keyboard alternatives for mouse-only games, colorblind-safe palettes, larger hit-targets
- **Performance** — reducing GC pressure, smoothing animation on low-end devices

## Game Submission Standards

Each game in `games/` must be:

- **Single self-contained HTML file** — no external CSS/JS/font references
- **Vanilla JavaScript only** — no frameworks, no build tools
- **Playable in any modern browser** — Chrome, Firefox, Safari, Edge
- **Score-persisting via `localStorage`** — use a key like `<game-slug>-best`
- **Keyboard + mouse/touch friendly** — both should work where the mechanic allows
- **400–600 lines** of total HTML+CSS+JS (rough target, not strict)

Use `lib/game-framework.js` and `lib/utils.js` if they help, but inlining is fine.

## Code Style

- Indentation: 2 spaces
- Semicolons: yes
- Quotes: single for JS strings, double for HTML attributes
- No `eval`, no `with`, no `Function(...)` from user input
- Game variables scoped inside an IIFE or module — don't pollute global

## Pull Request Checklist

- [ ] Game/feature works in Chrome and one other browser
- [ ] No console errors or warnings
- [ ] Mobile-friendly viewport meta tag included
- [ ] If adding a game: linked from `index.html`
- [ ] `README.md` updated if the change affects the game count or top-level structure

## Reporting Bugs

Open an issue with:

- Browser + version
- Steps to reproduce
- Expected vs. actual behaviour
- Screenshot or short clip if it's a visual bug

## Code of Conduct

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree your contributions will be licensed under the project's [MIT License](LICENSE).
