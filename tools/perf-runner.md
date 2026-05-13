# perf-benchmark.html — manual runner guide

This is a no-deps, single-file performance harness. It loads any game in
`/games/` inside an iframe, hooks the iframe's `requestAnimationFrame`, and
collects 30 seconds of frame-timing + heap samples.

## Prerequisites

- **Chrome or Edge** (Chromium-based). The heap stats rely on
  `performance.memory`, which is Chromium-only. Firefox and Safari work for
  FPS/variance/dropped-frame stats, but the heap card will say so.
- The repo served by **any static HTTP server** so the iframe can load the
  game over `http://`/`https://` rather than `file://`. The `file://` scheme
  blocks cross-frame access and will break the RAF hook.

### Quick local server

From the repo root, pick whichever is handy:

```bash
# Python 3
python3 -m http.server 8000

# Node (if installed)
npx --yes http-server -p 8000

# Or any other static server
```

Then open `http://localhost:8000/tools/perf-benchmark.html`.

## Running a single game

1. Open `http://localhost:8000/tools/perf-benchmark.html?game=<filename>`
   — for example `?game=snake.html`. You can also leave the query string off
   and type the filename into the input at the top of the page, then click
   **Load**.
2. Wait for the game to fully render. If the game has a start screen,
   **click into it** so its main loop actually starts. The harness only
   counts frames once the game registers `requestAnimationFrame` callbacks.
3. Press **Run 30s**. The harness will:
   - Sample every animation frame for 30 seconds.
   - Poll `performance.memory.usedJSHeapSize` every 250 ms.
   - Update the live FPS graph + heap graph as it goes.
4. When the run ends, the right panel shows the full JSON report and a
   **Copy report** button. The same JSON is also printed via
   `console.log('[perf-benchmark] report for <game>', report)` — open
   DevTools to grab it that way too.
5. Click **Stop** to end a run early; the report is still produced with
   `stoppedEarly: true`.

## What the numbers mean

| Field                          | Meaning                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `fps.avg`                      | Mean FPS across the whole run.                                                 |
| `fps.min`                      | FPS implied by the single longest frame (worst-case stutter).                  |
| `fps.p1Low`                    | FPS at the 99th-percentile slowest frame — a much more useful "feel" metric.   |
| `frames.varianceMs2`           | Variance (ms²) of frame deltas. Lower = smoother.                              |
| `frames.droppedCount`          | Frames slower than 20 ms (i.e. <50 fps).                                       |
| `frames.longFrameCount`        | Frames slower than 33.34 ms (i.e. <30 fps) — these are visible jank.           |
| `heap.peakBytes`               | Largest `usedJSHeapSize` seen during the run.                                  |
| `heap.growthBytes`             | `last - first` heap size — positive = leak suspect.                            |
| `heap.gcEventCount`            | Sample-to-sample drops of >1 MB. A proxy for GC pressure, not exact.           |
| `rafRegistrations`             | How many `requestAnimationFrame` callbacks were registered during the run.     |
| `buckets`                      | 250 ms FPS buckets, useful for re-graphing the run elsewhere.                  |

## Filling in the tracking sheet

Copy the JSON, then paste these fields into your tracking sheet — one row
per game:

| Column            | JSON path                       |
| ----------------- | ------------------------------- |
| Game              | `game`                          |
| Avg FPS           | `fps.avg`                       |
| 1% low FPS        | `fps.p1Low`                     |
| Frame variance    | `frames.varianceMs2`            |
| Dropped %         | `frames.droppedPct`             |
| Long frame %      | `frames.longFramePct`           |
| Peak heap (MB)    | `heap.peakBytes / 1024 / 1024`  |
| Heap growth (MB)  | `heap.growthBytes / 1024 / 1024`|
| GC events         | `heap.gcEventCount`             |
| Notes             | free-form                       |

## Tips for fair runs

- **Same window size every run.** Resizing the harness mid-run will skew
  the numbers because canvases re-allocate.
- **Foreground tab only.** Chrome throttles RAF in background tabs to
  ~1 Hz, which will look like the game is broken.
- **Disable extensions.** Ad blockers and dev extensions can inject
  expensive callbacks. Use an incognito window with extensions off.
- **Close other tabs.** Especially anything with video, GPU work, or
  service workers running in the background.
- **One run per game in a fresh tab** for the cleanest numbers — leaking
  state from a previous run's iframe can confuse the heap delta.

## Known limitations

- The harness only sees frames driven by `requestAnimationFrame`. A game
  driven by `setInterval` will look like 0 FPS — that's a finding, not a
  bug in the tool.
- `performance.memory` reports a per-process number. If the iframe shares
  a process with the host page, the heap reading is "everything in this
  renderer" — usually fine for relative comparisons, not for absolute
  numbers.
- `gcEventCount` is a heuristic. Real GC events smaller than the 1 MB
  drop threshold will be missed; transient drops larger than that for
  reasons other than GC will be counted.
- Cross-origin iframes block the RAF hook entirely. Always serve the
  games from the same origin as the harness.
