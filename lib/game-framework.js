/**
 * 90s Games Framework
 * A lightweight framework for building 2D browser-based games
 * Features: Physics, Collision Detection, Input Handling, Particle Systems, Sound
 */

class GameFramework {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.deltaTime = 0;
        this.lastFrameTime = 0;
        this.running = false;
        this.paused = false;

        // Entity management
        this.entities = [];
        this.spatialGrid = new Map();
        this.gridSize = 50;

        // Input handling
        this.keys = {};
        this.mousePos = { x: 0, y: 0 };
        this.touchPos = { x: 0, y: 0 };

        // Physics
        this.gravity = 0.5;
        this.friction = 0.95;

        // Rendering
        this.layers = new Map();
        this.particleSystems = [];

        this.setupInput();
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.touchPos.x = e.touches[0].clientX - rect.left;
                this.touchPos.y = e.touches[0].clientY - rect.top;
            }
        });
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.updateSpatialGrid(entity);
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    updateSpatialGrid(entity) {
        if (!entity.x || !entity.y) return;
        const gridKey = `${Math.floor(entity.x / this.gridSize)},${Math.floor(entity.y / this.gridSize)}`;
        if (!this.spatialGrid.has(gridKey)) {
            this.spatialGrid.set(gridKey, []);
        }
        this.spatialGrid.get(gridKey).push(entity);
    }

    getNearbyEntities(x, y, radius) {
        const nearby = [];
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const gridKey = `${gridX + dx},${gridY + dy}`;
                const cellEntities = this.spatialGrid.get(gridKey) || [];
                nearby.push(...cellEntities);
            }
        }

        return nearby.filter(e => {
            const dist = Math.hypot(e.x - x, e.y - y);
            return dist < radius;
        });
    }

    start() {
        this.running = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    gameLoop() {
        const now = performance.now();
        this.deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        if (!this.paused) {
            this.update();
        }
        this.draw();

        if (this.running) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        // Update all entities
        for (let entity of this.entities) {
            if (entity.update) {
                entity.update(this.deltaTime);
            }

            // Apply gravity if applicable
            if (entity.affectedByGravity && entity.vy !== undefined) {
                entity.vy += this.gravity;
            }

            // Apply friction
            if (entity.vx !== undefined) {
                entity.vx *= this.friction;
            }
        }

        // Update particle systems
        for (let system of this.particleSystems) {
            system.update(this.deltaTime);
        }

        // Clear spatial grid for next frame
        this.spatialGrid.clear();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw entities
        for (let entity of this.entities) {
            if (entity.draw) {
                entity.draw(this.ctx);
            }
        }

        // Draw particle systems
        for (let system of this.particleSystems) {
            system.draw(this.ctx);
        }
    }

    checkCollision(entity1, entity2) {
        if (!entity1.x || !entity2.x) return false;

        const dx = entity1.x - entity2.x;
        const dy = entity1.y - entity2.y;
        const dist = Math.hypot(dx, dy);

        const r1 = entity1.radius || entity1.width / 2;
        const r2 = entity2.radius || entity2.width / 2;

        return dist < r1 + r2;
    }

    collisionResponse(entity1, entity2) {
        const dx = entity2.x - entity1.x;
        const dy = entity2.y - entity1.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return;

        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Swap velocities in collision direction
        const vx1 = entity1.vx || 0;
        const vy1 = entity1.vy || 0;
        const vx2 = entity2.vx || 0;
        const vy2 = entity2.vy || 0;

        entity1.vx = vx2 * cos + vy2 * sin;
        entity1.vy = vy2 * cos - vx2 * sin;
        entity2.vx = vx1 * cos + vy1 * sin;
        entity2.vy = vy1 * cos - vx1 * sin;
    }

    createParticleSystem(x, y, particleCount = 10) {
        return new ParticleSystem(this, x, y, particleCount);
    }

    playSound(frequency = 440, duration = 100, volume = 0.3) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.frequency.value = frequency;
            gain.gain.setValueAtTime(volume, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            // Audio context not available
        }
    }

    stop() {
        this.running = false;
    }
}

class ParticleSystem {
    constructor(game, x, y, particleCount = 10) {
        this.game = game;
        this.particles = [];
        this.x = x;
        this.y = y;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }

        game.particleSystems.push(this);
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life -= deltaTime;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length === 0) {
            const index = this.game.particleSystems.indexOf(this);
            if (index > -1) {
                this.game.particleSystems.splice(index, 1);
            }
        }
    }

    draw(ctx) {
        for (let p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillRect(p.x, p.y, 4, 4);
        }
        ctx.globalAlpha = 1;
    }
}

class PhysicsBody {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.mass = 1;
        this.affectedByGravity = true;
        this.bouncy = 0.8;
    }

    applyForce(fx, fy) {
        this.vx += fx / this.mass;
        this.vy += fy / this.mass;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Sprite {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class AnimatedSprite extends Sprite {
    constructor(x, y, width, height, frames, frameRate = 10) {
        super(x, y, width, height, '#fff');
        this.frames = frames;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameCounter = 0;
    }

    update() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameRate) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.frames[this.currentFrame];
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Export for use in HTML games
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameFramework, ParticleSystem, PhysicsBody, Sprite, AnimatedSprite };
}
