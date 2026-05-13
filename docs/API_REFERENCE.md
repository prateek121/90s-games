# 90s Games - Complete API Reference

## Comprehensive Reference for Game Development Functions and Methods

This document provides detailed API documentation for all available functions, methods, and utilities in the 90s Games collection.

### Table of Contents

1. Canvas API
2. Game Object Methods
3. Input Handling
4. Physics & Math Utilities
5. Collision Detection
6. Audio Functions
7. Storage Functions
8. String Functions
9. Time Functions
10. Array Functions
11. DOM Methods
12. Graphics Functions
13. Event Types
14. Error Handling

### 1. Canvas API

#### getContext(contextType)

Gets the 2D rendering context from a canvas element.

```javascript
const ctx = canvas.getContext('2d');
```

**Parameters:**
- `contextType` (string): "2d" for 2D canvas

**Returns:**
- `CanvasRenderingContext2D`: The 2D rendering context

**Example:**
```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
```

#### Canvas Drawing Methods

**fillStyle (property)**

Sets the color, gradient, or pattern for filled shapes.

```javascript
ctx.fillStyle = '#ff0000';  // Hex color
ctx.fillStyle = 'rgb(255, 0, 0)';  // RGB
ctx.fillStyle = 'hsl(0, 100%, 50%)';  // HSL
```

**strokeStyle (property)**

Sets the color for strokes/outlines.

```javascript
ctx.strokeStyle = '#00ff00';
ctx.lineWidth = 2;
```

**fillRect(x, y, width, height)**

Draws a filled rectangle.

```javascript
ctx.fillStyle = '#0000ff';
ctx.fillRect(50, 50, 100, 100);
```

**Parameters:**
- `x` (number): X coordinate of top-left corner
- `y` (number): Y coordinate of top-left corner
- `width` (number): Width in pixels
- `height` (number): Height in pixels

**clearRect(x, y, width, height)**

Clears a rectangular area (makes transparent).

```javascript
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

**strokeRect(x, y, width, height)**

Draws a rectangle outline.

```javascript
ctx.strokeStyle = '#ffff00';
ctx.lineWidth = 2;
ctx.strokeRect(50, 50, 100, 100);
```

**fillText(text, x, y)**

Draws filled text.

```javascript
ctx.font = 'bold 24px monospace';
ctx.fillStyle = '#ffffff';
ctx.fillText('Score: 1000', 10, 30);
```

**Parameters:**
- `text` (string): Text to draw
- `x` (number): X position
- `y` (number): Y position

**strokeText(text, x, y)**

Draws text outline.

```javascript
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.strokeText('Game Over', 50, 100);
```

**beginPath()**

Starts a new path.

```javascript
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(100, 100);
ctx.stroke();
```

**moveTo(x, y)**

Moves the drawing position to coordinates.

```javascript
ctx.moveTo(50, 50);
```

**lineTo(x, y)**

Draws a line to the specified coordinates.

```javascript
ctx.lineTo(150, 150);
```

**arc(x, y, radius, startAngle, endAngle, anticlockwise)**

Draws an arc or circle.

```javascript
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fill();
```

**Parameters:**
- `x` (number): Center X
- `y` (number): Center Y
- `radius` (number): Radius in pixels
- `startAngle` (number): Start angle in radians
- `endAngle` (number): End angle in radians
- `anticlockwise` (boolean): Direction (optional)

**quadraticCurveTo(cpx, cpy, x, y)**

Draws a quadratic bezier curve.

```javascript
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.quadraticCurveTo(50, 100, 100, 0);
ctx.stroke();
```

**bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)**

Draws a cubic bezier curve.

```javascript
ctx.bezierCurveTo(0, 50, 100, 50, 100, 0);
```

**fill()**

Fills the current path with the fillStyle color.

```javascript
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fill();
```

**stroke()**

Strokes the current path with the strokeStyle color.

```javascript
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(100, 100);
ctx.stroke();
```

**closePath()**

Closes the current path.

```javascript
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(100, 50);
ctx.lineTo(75, 100);
ctx.closePath();
ctx.fill();
```

**clip()**

Creates a clipping region from the current path.

```javascript
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.clip();
```

#### Transformation Methods

**translate(x, y)**

Moves the origin to the specified coordinates.

```javascript
ctx.translate(100, 100);
ctx.fillRect(-50, -50, 100, 100);
```

**rotate(angle)**

Rotates around the current origin.

```javascript
ctx.rotate(Math.PI / 4);  // 45 degrees
```

**scale(x, y)**

Scales the canvas.

```javascript
ctx.scale(2, 2);  // Double size
```

**transform(a, b, c, d, e, f)**

Applies a transformation matrix.

```javascript
ctx.transform(1, 0, 0, 1, 50, 50);
```

**setTransform(a, b, c, d, e, f)**

Sets transformation matrix (replacing current).

```javascript
ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset
```

**save()**

Saves the current context state.

```javascript
ctx.save();
ctx.fillStyle = '#ff0000';
ctx.fillRect(0, 0, 100, 100);
ctx.restore();
ctx.fillRect(100, 100, 100, 100);  // Uses previous fillStyle
```

**restore()**

Restores the last saved context state.

```javascript
ctx.restore();
```

#### Text Methods

**font (property)**

Sets the font specification.

```javascript
ctx.font = 'bold 24px monospace';
ctx.font = '12px Arial';
ctx.font = 'italic 16px serif';
```

**textAlign (property)**

Sets text horizontal alignment.

```javascript
ctx.textAlign = 'left';      // default
ctx.textAlign = 'center';
ctx.textAlign = 'right';
ctx.textAlign = 'start';
ctx.textAlign = 'end';
```

**textBaseline (property)**

Sets text vertical alignment.

```javascript
ctx.textBaseline = 'top';
ctx.textBaseline = 'middle';
ctx.textBaseline = 'bottom';
ctx.textBaseline = 'hanging';
ctx.textBaseline = 'alphabetic';
ctx.textBaseline = 'ideographic';
```

**measureText(text)**

Returns text measurement object.

```javascript
const metrics = ctx.measureText('Score: 1000');
console.log(metrics.width);  // Text width in pixels
```

#### Gradient & Pattern Methods

**createLinearGradient(x1, y1, x2, y2)**

Creates a linear gradient.

```javascript
const grad = ctx.createLinearGradient(0, 0, 100, 100);
grad.addColorStop(0, '#ff0000');
grad.addColorStop(0.5, '#00ff00');
grad.addColorStop(1, '#0000ff');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 100, 100);
```

**createRadialGradient(x1, y1, r1, x2, y2, r2)**

Creates a radial gradient.

```javascript
const grad = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
grad.addColorStop(0, '#ffff00');
grad.addColorStop(1, '#ff0000');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 200, 200);
```

**addColorStop(offset, color)**

Adds a color stop to a gradient.

```javascript
grad.addColorStop(0, '#ffffff');
grad.addColorStop(1, '#000000');
```

**createPattern(image, repetition)**

Creates a pattern from an image.

```javascript
const img = new Image();
img.src = 'pattern.png';
const pattern = ctx.createPattern(img, 'repeat');
ctx.fillStyle = pattern;
ctx.fillRect(0, 0, 200, 200);
```

#### Global Properties

**globalAlpha (property)**

Sets transparency (0 = transparent, 1 = opaque).

```javascript
ctx.globalAlpha = 0.5;
ctx.fillRect(0, 0, 100, 100);  // Semi-transparent
ctx.globalAlpha = 1;  // Reset
```

**globalCompositeOperation (property)**

Sets how to composite shapes.

```javascript
ctx.globalCompositeOperation = 'source-over';  // default
ctx.globalCompositeOperation = 'multiply';
ctx.globalCompositeOperation = 'screen';
```

**shadowColor (property)**

Sets shadow color.

```javascript
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
```

**shadowBlur, shadowOffsetX, shadowOffsetY (properties)**

Sets shadow properties.

```javascript
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
```

### 2. Game Object Methods

Standard methods implemented in game objects:

**init()**

Initialize the game.

```javascript
game.init();
```

Called once when game loads. Sets up canvas, state, and starts loop.

**update()**

Update game state.

```javascript
game.update();
```

Called every frame. Handle physics, collisions, input.

**draw()**

Render graphics.

```javascript
game.draw();
```

Called every frame. Render all visual elements.

**setupInput()**

Setup input handlers.

```javascript
game.setupInput();
```

Register keyboard, mouse, touch event listeners.

**gameLoop()**

Main game loop.

```javascript
game.gameLoop();
```

Update, draw, and schedule next frame.

**start()**

Start game.

```javascript
game.start();
```

Transition from menu to playing state.

**pause()**

Pause game.

```javascript
game.pause();
```

Stop updates, keep rendering.

**restart()**

Reset game state.

```javascript
game.restart();
```

Clear entities and reset variables.

### 3. Input Handling

#### Keyboard Events

**keydown**

Fired when key pressed.

```javascript
document.addEventListener('keydown', (e) => {
    console.log(e.key);  // 'w', 'ArrowUp', ' ', etc.
});
```

**keyup**

Fired when key released.

```javascript
document.addEventListener('keyup', (e) => {
    console.log(e.key);
});
```

**Key Properties:**
- `e.key`: Character/key name
- `e.code`: Physical key code
- `e.keyCode`: Numeric code (deprecated)
- `e.ctrlKey`: Ctrl pressed
- `e.shiftKey`: Shift pressed
- `e.altKey`: Alt pressed

**Common Keys:**
- 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight': Arrow keys
- ' ': Space bar
- 'Enter': Enter key
- 'Escape': Escape key
- 'w', 'a', 's', 'd': Letter keys
- '0'-'9': Number keys

#### Mouse Events

**mousemove**

Fired when mouse moves.

```javascript
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
});
```

**mousedown**

Fired when mouse button pressed.

```javascript
document.addEventListener('mousedown', (e) => {
    const button = e.button;  // 0=left, 1=middle, 2=right
});
```

**mouseup**

Fired when mouse button released.

```javascript
document.addEventListener('mouseup', (e) => {
    // Handle release
});
```

**click**

Fired when mouse button clicked.

```javascript
document.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
});
```

**contextmenu**

Fired for right-click.

```javascript
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();  // Prevent menu
});
```

**Mouse Position Relative to Canvas:**

```javascript
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
});
```

#### Touch Events

**touchstart**

Fired when touch begins.

```javascript
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
});
```

**touchmove**

Fired when finger moves.

```javascript
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
});
```

**touchend**

Fired when touch ends.

```javascript
document.addEventListener('touchend', (e) => {
    // Handle touch release
});
```

### 4. Physics & Math Utilities

#### Math Functions

**Math.hypot(x, y)**

Distance formula.

```javascript
const distance = Math.hypot(x2 - x1, y2 - y1);
```

**Math.atan2(y, x)**

Arctangent (angle to point).

```javascript
const angle = Math.atan2(targetY - playerY, targetX - playerX);
```

**Math.sin(angle), Math.cos(angle)**

Trigonometric functions.

```javascript
const x = Math.cos(angle) * speed;
const y = Math.sin(angle) * speed;
```

**Math.sqrt(x)**

Square root.

```javascript
const magnitude = Math.sqrt(vx * vx + vy * vy);
```

**Math.abs(x)**

Absolute value.

```javascript
const absoluteVelocity = Math.abs(velocity);
```

**Math.min(...args), Math.max(...args)**

Minimum and maximum.

```javascript
const clamped = Math.max(0, Math.min(100, value));
```

**Math.floor(x), Math.ceil(x), Math.round(x)**

Rounding functions.

```javascript
const intValue = Math.floor(floatValue);
```

**Math.random()**

Random number 0-1.

```javascript
const randomInt = Math.floor(Math.random() * 10);  // 0-9
const randomFloat = Math.random() * 100;  // 0-100
```

**Math.PI, Math.PI * 2**

Common angle constants.

```javascript
const fullCircle = Math.PI * 2;  // 2π radians = 360°
```

### 5. Collision Detection

#### Distance Calculation

```javascript
function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
```

#### Circle Collision

```javascript
function circleCollision(x1, y1, r1, x2, y2, r2) {
    const dist = getDistance(x1, y1, x2, y2);
    return dist < r1 + r2;
}
```

#### Rectangle Collision (AABB)

```javascript
function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}
```

#### Point in Rectangle

```javascript
function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw &&
           py >= ry && py <= ry + rh;
}
```

### 6. Audio Functions

#### Play Tone

```javascript
function playTone(frequency = 440, duration = 100, volume = 0.3) {
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
        // Audio not available
    }
}
```

#### Common Frequencies

- C: 262 Hz
- D: 294 Hz
- E: 330 Hz
- F: 349 Hz
- G: 392 Hz
- A: 440 Hz
- B: 494 Hz

### 7. Storage Functions

#### Save Data

```javascript
localStorage.setItem('key', 'value');
localStorage.setItem('score', '1000');
```

#### Load Data

```javascript
const value = localStorage.getItem('key');
const score = parseInt(localStorage.getItem('score')) || 0;
```

#### Save JSON

```javascript
const data = { score: 1000, level: 5 };
localStorage.setItem('gameData', JSON.stringify(data));
```

#### Load JSON

```javascript
const data = JSON.parse(localStorage.getItem('gameData'));
console.log(data.score);
```

#### Delete Data

```javascript
localStorage.removeItem('key');
```

#### Clear All

```javascript
localStorage.clear();
```

### 8. String Functions

#### Template Literals

```javascript
const name = 'Player';
const score = 1000;
const message = `${name} scored ${score} points!`;
```

#### String Methods

```javascript
const str = 'HELLO';
str.toLowerCase();      // 'hello'
str.toUpperCase();      // 'HELLO'
str.substring(0, 3);    // 'HEL'
str.charAt(0);          // 'H'
str.length;             // 5
str.includes('ELL');    // true
str.split('').reverse().join('');  // Reverse
```

### 9. Time Functions

#### setTimeout

Schedule code to run after delay.

```javascript
setTimeout(() => {
    console.log('After 1 second');
}, 1000);
```

#### setInterval

Repeat code at interval.

```javascript
const timer = setInterval(() => {
    console.log('Every 1 second');
}, 1000);

clearInterval(timer);  // Stop
```

#### requestAnimationFrame

Schedule code for next frame.

```javascript
requestAnimationFrame(() => {
    gameLoop();
});
```

#### Performance.now()

Get current time in milliseconds.

```javascript
const startTime = performance.now();
// ... do work ...
const elapsed = performance.now() - startTime;
```

### 10. Array Functions

#### Array Creation

```javascript
const arr1 = [];
const arr2 = [1, 2, 3];
const arr3 = new Array(5);
```

#### Array Methods

```javascript
arr.push(item);          // Add to end
arr.pop();               // Remove from end
arr.shift();             // Remove from start
arr.unshift(item);       // Add to start
arr.slice(start, end);   // Get portion
arr.splice(index, 1);    // Remove at index
arr.indexOf(item);       // Find index
arr.includes(item);      // Check contains
arr.length;              // Get length
arr.reverse();           // Reverse in place
arr.sort();              // Sort in place
```

#### Iteration

```javascript
arr.forEach((item, index) => {
    console.log(item);
});

arr.map(item => item * 2);
arr.filter(item => item > 5);
```

### 11. DOM Methods

#### Get Elements

```javascript
document.getElementById('elementId');
document.querySelector('.class');
document.querySelectorAll('.class');
```

#### Set Content

```javascript
element.textContent = 'New text';
element.innerHTML = '<p>New HTML</p>';
```

#### CSS Classes

```javascript
element.classList.add('class');
element.classList.remove('class');
element.classList.toggle('class');
element.classList.contains('class');
```

#### Element Properties

```javascript
element.style.color = 'red';
element.style.display = 'none';
element.hidden = true;
element.disabled = false;
```

### 12. Graphics Functions

#### Draw Circle

```javascript
function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}
```

#### Draw Rectangle

```javascript
function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
```

#### Draw Line

```javascript
function drawLine(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
```

#### Draw Text

```javascript
function drawText(ctx, text, x, y, color, font = '16px monospace') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}
```

### 13. Event Types

**Keyboard Events:**
- keydown
- keyup
- keypress (deprecated)

**Mouse Events:**
- mousedown
- mouseup
- mousemove
- click
- dblclick
- contextmenu
- wheel
- mouseover
- mouseout

**Touch Events:**
- touchstart
- touchmove
- touchend
- touchcancel

**Window Events:**
- load
- unload
- resize
- scroll
- beforeunload
- error

**Element Events:**
- click
- focus
- blur
- change
- input
- submit

### 14. Error Handling

#### Try-Catch

```javascript
try {
    riskyOperation();
} catch (error) {
    console.error('Error:', error.message);
}
```

#### Conditional Execution

```javascript
if (!audioContext) {
    console.warn('Audio not supported');
    return;
}
```

#### Fallbacks

```javascript
const context = window.AudioContext || window.webkitAudioContext;
```

---

**Document Version**: 1.0
**Last Updated**: 2026-03-31

This reference covers the most common APIs used in the 90s Games collection. For more information, consult MDN Web Docs or the source code of individual games.
