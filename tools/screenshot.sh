#!/usr/bin/env bash
#
# screenshot.sh
#
# Capture preview images for the README and the ten featured games.
#
#   docs/preview.png            - the landing page (index.html)
#   docs/games/<slug>.png       - one image per featured game
#
# Uses headless Chrome / Chromium. No dependencies beyond a Chrome install.
#
# Usage:
#   tools/screenshot.sh              # capture all images
#   tools/screenshot.sh --hero       # only the landing-page hero
#   tools/screenshot.sh --games      # only the per-game shots
#

set -euo pipefail

# Resolve repo root from this script's location so the script works from
# anywhere the user invokes it.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

DOCS_DIR="${REPO_ROOT}/docs"
GAMES_OUT_DIR="${DOCS_DIR}/games"
INDEX_FILE="${REPO_ROOT}/index.html"

WINDOW_SIZE="1200,800"
# Brief settle delay so canvas games have time to draw their first frame.
SETTLE_MS="800"

# Ten featured games — keep in sync with README.md "Ten must-play games".
FEATURED_GAMES=(
  "asteroids"
  "tetris"
  "snake"
  "pacman"
  "space-invaders"
  "2048"
  "minesweeper"
  "sokoban"
  "bullet-hell"
  "vaporwave-escape"
)

#
# Locate a Chrome/Chromium binary on macOS or Linux. Print path on stdout,
# return non-zero with a friendly message on stderr if none is found.
#
find_chrome() {
  local candidates=()

  case "$(uname -s)" in
    Darwin)
      candidates=(
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
        "/Applications/Chromium.app/Contents/MacOS/Chromium"
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
      )
      ;;
    Linux)
      candidates=(
        "google-chrome"
        "google-chrome-stable"
        "chromium"
        "chromium-browser"
        "microsoft-edge"
      )
      ;;
    *)
      echo "Unsupported OS: $(uname -s). This script supports macOS and Linux." >&2
      return 1
      ;;
  esac

  for c in "${candidates[@]}"; do
    if [[ -x "$c" ]]; then
      printf '%s\n' "$c"
      return 0
    fi
    if command -v "$c" >/dev/null 2>&1; then
      command -v "$c"
      return 0
    fi
  done

  cat >&2 <<'EOF'
Could not find a Chrome or Chromium install.

  macOS:  install Google Chrome from https://www.google.com/chrome/
          (default path: /Applications/Google Chrome.app)
  Linux:  apt install chromium  /  dnf install chromium
          or download Chrome from https://www.google.com/chrome/

Re-run this script once Chrome is installed.
EOF
  return 1
}

#
# Capture a single URL to a PNG at the configured window size.
#
# $1 - file:// URL (or http(s):// URL)
# $2 - absolute output path
#
capture() {
  local url="$1"
  local out="$2"

  mkdir -p "$(dirname -- "${out}")"

  # --hide-scrollbars keeps the screenshot clean.
  # --virtual-time-budget gives the page time to render canvas frames.
  # --no-sandbox is required when running as root inside many CI containers.
  "${CHROME}" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --no-sandbox \
    --window-size="${WINDOW_SIZE}" \
    --virtual-time-budget="${SETTLE_MS}" \
    --screenshot="${out}" \
    "${url}" \
    >/dev/null 2>&1

  if [[ ! -s "${out}" ]]; then
    echo "  failed: ${out}" >&2
    return 1
  fi
  echo "  wrote ${out#${REPO_ROOT}/}"
}

#
# Convert an absolute filesystem path to a file:// URL.
#
file_url() {
  printf 'file://%s\n' "$1"
}

capture_hero() {
  if [[ ! -f "${INDEX_FILE}" ]]; then
    echo "index.html not found at ${INDEX_FILE}" >&2
    return 1
  fi
  echo "Capturing hero image (index.html)..."
  capture "$(file_url "${INDEX_FILE}")" "${DOCS_DIR}/preview.png"
}

capture_games() {
  echo "Capturing ${#FEATURED_GAMES[@]} featured games..."
  local missing=0
  for slug in "${FEATURED_GAMES[@]}"; do
    local src="${REPO_ROOT}/games/${slug}.html"
    if [[ ! -f "${src}" ]]; then
      echo "  skip: games/${slug}.html (not found)" >&2
      missing=$((missing + 1))
      continue
    fi
    capture "$(file_url "${src}")" "${GAMES_OUT_DIR}/${slug}.png"
  done
  if (( missing > 0 )); then
    echo "${missing} featured game(s) were missing; check the FEATURED_GAMES list." >&2
  fi
}

main() {
  CHROME="$(find_chrome)"
  echo "Using Chrome: ${CHROME}"

  local mode="all"
  if [[ $# -gt 0 ]]; then
    case "$1" in
      --hero)  mode="hero" ;;
      --games) mode="games" ;;
      --all|"") mode="all" ;;
      -h|--help)
        sed -n '2,20p' "${BASH_SOURCE[0]}"
        return 0
        ;;
      *)
        echo "Unknown option: $1" >&2
        echo "Usage: $0 [--hero|--games|--all]" >&2
        return 2
        ;;
    esac
  fi

  case "${mode}" in
    hero)  capture_hero ;;
    games) capture_games ;;
    all)   capture_hero; capture_games ;;
  esac

  echo "Done."
}

main "$@"
