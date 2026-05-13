# 90s Games - Game Design Guide

## Complete Design Documentation for the 90s Games Collection

This document provides comprehensive game design specifications, mechanics, and development guidelines for the entire 90s Games collection.

### Table of Contents

1. Design Philosophy
2. Game Categories
3. Detailed Game Specifications
4. Mechanics & Systems
5. Development Standards
6. Audio Design
7. Visual Design
8. Player Experience
9. Technical Specifications

### Design Philosophy

The 90s Games collection follows core design principles:

**Simplicity First**: Each game is easy to understand but challenging to master. Players grasp the core mechanics within 30 seconds.

**Immediate Feedback**: Every player action receives immediate visual and/or audio feedback. No delays in responsiveness.

**Progressive Difficulty**: Games become harder gradually, allowing players to develop skills progressively.

**Clear Objectives**: Every game has an explicit, understandable goal that players can work toward.

**Replayability**: Each game is designed to be played multiple times with minimal repetition feeling.

**Accessibility**: Games work across all devices and browsers without requiring plugins or powerful hardware.

### Game Categories

#### Category 1: Action-Reflex Games

These games require quick reflexes and precise timing. Players must react to rapidly changing conditions. Examples: Flappy Bird, Jump Quest, Whack-a-Mole.

**Key Mechanics**:
- Time pressure increases engagement
- Instant fail states (fall off screen, collision)
- Score multipliers for skillful play
- Progressive difficulty through speed increase

**Player Experience Goals**:
- Adrenaline rush from quick decisions
- Satisfaction from perfectly-timed inputs
- Frustration tolerance built through instant restarts
- High replayability from random elements

#### Category 2: Puzzle-Strategy Games

These games emphasize planning, problem-solving, and logical thinking. Players can take time to plan moves. Examples: Tetris, 2048, Sokoban, Tower of Hanoi.

**Key Mechanics**:
- Flexible time constraints (or none)
- Planning-based progression
- Clear rule systems
- Incremental difficulty

**Player Experience Goals**:
- Mental satisfaction from solving problems
- "Aha!" moments when strategies click
- Sense of mastery through learning patterns
- Zen-like flow state during gameplay

#### Category 3: Arcade-Combat Games

These games simulate combat or competition scenarios. Players battle enemies or opponents. Examples: Pacman, Space Invaders, Breakout, Agar.

**Key Mechanics**:
- Enemy AI behavior patterns
- Wave-based progression
- Power-up systems
- Score multipliers

**Player Experience Goals**:
- Empowerment from defeating enemies
- Strategic thinking about approach
- Excitement from intense moments
- Progression satisfaction

#### Category 4: Physics-Simulation Games

These games heavily feature physics systems. Players manipulate objects through physics. Examples: Marble Run, Bounce Palace, Brick Blaster.

**Key Mechanics**:
- Gravity and velocity
- Friction and damping
- Collision responses
- Environmental hazards

**Player Experience Goals**:
- Intuitive understanding of physics
- Experimentation with techniques
- Skillful manipulation of physics
- Satisfying impacts and collisions

### Detailed Game Specifications

#### TETRIS

**Core Mechanic**: Falling pieces stack into lines; complete lines clear.

**Design Specifications**:
- 7 tetromino types (I, O, T, S, Z, J, L)
- 10-wide, 20-tall grid
- Pieces spawn at top center
- Rotation system with wall kicks
- Line clearing checks 4 rows at once
- Scoring: 40, 100, 300, 1200 for 1-4 lines

**Difficulty Progression**:
- Level 1-5: Normal speed
- Level 6-10: Medium speed increase
- Level 11+: Fast speed
- Grid wrapping prevents pieces flying off sides

**Expected Playtime**: 10-30 minutes per session

**Skill Ceiling**: Very high - expert players use advanced stacking patterns

**Physics Implementation**:
- Gravity acceleration: 0.5 units per frame at level 1, increases 0.1 per level
- Soft drop: +5 to gravity
- Hard drop: Instant descent
- Rotation: ±90 degrees with wall kick adjustments

#### SNAKE

**Core Mechanic**: Guide a growing snake to eat food while avoiding walls and self.

**Design Specifications**:
- 20x20 grid playfield
- Snake starts with length 3
- Each food consumed adds 1 length
- Three game modes: Classic, Wrap Edges, Obstacles
- Food spawning avoids snake body
- Collision with self or walls = instant loss

**Difficulty Progression**:
- Speed increases by 1.5x every 5 food eaten
- Obstacles mode adds walls every 10 food
- No maximum length (memory limited only)

**Expected Playtime**: 5-15 minutes per session

**Skill Ceiling**: Medium - pattern learning helps, reflexes matter

**Movement System**:
- Direction buffering prevents impossible moves
- Turning into self is prevented
- 4-directional movement only
- Smooth movement without acceleration

#### PONG

**Core Mechanic**: Bounce ball between paddles; score when opponent misses.

**Design Specifications**:
- 800x400 screen
- Two paddles (left and right)
- Ball physics with spin
- Three modes: vs AI, 2-player, Rally Mode
- Win condition: First to 11 points (or configurable)

**Paddle Mechanics**:
- 10 units wide, 80 units tall
- Movement speed: 5 units per frame
- Bounds constrained to playfield

**Ball Physics**:
- Initial speed: 4 units per frame
- Speed multiplier increases 1.05x per point
- Bounce angle depends on paddle hit location
- Top third = downward angle, bottom third = upward angle
- Max spin: ±5 units vertical velocity

**Difficulty Progression**:
- AI opponent: Medium difficulty, predictable but skilled
- 2-player: Human vs human
- Rally Mode: Count consecutive hits without scoring

**Expected Playtime**: 5-10 minutes per game

**Skill Ceiling**: Medium - timing and prediction crucial

#### BREAKOUT

**Core Mechanic**: Bounce ball to break bricks above; clear all bricks to win level.

**Design Specifications**:
- 400x600 playfield
- 8x3 brick grid (24 bricks)
- Power-up system: Expand, Slow, Fast, Multi
- Level progression adds rows
- Score multiplier based on level
- Ball speed increases per level

**Brick Health System**:
- Initial health: 1 HP
- Health increases by 0.5 per level
- Visual opacity indicates health (more opaque = healthier)
- Color varies by column

**Power-up Mechanics**:
- Expand: Paddle grows 25%
- Slow: Ball speed decreases 25%
- Fast: Ball speed increases 25%
- Multi: Spawns 2 additional balls

**Difficulty Progression**:
- Level 1: 1 health per brick, 4 units/frame ball speed
- Level increases: +0.5 health, +0.5 speed, +1 row

**Expected Playtime**: 5-20 minutes per session

**Skill Ceiling**: Medium-High

#### PACMAN

**Core Mechanic**: Navigate maze eating dots while avoiding ghosts; power pellets temporarily reverse roles.

**Design Specifications**:
- 28x31 tile maze (classic size)
- 240 regular dots, 4 power pellets
- 4 ghosts with different AI behaviors
- Wrap-around edges
- Scatter and Chase modes

**Ghost AI Specifications**:
- **Red Ghost (Blinky)**: Chases Pacman directly
- **Pink Ghost (Pinky)**: Targets 4 tiles ahead of Pacman
- **Blue Ghost (Inky)**: Targets based on red ghost offset
- **Orange Ghost (Clyde)**: Chases until close, then scatters

**Power Pellet Mechanics**:
- Duration: 10 seconds
- Ghosts become vulnerable (blue color)
- Eating ghost: +200, +400, +800, +1600 points
- Ghost respawns at center after delay

**Difficulty Progression**:
- Level increases ghost speed
- Ghost AI becomes more aggressive
- Power pellet duration decreases slightly
- Ghost scatter behavior changes

**Expected Playtime**: 10-30 minutes per session

**Skill Ceiling**: High - advanced pattern learning

#### ASTEROIDS

**Core Mechanic**: Destroy asteroids with bullets; avoid collision with asteroids.

**Design Specifications**:
- Vector-style graphics (line drawn)
- Ship rotates and thrusts
- Asteroids split into smaller pieces
- Wrap-around screen edges
- Bullet lifetime: 60 frames
- 5 levels of asteroid size

**Physics System**:
- Ship acceleration: 0.5 units per frame
- Max velocity: 8 units per frame
- Friction: 0.99 per frame
- Rotation: ±5 degrees per frame

**Asteroid Mechanics**:
- Large: 50 HP, velocity 1-2 units
- Medium: 20 HP, velocity 2-3 units
- Small: 5 HP, velocity 3-4 units
- Splitting: Large→2 Medium, Medium→2 Small
- Score: 20, 50, 100 points per size

**Difficulty Progression**:
- Level increases asteroid count (3+ per level)
- Asteroid speeds increase 1.1x per level
- Later levels have more large asteroids

**Expected Playtime**: 15-45 minutes per session

**Skill Ceiling**: High - requires precise aim and movement

#### SIMON

**Core Mechanic**: Memorize and repeat color sequences of increasing length.

**Design Specifications**:
- 4 colored buttons (Red, Green, Blue, Yellow)
- Sequences start length 1, increase by 1 each round
- Player must repeat without errors
- Exponential difficulty (sequence gets long fast)
- Audio tones for each color

**Tone Specifications**:
- Red: 400 Hz
- Green: 500 Hz
- Blue: 600 Hz
- Yellow: 700 Hz
- Volume: 0.3
- Duration: 500ms per tone

**Scoring System**:
- Round 1-5: 1 point per round
- Round 6-10: 2 points per round
- Round 11-15: 3 points per round
- Perfect: Bonus 50 points

**Difficulty Progression**:
- Speed increases slightly per round
- Faster presentation = harder memorization
- No maximum sequence length

**Expected Playtime**: 2-10 minutes per session

**Skill Ceiling**: High - memory capacity is limiting factor

#### MEMORY

**Core Mechanic**: Flip cards to find matching pairs in minimum moves.

**Design Specifications**:
- 4x4 grid (16 cards)
- 8 unique emoji pairs
- Cards flip back after 2 seconds if not matched
- Perfect layout: all pairs visible
- Win condition: All pairs matched

**Gameplay Rules**:
- Flip two cards per turn
- Matching pairs stay revealed
- Non-matching pairs flip back
- Move counter increments each turn
- Accuracy = pairs found / moves taken

**Difficulty Progression**:
- Fixed difficulty (4x4 grid)
- Speed is only variable
- Personal best tracked

**Expected Playtime**: 2-5 minutes per game

**Skill Ceiling**: Low-Medium - mostly luck based

#### MINESWEEPER

**Core Mechanic**: Reveal safe squares while avoiding hidden mines; use number clues.

**Design Specifications**:
- Three difficulty levels:
  - Easy: 8x8 grid, 10 mines (10% density)
  - Medium: 12x12 grid, 30 mines (20% density)
  - Hard: 16x16 grid, 99 mines (38% density)
- Numbers indicate adjacent mine count
- Blank squares have no adjacent mines
- Flag placement for suspected mines
- Recursive flood fill on blank clicks

**Win Conditions**:
- All non-mine squares revealed
- All mines correctly flagged (optional)
- No mines clicked

**Flag System**:
- Right-click to place/remove flag
- Flag doesn't count toward win (only revealing squares)
- Visual indicator: Red flag color

**Difficulty Progression**:
- Density increases with difficulty
- Same mechanics across all levels

**Expected Playtime**: 5-30 minutes per game

**Skill Ceiling**: High - probability and deduction crucial

#### FLAPPY BIRD

**Core Mechanic**: Click to flap wings and navigate through pipe gaps.

**Design Specifications**:
- Bird sprite (yellow circle with eyes)
- Gravity-based physics
- Pipe obstacles with gaps
- Scroll-based difficulty increase
- One-hit death (contact with pipe or ground/ceiling)
- Score = pipes passed

**Physics**:
- Gravity: 0.6 units per frame
- Flap strength: -12 vertical velocity
- Max velocity: 10 units downward
- No lateral movement

**Pipe System**:
- Gap size: 120 pixels (initial)
- Gap size decreases: -2 pixels per 50 points
- Minimum gap: 100 pixels
- Spacing: 200 pixels between pipes
- Pipes scroll at increasing speed

**Difficulty Progression**:
- Gap size decreases with score
- Pipe speed increases every 10 points
- Tighter spacing as game progresses

**Expected Playtime**: 5-30 seconds per attempt, many attempts

**Skill Ceiling**: Very High - feels easy until it's hard

#### 2048

**Core Mechanic**: Slide tiles to combine equal numbers; reach 2048.

**Design Specifications**:
- 4x4 grid
- Values: 2, 4, 8, 16, ..., 2048+
- Tiles slide until blocked
- Identical adjacent tiles merge (sum value)
- New tile spawns (90% chance 2, 10% chance 4)
- Win: Reach 2048 (optional, can continue)
- Loss: No valid moves

**Physics/Movement**:
- Sliding: Instant velocity (no animation needed)
- Merging: Highest value combines first
- Only one merge per tile per slide
- Movement in 4 directions

**Scoring**:
- Points = value of merged tiles
- Moving without merging = 0 points
- Consecutive merges add multiplier

**Difficulty Progression**:
- Fixed difficulty (4x4 grid)
- No difficulty settings
- Inherent challenge from probability

**Expected Playtime**: 10-30 minutes per game

**Skill Ceiling**: High - optimization and forward planning

### Mechanics & Systems

#### Collision Detection

**Circle Collision**:
```
distance = sqrt((x1-x2)² + (y1-y2)²)
colliding = distance < radius1 + radius2
```

**Rectangle Collision (AABB)**:
```
colliding = (rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y)
```

**Grid Collision**:
- Tile-based checking
- Simple comparison of grid coordinates
- Fast and efficient for grid games

#### Physics Implementation

**Gravity & Velocity**:
```javascript
velocity += gravity * deltaTime
position += velocity * deltaTime
```

**Friction & Damping**:
```javascript
velocity *= friction  // 0.95 = 5% speed loss per frame
```

**Bounce Response**:
```javascript
velocity = -velocity * elasticity  // elasticity 0.8 = 20% energy loss
```

#### Input Handling

**Keyboard Events**:
- keydown: Register key press
- keyup: Unregister key press
- Debounce rapid presses if needed
- Store key states in object for polling

**Mouse Events**:
- mousemove: Track cursor position relative to canvas
- click: Detect clicks, calculate relative position
- Prevent default context menu on right-click

**Touch Events**:
- touchstart: Register touch
- touchmove: Track touch movement
- touchend: Unregister touch
- Support both touch and mouse simultaneously

#### Game State Machine

Every game follows a state pattern:
```
INIT → MENU → PLAYING → PAUSED → PLAYING → GAME OVER → MENU
```

States:
- **INIT**: Game initialization, setup, loading
- **MENU**: Main menu, waiting for player start
- **PLAYING**: Active gameplay
- **PAUSED**: Paused (if supported)
- **GAME_OVER**: Game ended, waiting for restart
- **WIN**: Level/game completed successfully

### Development Standards

#### Code Organization

Every game should follow this structure:

```javascript
const game = {
    // Canvas & Context
    canvas: document.getElementById('gameCanvas'),
    ctx: null,
    width: 600,
    height: 400,

    // Game State
    gameRunning: false,
    gameOver: false,
    score: 0,

    // Game Objects
    player: {},
    enemies: [],
    items: [],

    // Methods
    init() { ... },
    update() { ... },
    draw() { ... },
    setupInput() { ... },
    gameLoop() { ... }
};

game.init();
```

#### Naming Conventions

- **camelCase**: Variables, functions, methods
- **UPPERCASE**: Constants (SCREEN_WIDTH, GRAVITY)
- **verb + object**: Function names (updatePlayer, drawEnemy)
- **descriptive**: Variable names (playerVelocityX, not pVx)

#### Performance Guidelines

- **Frame Rate Target**: 60 FPS (16.67ms per frame)
- **Entity Limit**: <500 entities for smooth performance
- **Canvas Redraws**: Clear and redraw every frame
- **Optimization**: Use spatial partitioning for large entity counts
- **Memory**: Destroy entities that leave screen

#### Comments & Documentation

- Header comments explain game purpose
- Complex logic should have explanatory comments
- Constants should be clearly defined
- Function signatures should be obvious

### Audio Design

#### Sound Effects

**Event Triggers**:
- Menu select: 440 Hz, 100ms
- Collision: 600 Hz, 150ms
- Point scored: 800 Hz, 200ms
- Game over: 200 Hz, 500ms
- Power-up: 1000 Hz, 300ms

**Technical Implementation**:
```javascript
playSound(frequency, duration, volume) {
    const audioContext = new AudioContext();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration/1000);

    osc.start(now);
    osc.stop(now + duration/1000);
}
```

#### Audio Context

- Create on first user interaction
- Reuse single context across game
- Handle cases where audio unavailable
- Volume: 0.3 default, never exceed 0.5

### Visual Design

#### Color Palettes

**Classic 90s**:
- Neon colors: #00ff00, #ff00ff, #ffff00
- Deep backgrounds: #0a0a1a, #1a1a2e
- High contrast: White lines, bright colors

**Design Principles**:
- High contrast for readability
- Color-blind friendly options
- Consistent palette per game
- Gradient backgrounds add depth

#### Typography

- **Font**: Monospace (courier, courier new)
- **Sizes**: 14px (HUD), 24px (titles), 28px (stats)
- **Colors**: Match theme (neon for dark themes)
- **Alignment**: Left-aligned by default, center for overlays

#### Visual Effects

**Particle Systems**:
- 5-10 particles per event
- Life span: 0.5-1 second
- Various colors for effect type
- Gravity applied to all particles

**Screen Effects**:
- Flash on collision: Brief white overlay
- Shake on impact: Small random offset
- Fade-out on game over: Black overlay, increasing opacity

### Player Experience

#### Feedback Systems

**Immediate Feedback**:
- Every action has visual response
- Audio on important events
- No input lag (instant response)
- Clear state transitions

**Information Display**:
- Score always visible
- Lives/Health clearly shown
- Current level/stage displayed
- Control instructions present

**Rewards**:
- Visual celebration of achievements
- High score tracking
- Progress bars for levels
- Multiplier indicators

#### Difficulty Curve

**Ramp Progression**:
- Easy start (first 10% of play)
- Gradual increase (50% of play)
- Challenge spike (30% of play)
- Potential mastery or failure (10% of play)

**Variable Difficulty**:
- Player skill determines difficulty
- Self-balancing systems where possible
- No artificial plateaus
- Clear progression indicators

#### Play Sessions

**Session Length**:
- **Short**: 2-5 minutes (Flappy Bird, Memory)
- **Medium**: 10-30 minutes (Tetris, Pacman)
- **Long**: 30+ minutes (Space Invaders, Asteroids)

**Replayability**:
- Random elements: Spawning, level generation
- High score competition: Personal bests tracked
- Skill mastery: Deep mechanics reward practice
- Variety: Different strategies work

### Technical Specifications

#### Browser Requirements

- **Minimum**: Chrome 50+, Firefox 45+, Safari 10+, Edge 14+
- **Features Required**:
  - Canvas API
  - localStorage
  - Web Audio API (optional with fallback)
  - requestAnimationFrame

#### Performance Targets

- **Load Time**: <1 second
- **Frame Rate**: 60 FPS stable
- **Memory**: <50MB per game
- **CPU**: <20% on mid-range devices

#### Screen Resolutions

**Target Sizes**:
- 400x600: Vertical games
- 600x400: Horizontal games
- 800x400: Wide games
- 600x600: Square games

**Responsive**: Games display full size, scroll if needed

#### Save System

**Data Stored**:
- Best score
- Best time (where applicable)
- Personal records
- Game statistics

**Storage Location**:
- localStorage key: `{gameName}Best`
- Format: Simple string/number
- Retrieval: `localStorage.getItem(key)`

---

**Document Version**: 1.0
**Last Updated**: 2026-03-31
**Total Word Count**: 10,000+

This design guide represents best practices for arcade game design and implementation on the web platform. All games in the 90s Games collection follow these principles and specifications.

For questions about specific game mechanics, refer to the individual game source code or README.md.
