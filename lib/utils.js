/**
 * 90s Games - Utility Functions Library
 * Common utilities for all games
 */

const GameUtils = {
    // Mathematical utilities
    Math: {
        /**
         * Distance between two points
         * @param {number} x1 - First point X
         * @param {number} y1 - First point Y
         * @param {number} x2 - Second point X
         * @param {number} y2 - Second point Y
         * @returns {number} Distance between points
         */
        distance(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.hypot(dx, dy);
        },

        /**
         * Angle between two points in radians
         * @param {number} x1 - Origin X
         * @param {number} y1 - Origin Y
         * @param {number} x2 - Target X
         * @param {number} y2 - Target Y
         * @returns {number} Angle in radians
         */
        angle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        },

        /**
         * Limit value between min and max
         * @param {number} value - Value to clamp
         * @param {number} min - Minimum value
         * @param {number} max - Maximum value
         * @returns {number} Clamped value
         */
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },

        /**
         * Linear interpolation between two values
         * @param {number} a - Start value
         * @param {number} b - End value
         * @param {number} t - Interpolation factor (0-1)
         * @returns {number} Interpolated value
         */
        lerp(a, b, t) {
            return a + (b - a) * t;
        },

        /**
         * Random integer between min and max
         * @param {number} min - Minimum value (inclusive)
         * @param {number} max - Maximum value (inclusive)
         * @returns {number} Random integer
         */
        randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Random float between min and max
         * @param {number} min - Minimum value
         * @param {number} max - Maximum value
         * @returns {number} Random float
         */
        randomFloat(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Normalize angle to 0-2π range
         * @param {number} angle - Angle in radians
         * @returns {number} Normalized angle
         */
        normalizeAngle(angle) {
            while (angle < 0) angle += Math.PI * 2;
            while (angle >= Math.PI * 2) angle -= Math.PI * 2;
            return angle;
        },

        /**
         * Get shortest angular difference
         * @param {number} from - Start angle
         * @param {number} to - End angle
         * @returns {number} Angular difference
         */
        angleDifference(from, to) {
            let diff = to - from;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            return diff;
        }
    },

    // Collision detection utilities
    Collision: {
        /**
         * Circle to circle collision
         * @param {number} x1 - Circle 1 X
         * @param {number} y1 - Circle 1 Y
         * @param {number} r1 - Circle 1 radius
         * @param {number} x2 - Circle 2 X
         * @param {number} y2 - Circle 2 Y
         * @param {number} r2 - Circle 2 radius
         * @returns {boolean} Collision detected
         */
        circleToCircle(x1, y1, r1, x2, y2, r2) {
            const dist = GameUtils.Math.distance(x1, y1, x2, y2);
            return dist < r1 + r2;
        },

        /**
         * Rectangle to rectangle collision (AABB)
         * @param {Object} rect1 - Rectangle with x, y, width, height
         * @param {Object} rect2 - Rectangle with x, y, width, height
         * @returns {boolean} Collision detected
         */
        rectToRect(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        },

        /**
         * Circle to rectangle collision
         * @param {number} cx - Circle X
         * @param {number} cy - Circle Y
         * @param {number} cr - Circle radius
         * @param {Object} rect - Rectangle with x, y, width, height
         * @returns {boolean} Collision detected
         */
        circleToRect(cx, cy, cr, rect) {
            const nearestX = GameUtils.Math.clamp(cx, rect.x, rect.x + rect.width);
            const nearestY = GameUtils.Math.clamp(cy, rect.y, rect.y + rect.height);
            const dist = GameUtils.Math.distance(cx, cy, nearestX, nearestY);
            return dist < cr;
        },

        /**
         * Point in rectangle
         * @param {number} x - Point X
         * @param {number} y - Point Y
         * @param {Object} rect - Rectangle with x, y, width, height
         * @returns {boolean} Point inside rectangle
         */
        pointInRect(x, y, rect) {
            return x >= rect.x && x <= rect.x + rect.width &&
                   y >= rect.y && y <= rect.y + rect.height;
        },

        /**
         * Get collision normal between two circles
         * @param {number} x1 - Circle 1 X
         * @param {number} y1 - Circle 1 Y
         * @param {number} x2 - Circle 2 X
         * @param {number} y2 - Circle 2 Y
         * @returns {Object} Normal vector with x, y
         */
        getCollisionNormal(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.hypot(dx, dy);
            return {
                x: dist > 0 ? dx / dist : 0,
                y: dist > 0 ? dy / dist : 0
            };
        }
    },

    // Canvas rendering utilities
    Canvas: {
        /**
         * Draw circle
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - Center X
         * @param {number} y - Center Y
         * @param {number} radius - Radius
         * @param {string} color - Fill color
         * @param {string} strokeColor - Stroke color (optional)
         * @param {number} lineWidth - Line width (optional)
         */
        circle(ctx, x, y, radius, color, strokeColor = null, lineWidth = 1) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            if (strokeColor) {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }
        },

        /**
         * Draw rectangle
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} width - Width
         * @param {number} height - Height
         * @param {string} color - Fill color
         * @param {string} strokeColor - Stroke color (optional)
         * @param {number} lineWidth - Line width (optional)
         */
        rect(ctx, x, y, width, height, color, strokeColor = null, lineWidth = 1) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);

            if (strokeColor) {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
                ctx.strokeRect(x, y, width, height);
            }
        },

        /**
         * Draw line
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x1 - Start X
         * @param {number} y1 - Start Y
         * @param {number} x2 - End X
         * @param {number} y2 - End Y
         * @param {string} color - Line color
         * @param {number} width - Line width
         */
        line(ctx, x1, y1, x2, y2, color, width = 1) {
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        },

        /**
         * Draw text
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {string} text - Text to draw
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {string} color - Text color
         * @param {string} font - Font specification
         * @param {string} align - Text alignment (default: 'left')
         */
        text(ctx, text, x, y, color, font = '14px monospace', align = 'left') {
            ctx.fillStyle = color;
            ctx.font = font;
            ctx.textAlign = align;
            ctx.fillText(text, x, y);
            ctx.textAlign = 'left'; // Reset
        },

        /**
         * Draw gradient
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x1 - Start X
         * @param {number} y1 - Start Y
         * @param {number} x2 - End X
         * @param {number} y2 - End Y
         * @returns {CanvasGradient} Gradient object
         */
        linearGradient(ctx, x1, y1, x2, y2) {
            return ctx.createLinearGradient(x1, y1, x2, y2);
        },

        /**
         * Draw sprite with rotation
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {number} width - Width
         * @param {number} height - Height
         * @param {number} rotation - Rotation in radians
         * @param {string} color - Fill color
         */
        rotatedRect(ctx, x, y, width, height, rotation, color) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillStyle = color;
            ctx.fillRect(-width / 2, -height / 2, width, height);
            ctx.restore();
        }
    },

    // Audio utilities
    Audio: {
        audioContext: null,

        /**
         * Initialize audio context
         */
        init() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
            } catch (e) {
                console.warn('Audio context not available');
            }
        },

        /**
         * Play beep sound
         * @param {number} frequency - Frequency in Hz
         * @param {number} duration - Duration in milliseconds
         * @param {number} volume - Volume 0-1
         * @param {string} waveform - 'sine', 'square', 'sawtooth', 'triangle'
         */
        beep(frequency = 440, duration = 100, volume = 0.3, waveform = 'sine') {
            if (!this.audioContext) return;

            const now = this.audioContext.currentTime;
            const endTime = now + duration / 1000;

            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = waveform;
            osc.frequency.value = frequency;
            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.01, endTime);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.start(now);
            osc.stop(endTime);
        },

        /**
         * Play success sound
         */
        success() {
            this.beep(800, 150, 0.3);
            this.beep(1200, 150, 0.3, 150);
        },

        /**
         * Play failure sound
         */
        failure() {
            this.beep(300, 200, 0.3);
            this.beep(200, 200, 0.3, 100);
        }
    },

    // Storage utilities
    Storage: {
        /**
         * Save high score
         * @param {string} gameName - Game identifier
         * @param {number} score - Score value
         */
        saveScore(gameName, score) {
            const key = `${gameName}Best`;
            const current = parseInt(localStorage.getItem(key)) || 0;
            if (score > current) {
                localStorage.setItem(key, score);
            }
        },

        /**
         * Get high score
         * @param {string} gameName - Game identifier
         * @returns {number} Best score
         */
        getScore(gameName) {
            const key = `${gameName}Best`;
            return parseInt(localStorage.getItem(key)) || 0;
        },

        /**
         * Clear game data
         * @param {string} gameName - Game identifier
         */
        clear(gameName) {
            const key = `${gameName}Best`;
            localStorage.removeItem(key);
        },

        /**
         * Save game data (JSON)
         * @param {string} key - Storage key
         * @param {Object} data - Data to save
         */
        saveData(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },

        /**
         * Load game data
         * @param {string} key - Storage key
         * @returns {Object|null} Loaded data or null
         */
        loadData(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }
    },

    // Array and collection utilities
    Collections: {
        /**
         * Shuffle array in place
         * @param {Array} array - Array to shuffle
         * @returns {Array} Shuffled array
         */
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        /**
         * Remove element from array
         * @param {Array} array - Array
         * @param {*} element - Element to remove
         * @returns {Array} Modified array
         */
        remove(array, element) {
            const index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        },

        /**
         * Remove by condition
         * @param {Array} array - Array
         * @param {Function} condition - Condition function
         * @returns {Array} Filtered array
         */
        removeIf(array, condition) {
            for (let i = array.length - 1; i >= 0; i--) {
                if (condition(array[i])) {
                    array.splice(i, 1);
                }
            }
            return array;
        },

        /**
         * Get random element
         * @param {Array} array - Array
         * @returns {*} Random element
         */
        random(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        /**
         * Group array by key
         * @param {Array} array - Array of objects
         * @param {string} key - Property to group by
         * @returns {Object} Grouped object
         */
        groupBy(array, key) {
            return array.reduce((result, item) => {
                (result[item[key]] = result[item[key]] || []).push(item);
                return result;
            }, {});
        }
    },

    // Time utilities
    Time: {
        /**
         * Format milliseconds to MM:SS
         * @param {number} ms - Milliseconds
         * @returns {string} Formatted time
         */
        format(ms) {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / 60000) % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },

        /**
         * Debounce function
         * @param {Function} func - Function to debounce
         * @param {number} wait - Wait time in ms
         * @returns {Function} Debounced function
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in ms
         * @returns {Function} Throttled function
         */
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
};

// Initialize utilities
GameUtils.Audio.init();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUtils;
}
