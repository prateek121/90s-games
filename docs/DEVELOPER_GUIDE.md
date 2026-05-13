# 90s Games - Developer Guide

## Complete Guide to Developing Games for the 90s Games Collection

This guide provides everything you need to understand, modify, and extend the 90s Games Collection. Whether you want to customize existing games or create new ones, this document covers all aspects of game development for this project.

### Table of Contents

1. Project Overview
2. Getting Started
3. Game Architecture
4. Core Game Loop
5. Physics Systems
6. Input Handling
7. Collision Detection
8. Visual Rendering
9. Audio System
10. State Management
11. Performance Optimization
12. Debugging & Testing
13. Game Examples
14. API Reference

### 1. Project Overview

The 90s Games Collection is a library of browser-based games built with vanilla JavaScript and HTML5 Canvas. Key characteristics:

- **No Dependencies**: Pure JavaScript, no frameworks or libraries
- **Self-Contained**: Each game is a single HTML file
- **Consistent Architecture**: All games follow the same design patterns
- **Cross-Browser**: Compatible with all modern browsers
- **Responsive**: Works on desktop, tablet, and mobile
- **Extensible**: Easy to add new games or modify existing ones

### 2. Getting Started

#### Prerequisites

- Text editor (VS Code, Sublime, etc.)
- Modern web browser
- Basic JavaScript knowledge
- Understanding of game development concepts

#### Project Structure

```
90s-games/
├── index.html                    # Landing page
├── lib/
│   ├── game-framework.js         # Shared framework
│   └── utils.js                  # Utility functions
├── games/
│   ├── tetris.html               # Individual game files
│   ├── snake.html
│   └── [other games...]
├── README.md                     # Project readme
├── GAME_DESIGN_GUIDE.md         # Design specifications
└── DEVELOPER_GUIDE.md           # This file
```

#### Creating Your First Game

1. Create a new file: `games/my-game.html`
2. Copy the template below
3. Implement game logic
4. Test in browser
5. Add to index.html

#### Basic Game Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MY GAME - 90s Games</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, monospace;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        canvas#gameCanvas {
            border: 3px solid #fff;
            background: #000;
            display: block;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="600" height="400"></canvas>

    <script>
        const game = {
            canvas: document.getElementById('gameCanvas'),
            ctx: null,
            width: 600,
            height: 400,

            init() {
                this.ctx = this.canvas.getContext('2d');
                this.setupInput();
                this.gameLoop();
            },

            update() {
                // Game logic here
            },

            draw() {
                // Rendering here
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.width, this.height);
            },

            setupInput() {
                // Input handling here
            },

            gameLoop() {
                this.update();
                this.draw();
                requestAnimationFrame(() => this.gameLoop());
            }
        };

        game.init();
    </script>
</body>
</html>
```

### 3. Game Architecture

All games follow a standard object-oriented architecture with the following structure:

```javascript
const game = {
    // Canvas properties
    canvas: Element,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,

    // Game state
    gameRunning: boolean,
    gameOver: boolean,
    score: number,

    // Game entities
    player: Object,
    enemies: Array,
    items: Array,

    // Methods
    init(): void,
    update(): void,
    draw(): void,
    setupInput(): void,
    gameLoop(): void,
    [other methods]
};
```

#### Key Methods

**init()**: Initialize game
- Setup canvas context
- Initialize game state
- Load resources
- Setup input handlers
- Start game loop

**update()**: Update game state (called every frame)
- Update entity positions
- Check collisions
- Handle input
- Update score/stats
- Check win/lose conditions

**draw()**: Render graphics (called every frame)
- Clear canvas
- Draw background
- Draw entities
- Draw UI
- Update DOM

**setupInput()**: Setup input handlers
- Keyboard events
- Mouse events
- Touch events

**gameLoop()**: Main game loop
- Call update()
- Call draw()
- Schedule next frame with requestAnimationFrame

### 4. Core Game Loop

The game loop is the heart of every game. It runs approximately 60 times per second:

```javascript
gameLoop() {
    // 1. Update game state
    this.update();

    // 2. Render graphics
    this.draw();

    // 3. Schedule next frame
    requestAnimationFrame(() => this.gameLoop());
}
```

Timing:
- Target: 60 FPS (16.67ms per frame)
- requestAnimationFrame handles synchronization with display refresh rate
- No artificial sleep/delay needed

### 5. Physics Systems

Different games implement different physics. Here are common patterns:

#### Simple Physics (Gravity)

```javascript
// Gravity acceleration
entity.vy += gravity;

// Update position
entity.y += entity.vy;
entity.x += entity.vx;

// Friction/damping
entity.vx *= friction; // 0.95 = 5% speed loss
entity.vy *= friction;
```

#### Bounce Physics

```javascript
// Wall collision
if (entity.x < 0) {
    entity.x = 0;
    entity.vx = -entity.vx * elasticity; // elasticity 0.8 = 20% energy loss
}

// Bounce from platform
if (collideWithPlatform) {
    entity.vy = -Math.abs(entity.vy);
    entity.y = platform.y - entity.radius;
}
```

#### Vector-Based Movement

```javascript
// Store velocity as vector
entity.vx = Math.cos(angle) * speed;
entity.vy = Math.sin(angle) * speed;

// Apply velocity
entity.x += entity.vx;
entity.y += entity.vy;

// Rotate toward target
const targetAngle = Math.atan2(targetY - entity.y, targetX - entity.x);
entity.rotation = targetAngle;
```

#### Grid-Based Movement

```javascript
// Cell-based position
entity.gridX = 5;
entity.gridY = 10;

// Pixel position from grid
entity.x = entity.gridX * cellSize;
entity.y = entity.gridY * cellSize;

// Direction buffering
if (keys['arrowright'] && canMove(gridX + 1, gridY)) {
    gridX++;
}
```

### 6. Input Handling

Proper input handling ensures responsive game feel.

#### Keyboard Input

```javascript
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Poll keys in update()
update() {
    if (keys['arrowleft']) {
        player.x -= speed;
    }
    if (keys[' ']) {
        player.jump();
    }
}
```

#### Mouse Input

```javascript
// Track mouse position
document.addEventListener('mousemove', (e) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
});

// Handle clicks
document.addEventListener('click', (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check what was clicked
    if (this.checkCollision(clickX, clickY, button)) {
        this.fireWeapon();
    }
});

// Prevent context menu on right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
```

#### Touch Input

```javascript
document.addEventListener('touchmove', (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    this.player.x = touchX;
    this.player.y = touchY;
});

document.addEventListener('touchend', (e) => {
    this.player.firing = false;
});
```

### 7. Collision Detection

#### Circle-to-Circle Collision

```javascript
function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.hypot(dx, dy);
    return distance < obj1.radius + obj2.radius;
}
```

#### Rectangle-to-Rectangle (AABB)

```javascript
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
```

#### Circle-to-Rectangle

```javascript
function checkCollision(circle, rect) {
    const nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const dx = circle.x - nearestX;
    const dy = circle.y - nearestY;

    return dx * dx + dy * dy < circle.radius * circle.radius;
}
```

#### Grid-Based Collision

```javascript
function checkCollision(gridX, gridY) {
    const tile = this.getTile(gridX, gridY);
    return tile !== null && tile.solid === true;
}
```

#### Optimization: Spatial Partitioning

For games with many entities, use spatial partitioning:

```javascript
class SpatialGrid {
    constructor(width, height, cellSize) {
        this.grid = new Map();
        this.cellSize = cellSize;
    }

    insert(entity) {
        const key = this.getCellKey(entity.x, entity.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(entity);
    }

    getNearby(x, y) {
        const nearby = [];
        const cells = this.getNearbyKeys(x, y);
        for (let key of cells) {
            if (this.grid.has(key)) {
                nearby.push(...this.grid.get(key));
            }
        }
        return nearby;
    }

    getCellKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    getNearbyKeys(x, y) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        const keys = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                keys.push(`${cx + dx},${cy + dy}`);
            }
        }
        return keys;
    }

    clear() {
        this.grid.clear();
    }
}
```

### 8. Visual Rendering

#### Drawing Shapes

```javascript
// Circle
this.ctx.fillStyle = '#ff0000';
this.ctx.beginPath();
this.ctx.arc(x, y, radius, 0, Math.PI * 2);
this.ctx.fill();

// Rectangle
this.ctx.fillStyle = '#00ff00';
this.ctx.fillRect(x, y, width, height);

// Line
this.ctx.strokeStyle = '#0000ff';
this.ctx.lineWidth = 2;
this.ctx.beginPath();
this.ctx.moveTo(x1, y1);
this.ctx.lineTo(x2, y2);
this.ctx.stroke();

// Text
this.ctx.fillStyle = '#ffffff';
this.ctx.font = 'bold 24px monospace';
this.ctx.fillText('Score: 1000', 10, 30);
```

#### Gradients

```javascript
// Linear gradient
const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
grad.addColorStop(0, '#0a0a1a');
grad.addColorStop(1, '#1a1a3e');
this.ctx.fillStyle = grad;
this.ctx.fillRect(0, 0, this.width, this.height);

// Radial gradient
const grad = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
grad.addColorStop(0, '#ffff00');
grad.addColorStop(1, '#ff8800');
this.ctx.fillStyle = grad;
this.ctx.fillRect(0, 0, this.width, this.height);
```

#### Layering

Render in order: background → entities → UI

```javascript
draw() {
    // Clear and background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw background elements
    this.drawBackground();

    // Draw game entities
    for (let entity of this.entities) {
        this.ctx.fillStyle = entity.color;
        this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
    }

    // Draw UI
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 16px monospace';
    this.ctx.fillText(`Score: ${this.score}`, 10, 25);
}
```

#### Transformations

```javascript
// Rotation
this.ctx.save();
this.ctx.translate(entity.x, entity.y);
this.ctx.rotate(entity.rotation);
this.ctx.fillStyle = entity.color;
this.ctx.fillRect(-entity.width/2, -entity.height/2, entity.width, entity.height);
this.ctx.restore();

// Scale
this.ctx.scale(1.5, 1.5);

// Opacity
this.ctx.globalAlpha = 0.5;
this.ctx.fillRect(0, 0, 100, 100);
this.ctx.globalAlpha = 1;
```

### 9. Audio System

#### Basic Sound Playback

```javascript
function playSound(frequency = 440, duration = 100, volume = 0.3) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        const endTime = now + duration / 1000;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, endTime);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now);
        osc.stop(endTime);
    } catch (e) {
        console.warn('Audio not available');
    }
}
```

#### Common Frequencies

- A: 440 Hz
- B: 494 Hz
- C: 262 Hz
- D: 294 Hz
- E: 330 Hz
- F: 349 Hz
- G: 392 Hz

#### Game Sounds

```javascript
// Success sound
playSound(800, 150);
playSound(1200, 150, 150);

// Failure sound
playSound(200, 200);
playSound(150, 200, 100);

// Coin sound
playSound(1000, 100);
playSound(1500, 100, 50);

// Jump sound
playSound(400, 100);
```

### 10. State Management

Manage game states with a simple state machine:

```javascript
const game = {
    state: 'MENU', // MENU, PLAYING, PAUSED, GAME_OVER

    update() {
        switch (this.state) {
            case 'MENU':
                this.updateMenu();
                break;
            case 'PLAYING':
                this.updateGame();
                break;
            case 'PAUSED':
                this.updatePaused();
                break;
            case 'GAME_OVER':
                this.updateGameOver();
                break;
        }
    },

    transitionState(newState) {
        console.log(`Transitioning from ${this.state} to ${newState}`);
        this.state = newState;
    },

    updateMenu() {
        // Handle menu input
        if (keys['enter']) {
            this.transitionState('PLAYING');
        }
    },

    updateGame() {
        // Game logic
        if (this.lives <= 0) {
            this.transitionState('GAME_OVER');
        }
    }
};
```

### 11. Performance Optimization

#### Memory Management

```javascript
// Remove dead entities
for (let i = this.entities.length - 1; i >= 0; i--) {
    if (this.entities[i].dead) {
        this.entities.splice(i, 1);
    }
}

// Limit entity count
if (this.particles.length > MAX_PARTICLES) {
    this.particles.splice(0, 1); // Remove oldest
}

// Object pooling for frequent creation/destruction
class ObjectPool {
    constructor(creator, size) {
        this.available = [];
        this.inUse = [];
        for (let i = 0; i < size; i++) {
            this.available.push(creator());
        }
    }

    get() {
        if (this.available.length > 0) {
            return this.available.pop();
        }
        return null;
    }

    release(obj) {
        this.available.push(obj);
    }
}
```

#### Rendering Optimization

```javascript
// Avoid unnecessary redraws
if (!this.dirty) return;

// Batch operations
this.ctx.globalAlpha = 0.5;
for (let particle of this.particles) {
    // Draw all particles with same alpha
}
this.ctx.globalAlpha = 1;

// Use layering to minimize full redraws
// Only redraw changed regions
```

#### Algorithm Optimization

```javascript
// Use spatial partitioning for collision checks
const nearby = this.spatialGrid.getNearby(entity.x, entity.y);
for (let other of nearby) {
    if (this.checkCollision(entity, other)) {
        // Handle collision
    }
}

// Avoid expensive operations in update loop
// Pre-calculate values when possible
```

### 12. Debugging & Testing

#### Console Output

```javascript
update() {
    if (DEBUG) {
        console.log(`Player: (${this.player.x}, ${this.player.y})`);
        console.log(`Velocity: (${this.player.vx}, ${this.player.vy})`);
        console.log(`FPS: ${1000 / deltaTime}`);
    }
}
```

#### Visual Debugging

```javascript
draw() {
    // ... normal drawing ...

    if (DEBUG) {
        // Draw collision boxes
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        for (let entity of this.entities) {
            this.ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
        }

        // Draw grid
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        for (let x = 0; x < this.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
    }
}
```

#### Testing

```javascript
// Unit tests for game logic
function testCollision() {
    const obj1 = { x: 0, y: 0, radius: 10 };
    const obj2 = { x: 15, y: 0, radius: 10 };
    console.assert(game.checkCollision(obj1, obj2), 'Collision should be detected');
}

// Integration tests
function testGameFlow() {
    game.init();
    game.update();
    game.draw();
    console.assert(game.gameRunning === true, 'Game should be running');
}
```

### 13. Game Examples

See individual game source files in the `games/` directory for complete examples.

Popular starting points:
- **Simple**: Memory, Simon (minimal state)
- **Physics**: Flappy, Marble Run (gravity/velocity)
- **Collision**: Pong, Breakout (collision detection)
- **Complex**: Pacman, Tetris (advanced mechanics)

### 14. API Reference

#### Canvas Methods

- `getContext('2d')`: Get 2D rendering context
- `fillRect(x, y, w, h)`: Draw filled rectangle
- `strokeRect(x, y, w, h)`: Draw rectangle outline
- `fillText(text, x, y)`: Draw text
- `arc(x, y, r, start, end)`: Draw arc/circle
- `beginPath()`: Begin path
- `moveTo(x, y)`: Move to point
- `lineTo(x, y)`: Line to point
- `stroke()`: Stroke path
- `fill()`: Fill path
- `save()`: Save context state
- `restore()`: Restore context state
- `translate(x, y)`: Translate origin
- `rotate(angle)`: Rotate
- `scale(x, y)`: Scale

#### Math Functions

- `Math.hypot(dx, dy)`: Distance
- `Math.atan2(dy, dx)`: Angle
- `Math.cos(angle)`: Cosine
- `Math.sin(angle)`: Sine
- `Math.random()`: Random 0-1
- `Math.floor()`: Round down
- `Math.max()`: Maximum
- `Math.min()`: Minimum

#### DOM Methods

- `document.getElementById(id)`: Get element
- `addEventListener(event, callback)`: Listen to event
- `localStorage.getItem(key)`: Get stored data
- `localStorage.setItem(key, value)`: Store data
- `requestAnimationFrame(callback)`: Schedule next frame

---

**Document Version**: 1.0
**Last Updated**: 2026-03-31

For questions or clarifications, refer to existing game source code for practical examples.
