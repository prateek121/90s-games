# Performance — static analysis report

> **Disclaimer — this is HEURISTIC STATIC ANALYSIS, not runtime measurement.**
> 
> The numbers below come from regex-based pattern matching over each game's source.
> No browser was ever opened, no frames were ever timed, no heap was ever sampled.
> A game can score 5/5 here and still drop frames at runtime, and a game can score
> 2/5 here and run buttery smooth if its hot path executes only rarely. **Use this
> file to pick candidates for investigation — not as a verdict.** For real numbers,
> run `tools/perf-benchmark.html` in Chrome against each game. See
> [`tools/perf-runner.md`](../tools/perf-runner.md) for instructions.

## Methodology

For each of the 114 games in `games/`:

1. Extract all `<script>` content.
2. Find every `requestAnimationFrame(...)` call site and resolve its callback to a
   named function/method (handles `rAF(name)`, `rAF(() => this.name())`,
   `rAF(this.name.bind(this))`, and inline bodies).
3. Transitively follow `this.X()` and bare `X()` calls inside that entry point up
   to depth 3 to assemble a **hot path** — i.e. an approximation of the code that
   actually executes 60 times per second.
4. Within that hot path, count:
   - **`requestAnimationFrame` callers** — how many distinct entry points exist.
   - **Object literals per frame** — `{...}` allocations appearing as args, RHS, or
     property values. A proxy for short-lived allocations that the GC must reap.
   - **Canvas draw calls** — `fillRect`, `strokeRect`, `drawImage`, `beginPath`,
     `fillText`. More calls = more CPU work + more GPU state changes.
   - **`document.createElement` in the hot path** — a major red flag; DOM allocation
     every frame will absolutely tank performance.
   - **`for...of` over arrays in hot paths** — slower than `for (let i=0;i<n;i++)`
     in some JS engines because it allocates an iterator object per loop.
   - **Array-method allocations** — `.filter` / `.map` / `.slice` / `.concat` each
     produce a fresh array, which adds GC pressure when called per frame.
   - **`forEach`** — similar concern, plus a closure allocation per call.
   - **Inline arrow allocations** — `=> (...)` / `=> {...}` callbacks created on
     the hot path.
   - **`new X(...)`** — constructor allocations per frame.
   - **`setInterval` with no `requestAnimationFrame`** — bypasses vsync.
5. Compute a score from 1 (concerning) to 5 (looks clean). Games where no RAF hot
   path could be located (typically pure turn-based / DOM puzzle games) get a
   neutral 3.

### Score deductions

Starting from 5.0:

| Signal                                                          | Deduction          |
| --------------------------------------------------------------- | ------------------ |
| `document.createElement` in hot path                            | -2.0               |
| Object literals in hot path (>= 8)                              | -1.0               |
| Object literals in hot path (4..7)                              | -0.5               |
| `new X(...)` allocations per frame (>= 6 / 3..5)                | -1.0 / -0.5        |
| `for...of` over arrays in hot path (>= 3 / 1..2)                | -1.0 / -0.5        |
| Allocating array methods in hot path (>= 4 / 2..3)              | -1.0 / -0.5        |
| `forEach` iteration in hot path (>= 4)                          | -0.5               |
| Total draw calls per frame (>= 60 / 30..59)                     | -1.0 / -0.5        |
| `fillText` calls in hot path (>= 8)                             | -0.5               |
| Inline arrow/object allocations in hot path (>= 6)              | -0.5               |
| `setInterval`-driven loop with no `requestAnimationFrame`       | -1.0               |

Final score is clamped to [1, 5] and rounded to the nearest 0.5.

## Top 10 games most likely to need optimization

These are the lowest-scoring RAF-driven games, ordered worst first. Each is a
**candidate for investigation**, not a confirmed problem.

### 1. `8bit-quest.html` — score 2.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (update) |
| Hot-path size (bytes)                 | 7928 |
| Object literals per frame             | 8 |
| Draw calls per frame (sum)            | 8 (fillRect=7, strokeRect=1, drawImage=0, beginPath=0, fillText=0) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 7 |
| Allocating array methods (filter/map/slice/concat) | 2 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 0 |
| `new X(...)` per frame                | 1 |
| `setInterval` (file total)            | 0 |

**Flags:**

- many object literals in hot path (8)
- for...of over arrays in hot path (7)
- allocating array methods in hot path (2)

### 2. `phantom-path.html` — score 3.0 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 12052 |
| Object literals per frame             | 9 |
| Draw calls per frame (sum)            | 21 (fillRect=9, strokeRect=3, drawImage=0, beginPath=2, fillText=7) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 5 |
| Allocating array methods (filter/map/slice/concat) | 0 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 1 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- many object literals in hot path (9)
- for...of over arrays in hot path (5)

### 3. `solar-flare.html` — score 3.0 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 10857 |
| Object literals per frame             | 3 |
| Draw calls per frame (sum)            | 19 (fillRect=6, strokeRect=1, drawImage=0, beginPath=4, fillText=8) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 4 |
| Allocating array methods (filter/map/slice/concat) | 2 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 1 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- for...of over arrays in hot path (4)
- allocating array methods in hot path (2)
- many fillText calls in hot path (8)

### 4. `spectrum-runner.html` — score 3.0 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 10298 |
| Object literals per frame             | 4 |
| Draw calls per frame (sum)            | 22 (fillRect=11, strokeRect=0, drawImage=0, beginPath=0, fillText=11) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 3 |
| Allocating array methods (filter/map/slice/concat) | 0 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 0 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- several object literals in hot path (4)
- for...of over arrays in hot path (3)
- many fillText calls in hot path (11)

### 5. `space-invaders.html` — score 3.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 8890 |
| Object literals per frame             | 4 |
| Draw calls per frame (sum)            | 19 (fillRect=12, strokeRect=0, drawImage=0, beginPath=0, fillText=7) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 8 |
| Allocating array methods (filter/map/slice/concat) | 0 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 0 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 1 |

**Flags:**

- several object literals in hot path (4)
- for...of over arrays in hot path (8)

### 6. `arcade-fever.html` — score 3.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (update) |
| Hot-path size (bytes)                 | 8100 |
| Object literals per frame             | 9 |
| Draw calls per frame (sum)            | 6 (fillRect=3, strokeRect=1, drawImage=0, beginPath=2, fillText=0) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 2 |
| Allocating array methods (filter/map/slice/concat) | 1 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 0 |
| `new X(...)` per frame                | 1 |
| `setInterval` (file total)            | 0 |

**Flags:**

- many object literals in hot path (9)
- for...of in hot path (2)

### 7. `pacman.html` — score 3.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 7737 |
| Object literals per frame             | 6 |
| Draw calls per frame (sum)            | 12 (fillRect=7, strokeRect=0, drawImage=0, beginPath=1, fillText=4) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 5 |
| Allocating array methods (filter/map/slice/concat) | 0 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 0 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- several object literals in hot path (6)
- for...of over arrays in hot path (5)

### 8. `plasma-collector.html` — score 3.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 7051 |
| Object literals per frame             | 3 |
| Draw calls per frame (sum)            | 9 (fillRect=2, strokeRect=0, drawImage=0, beginPath=4, fillText=3) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 3 |
| Allocating array methods (filter/map/slice/concat) | 3 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 3 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- for...of over arrays in hot path (3)
- allocating array methods in hot path (3)

### 9. `chrono-jump.html` — score 3.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 10077 |
| Object literals per frame             | 3 |
| Draw calls per frame (sum)            | 14 (fillRect=7, strokeRect=2, drawImage=0, beginPath=1, fillText=4) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 4 |
| Allocating array methods (filter/map/slice/concat) | 2 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 2 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- for...of over arrays in hot path (4)
- allocating array methods in hot path (2)

### 10. `eclipse-runner.html` — score 3.5 / 5

| Metric                                | Value |
| ------------------------------------- | ----- |
| RAF callers detected                  | 1 (gameLoop) |
| Hot-path size (bytes)                 | 8673 |
| Object literals per frame             | 4 |
| Draw calls per frame (sum)            | 18 (fillRect=11, strokeRect=1, drawImage=0, beginPath=1, fillText=5) |
| `document.createElement` in hot path  | 0 |
| `for...of` over arrays in hot path    | 6 |
| Allocating array methods (filter/map/slice/concat) | 0 |
| `forEach` in hot path                 | 0 |
| Inline arrow allocations              | 0 |
| `new X(...)` per frame                | 0 |
| `setInterval` (file total)            | 0 |

**Flags:**

- several object literals in hot path (4)
- for...of over arrays in hot path (6)

## Full results

Sorted by score ascending, then by severity. Columns:

- **score** — 1.0 (concerning) to 5.0 (looks clean).
- **hot** — yes/no, whether a RAF hot path was statically resolved.
- **draws** — sum of `fillRect`/`strokeRect`/`drawImage`/`beginPath`/`fillText` calls in the hot path.
- **obj** — object literals in the hot path.
- **for..of** — `for...of` loops in the hot path.
- **arr-alloc** — `.filter`/`.map`/`.slice`/`.concat` in the hot path.
- **forEach** — `.forEach` calls in the hot path.
- **arrow** — inline `=>` allocations in the hot path.
- **new** — constructor allocations in the hot path.
- **createEl** — `document.createElement` in the hot path.
- **setInt** — `setInterval` calls anywhere in the file (red flag if hot=no).

| game | score | hot | draws | obj | for..of | arr-alloc | forEach | arrow | new | createEl | setInt |
| ---- | -----:| --- | -----:| ---:| -------:| ---------:| -------:| -----:| ---:| --------:| ------:|
| `8bit-quest.html` | 2.5 | yes | 8 | 8 | 7 | 2 | 0 | 0 | 1 | 0 | 0 |
| `phantom-path.html` | 3.0 | yes | 21 | 9 | 5 | 0 | 0 | 1 | 0 | 0 | 0 |
| `solar-flare.html` | 3.0 | yes | 19 | 3 | 4 | 2 | 0 | 1 | 0 | 0 | 0 |
| `spectrum-runner.html` | 3.0 | yes | 22 | 4 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `2048.html` | 3.0 | no | 0 | 1 | 0 | 2 | 0 | 1 | 0 | 1 | 0 |
| `cipher-crack.html` | 3.0 | no | 0 | 5 | 2 | 1 | 0 | 0 | 1 | 1 | 0 |
| `hanoi.html` | 3.0 | no | 0 | 0 | 1 | 0 | 0 | 2 | 0 | 1 | 0 |
| `math-marathon.html` | 3.0 | no | 0 | 0 | 0 | 0 | 0 | 5 | 1 | 0 | 1 |
| `memory.html` | 3.0 | no | 0 | 1 | 0 | 1 | 1 | 4 | 0 | 1 | 1 |
| `minesweeper.html` | 3.0 | no | 0 | 3 | 0 | 0 | 0 | 1 | 0 | 2 | 1 |
| `puzzle-match.html` | 3.0 | no | 0 | 2 | 0 | 3 | 1 | 1 | 0 | 1 | 0 |
| `riddle-realm.html` | 3.0 | no | 0 | 10 | 0 | 1 | 0 | 1 | 1 | 0 | 0 |
| `simon.html` | 3.0 | no | 0 | 4 | 0 | 0 | 2 | 7 | 0 | 0 | 1 |
| `whack-a-mole.html` | 3.0 | no | 0 | 1 | 0 | 0 | 0 | 2 | 0 | 1 | 1 |
| `space-invaders.html` | 3.5 | yes | 19 | 4 | 8 | 0 | 0 | 0 | 0 | 0 | 1 |
| `arcade-fever.html` | 3.5 | yes | 6 | 9 | 2 | 1 | 0 | 0 | 1 | 0 | 0 |
| `pacman.html` | 3.5 | yes | 12 | 6 | 5 | 0 | 0 | 0 | 0 | 0 | 0 |
| `plasma-collector.html` | 3.5 | yes | 9 | 3 | 3 | 3 | 0 | 3 | 0 | 0 | 0 |
| `chrono-jump.html` | 3.5 | yes | 14 | 3 | 4 | 2 | 0 | 2 | 0 | 0 | 0 |
| `eclipse-runner.html` | 3.5 | yes | 18 | 4 | 6 | 0 | 0 | 0 | 0 | 0 | 0 |
| `orbit-defender.html` | 3.5 | yes | 14 | 1 | 4 | 2 | 0 | 2 | 0 | 0 | 0 |
| `neon-portal.html` | 3.5 | yes | 8 | 0 | 3 | 3 | 0 | 3 | 0 | 0 | 0 |
| `ocean-explorer.html` | 3.5 | yes | 5 | 1 | 0 | 2 | 4 | 1 | 4 | 0 | 0 |
| `titan-clash.html` | 3.5 | yes | 21 | 2 | 5 | 0 | 0 | 0 | 0 | 0 | 0 |
| `velocity-zero.html` | 3.5 | yes | 21 | 3 | 3 | 1 | 0 | 1 | 0 | 0 | 0 |
| `surge-defender.html` | 3.5 | yes | 14 | 1 | 3 | 2 | 0 | 2 | 0 | 0 | 0 |
| `apex-predator.html` | 3.5 | yes | 19 | 1 | 4 | 1 | 0 | 1 | 0 | 0 | 0 |
| `pixel-blast.html` | 3.5 | yes | 20 | 3 | 4 | 0 | 0 | 0 | 0 | 0 | 0 |
| `cyber-rush.html` | 3.5 | yes | 22 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 1 |
| `matrix-trace.html` | 3.5 | yes | 18 | 1 | 3 | 1 | 0 | 1 | 1 | 0 | 0 |
| `neon-surge.html` | 3.5 | yes | 17 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 1 |
| `flow-state.html` | 3.5 | yes | 15 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 1 |
| `nebula-collector.html` | 4.0 | yes | 16 | 2 | 6 | 1 | 0 | 1 | 0 | 0 | 0 |
| `void-collector.html` | 4.0 | yes | 4 | 2 | 0 | 4 | 2 | 5 | 1 | 0 | 0 |
| `void-escape.html` | 4.0 | yes | 21 | 2 | 5 | 1 | 0 | 1 | 0 | 0 | 0 |
| `cyber-breach.html` | 4.0 | yes | 3 | 1 | 0 | 2 | 7 | 4 | 2 | 0 | 0 |
| `forest-guardian.html` | 4.0 | yes | 2 | 1 | 0 | 2 | 7 | 4 | 2 | 0 | 0 |
| `frogger.html` | 4.0 | yes | 12 | 2 | 6 | 0 | 0 | 0 | 0 | 0 | 1 |
| `cartridge-dash.html` | 4.0 | yes | 6 | 2 | 4 | 1 | 0 | 0 | 1 | 0 | 0 |
| `vaporwave-escape.html` | 4.0 | yes | 6 | 2 | 4 | 1 | 0 | 0 | 1 | 0 | 0 |
| `arcade-classic.html` | 4.0 | yes | 7 | 3 | 3 | 1 | 0 | 0 | 1 | 0 | 0 |
| `asteroids.html` | 4.0 | yes | 11 | 2 | 5 | 0 | 0 | 0 | 0 | 0 | 1 |
| `cassette-quest.html` | 4.0 | yes | 9 | 2 | 3 | 1 | 0 | 0 | 1 | 0 | 0 |
| `gravity-ball.html` | 4.0 | yes | 10 | 0 | 6 | 0 | 0 | 0 | 0 | 0 | 0 |
| `laser-grid.html` | 4.0 | yes | 15 | 1 | 4 | 1 | 0 | 1 | 0 | 0 | 0 |
| `synth-wave.html` | 4.0 | yes | 15 | 1 | 4 | 1 | 0 | 1 | 0 | 0 | 0 |
| `code-runner.html` | 4.0 | yes | 4 | 0 | 0 | 3 | 2 | 0 | 3 | 0 | 0 |
| `data-surge.html` | 4.0 | yes | 6 | 1 | 0 | 1 | 4 | 2 | 3 | 0 | 0 |
| `quake-runner.html` | 4.0 | yes | 15 | 1 | 5 | 0 | 0 | 0 | 0 | 0 | 0 |
| `sky-flyer.html` | 4.0 | yes | 5 | 1 | 0 | 1 | 4 | 2 | 3 | 0 | 0 |
| `jump-quest.html` | 4.0 | yes | 10 | 2 | 4 | 0 | 0 | 0 | 0 | 0 | 1 |
| `nova-strike.html` | 4.0 | yes | 17 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `agar.html` | 4.0 | yes | 7 | 1 | 3 | 1 | 0 | 0 | 0 | 0 | 0 |
| `infinity-burst.html` | 4.0 | yes | 8 | 0 | 3 | 1 | 0 | 2 | 0 | 0 | 0 |
| `marble-run.html` | 4.0 | yes | 5 | 1 | 4 | 0 | 0 | 0 | 0 | 0 | 0 |
| `pulse-runner.html` | 4.0 | yes | 11 | 0 | 2 | 2 | 0 | 2 | 0 | 0 | 0 |
| `tsunami-escape.html` | 4.0 | yes | 15 | 1 | 2 | 2 | 0 | 0 | 0 | 0 | 0 |
| `bounce-palace.html` | 4.0 | yes | 10 | 2 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `nexus-painter.html` | 4.0 | yes | 9 | 0 | 3 | 1 | 0 | 1 | 0 | 0 | 0 |
| `crystal-dash.html` | 4.0 | yes | 11 | 0 | 3 | 1 | 0 | 0 | 0 | 0 | 0 |
| `flappy-fall.html` | 4.0 | yes | 11 | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 0 |
| `laser-defender.html` | 4.0 | yes | 14 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | 1 |
| `aurora-dance.html` | 4.0 | yes | 16 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `lightning-strike.html` | 4.0 | yes | 15 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `rotator.html` | 4.0 | yes | 9 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| `pulse-beat.html` | 4.0 | yes | 17 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `resonance-grid.html` | 4.0 | yes | 20 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |
| `prism-match.html` | 4.0 | yes | 18 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 1 |
| `nature-collector.html` | 4.5 | yes | 3 | 1 | 0 | 3 | 2 | 1 | 2 | 0 | 0 |
| `digital-maze.html` | 4.5 | yes | 6 | 1 | 0 | 2 | 3 | 2 | 2 | 0 | 0 |
| `earth-digger.html` | 4.5 | yes | 6 | 1 | 0 | 1 | 4 | 2 | 2 | 0 | 0 |
| `earthquake-survival.html` | 4.5 | yes | 15 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `meteor-strike.html` | 4.5 | yes | 18 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `retro-racer.html` | 4.5 | yes | 7 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| `shadow-dash.html` | 4.5 | yes | 17 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `space-maze.html` | 4.5 | yes | 5 | 1 | 2 | 0 | 0 | 2 | 0 | 0 | 1 |
| `volcanic-eruption.html` | 4.5 | yes | 16 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `snake.html` | 4.5 | yes | 13 | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `aurora-burst.html` | 4.5 | yes | 12 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `breakout.html` | 4.5 | yes | 13 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 1 |
| `brick-blaster.html` | 4.5 | yes | 11 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inferno-dash.html` | 4.5 | yes | 16 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `frost-maze.html` | 4.5 | yes | 11 | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `hexagon-defense.html` | 4.5 | yes | 10 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `sokoban.html` | 4.5 | yes | 8 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `tornado-vortex.html` | 4.5 | yes | 9 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `void-jumper.html` | 4.5 | yes | 10 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `flappy.html` | 4.5 | yes | 12 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `quick-tap.html` | 4.5 | yes | 6 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `tempest-surge.html` | 4.5 | yes | 14 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `tidal-wave.html` | 4.5 | yes | 15 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `chip-tune-battle.html` | 4.5 | yes | 9 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `rhythm-tap.html` | 4.5 | yes | 13 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `time-racer.html` | 4.5 | yes | 7 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `binary-blast.html` | 5.0 | yes | 3 | 0 | 0 | 1 | 2 | 1 | 1 | 0 | 0 |
| `pixel-perfect.html` | 5.0 | yes | 5 | 1 | 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| `block-squad.html` | 5.0 | yes | 9 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| `nexus-blocks.html` | 5.0 | yes | 14 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| `color-match.html` | 5.0 | yes | 10 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `bullet-hell.html` | 5.0 | yes | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `chain-reaction.html` | 5.0 | yes | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `combo-master.html` | 5.0 | yes | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `crystal-fusion.html` | 5.0 | yes | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `echo-sync.html` | 5.0 | yes | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `fast-reflex.html` | 5.0 | yes | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `logic-gate.html` | 5.0 | yes | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `minimalist-zen.html` | 5.0 | yes | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `ping-pong-2p.html` | 5.0 | yes | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `pixel-painter.html` | 5.0 | yes | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `pong.html` | 5.0 | yes | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| `quantum-sync.html` | 5.0 | yes | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `rhythm-master.html` | 5.0 | yes | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `sequence-solver.html` | 5.0 | yes | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `tetris.html` | 5.0 | yes | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Aggregate stats

- Games analyzed: **114**
- RAF hot path resolved statically: **104** / 114

Score distribution:

| score | count |
| -----:| -----:|
| 2.5 | 1 |
| 3.0 | 13 |
| 3.5 | 18 |
| 4.0 | 36 |
| 4.5 | 26 |
| 5.0 | 20 |

### Games scoring 5.0/5 (hot path detected, no flags) — 20

Brief one-line list — these look statically clean. Confirm with the harness before assuming.

- `binary-blast.html` (draws/frame: 3, hot path bytes: 2358)
- `block-squad.html` (draws/frame: 9, hot path bytes: 6263)
- `bullet-hell.html` (draws/frame: 2, hot path bytes: 1232)
- `chain-reaction.html` (draws/frame: 4, hot path bytes: 1208)
- `color-match.html` (draws/frame: 10, hot path bytes: 3371)
- `combo-master.html` (draws/frame: 4, hot path bytes: 1089)
- `crystal-fusion.html` (draws/frame: 14, hot path bytes: 4645)
- `echo-sync.html` (draws/frame: 7, hot path bytes: 2162)
- `fast-reflex.html` (draws/frame: 0, hot path bytes: 309)
- `logic-gate.html` (draws/frame: 6, hot path bytes: 1242)
- `minimalist-zen.html` (draws/frame: 3, hot path bytes: 1518)
- `nexus-blocks.html` (draws/frame: 14, hot path bytes: 8876)
- `ping-pong-2p.html` (draws/frame: 9, hot path bytes: 4414)
- `pixel-painter.html` (draws/frame: 4, hot path bytes: 1366)
- `pixel-perfect.html` (draws/frame: 5, hot path bytes: 2759)
- `pong.html` (draws/frame: 9, hot path bytes: 5887)
- `quantum-sync.html` (draws/frame: 14, hot path bytes: 4601)
- `rhythm-master.html` (draws/frame: 2, hot path bytes: 749)
- `sequence-solver.html` (draws/frame: 7, hot path bytes: 2546)
- `tetris.html` (draws/frame: 9, hot path bytes: 6611)

## Non-RAF games (no hot path resolved)

These games do not appear to use `requestAnimationFrame`. That is **not a bug** —
most of them are turn-based / puzzle / DOM-driven games where a render loop is
not necessary. They are scored a neutral 3.0 because the heuristics in this report
don't apply.

- `2048.html` (setInterval calls: 0)
- `cipher-crack.html` (setInterval calls: 0)
- `hanoi.html` (setInterval calls: 0)
- `math-marathon.html` (setInterval calls: 1)
- `memory.html` (setInterval calls: 1)
- `minesweeper.html` (setInterval calls: 1)
- `puzzle-match.html` (setInterval calls: 0)
- `riddle-realm.html` (setInterval calls: 0)
- `simon.html` (setInterval calls: 1)
- `whack-a-mole.html` (setInterval calls: 1)

## What this report does NOT do

- It cannot detect leaks or long-tail GC pauses without runtime measurement.
- It cannot tell whether a `for...of` is actually in a hot loop vs. a cold init path
  inside the same method.
- It does not look inside class properties or arrow-method-property syntax
  (`name = () => {...}`) the same way it looks at method declarations — coverage
  may be incomplete for unusual code styles.
- It does not understand `setTimeout(fn, 0)`-style loops or RAF chained through
  promises.
- **Use [`tools/perf-benchmark.html`](../tools/perf-benchmark.html) to confirm.**

