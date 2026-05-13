# Screenshots

The README hero image and per-game previews under `docs/` are produced by
`tools/screenshot.sh`. The script drives headless Chrome and writes PNGs at
`1200x800`.

## What it generates

- `docs/preview.png` — the landing page (`index.html`)
- `docs/games/<slug>.png` — one image for each of the ten games featured in
  the README's "Ten must-play games" table

## Requirements

- macOS or Linux
- Google Chrome, Chromium, or Microsoft Edge installed somewhere the script
  can find it. On macOS it looks under `/Applications/`; on Linux it walks
  `PATH` for `google-chrome`, `chromium`, etc.
- That is the whole list. No npm, no Python, no Puppeteer.

If Chrome is missing the script exits with instructions for installing it.

## Run it

From the repo root:

```bash
tools/screenshot.sh           # capture everything (hero + 10 games)
tools/screenshot.sh --hero    # only the landing-page hero
tools/screenshot.sh --games   # only the per-game shots
tools/screenshot.sh --help    # usage
```

Output paths are printed as each image is written. The script is idempotent —
running it again overwrites the previous images.

## Updating the featured-game list

The list of featured games is the `FEATURED_GAMES` array near the top of
`tools/screenshot.sh`. Keep it in sync with the "Ten must-play games" table
in `README.md`. If you change one, change the other.

## Troubleshooting

- **Blank or partial images.** Some games animate slowly enough that the
  first frame is still empty when the shutter fires. Increase `SETTLE_MS`
  near the top of the script (default `800`).
- **Wrong aspect ratio in the README.** The hero is rendered at
  `1200x800`. If you re-size the viewport variable (`WINDOW_SIZE`),
  re-export the hero so the README image and the page match.
- **Chrome not found on a server.** Install Chromium with your package
  manager (`apt install chromium`, `dnf install chromium`). The script
  passes `--no-sandbox` so it works inside most CI containers.
- **Running headless on Wayland / no display.** The script already uses
  `--headless --disable-gpu`, so no display server is required.

## When to re-run it

- After adding or replacing a featured game in the README
- After visual changes to `index.html` that affect the landing page
- Before tagging a release, so the GitHub README preview stays current
