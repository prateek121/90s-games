/**
 * a11y.js — vanilla JS accessibility helpers for canvas-based games.
 *
 * Exposes a small set of utilities to make canvas games friendlier to
 * keyboard users, screen readers, and players with reduced-motion or
 * color-vision needs. No external dependencies.
 *
 * Attach as a classic script (window.A11y) or import the named exports
 * from a module bundler.
 */
(function (root) {
  'use strict';

  /** @type {{[mode: string]: string}} CSS filter matrices approximating
   *  common color-vision deficiencies. Values are widely cited LMS-based
   *  approximations and are intentionally cheap (no SVG filters). */
  var COLORBLIND_FILTERS = {
    none: '',
    protanopia:
      'url("data:image/svg+xml;utf8,' +
      '<svg xmlns=\'http://www.w3.org/2000/svg\'>' +
      '<filter id=\'p\'><feColorMatrix type=\'matrix\' values=\'' +
      '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0\'/>' +
      '</filter></svg>#p")',
    deuteranopia:
      'url("data:image/svg+xml;utf8,' +
      '<svg xmlns=\'http://www.w3.org/2000/svg\'>' +
      '<filter id=\'d\'><feColorMatrix type=\'matrix\' values=\'' +
      '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0\'/>' +
      '</filter></svg>#d")',
    tritanopia:
      'url("data:image/svg+xml;utf8,' +
      '<svg xmlns=\'http://www.w3.org/2000/svg\'>' +
      '<filter id=\'t\'><feColorMatrix type=\'matrix\' values=\'' +
      '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0\'/>' +
      '</filter></svg>#t")'
  };

  /** @type {{[key: string]: string}} Map of raw key values to handler names. */
  var KEY_MAP = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    W: 'up', S: 'down', A: 'left', D: 'right',
    ' ': 'space', Spacebar: 'space',
    Enter: 'enter', Escape: 'escape', Esc: 'escape'
  };

  /**
   * Attach keyboard listeners to a canvas with sane defaults.
   * @param {HTMLCanvasElement} canvas Canvas (made focusable via tabindex).
   * @param {{up?:Function,down?:Function,left?:Function,right?:Function,
   *          space?:Function,enter?:Function,escape?:Function,
   *          keydown?:Function,keyup?:Function}} handlers Optional callbacks.
   * @returns {Function} release() to detach all listeners.
   */
  function enableKeyboardNav(canvas, handlers) {
    if (!canvas) throw new Error('a11y.enableKeyboardNav: canvas required');
    handlers = handlers || {};
    if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0');
    if (!canvas.getAttribute('role')) canvas.setAttribute('role', 'application');

    function onDown(e) {
      var name = KEY_MAP[e.key];
      if (name && typeof handlers[name] === 'function') {
        handlers[name](e);
        if (name !== 'enter' && name !== 'escape') e.preventDefault();
      }
      if (typeof handlers.keydown === 'function') handlers.keydown(e);
    }
    function onUp(e) {
      if (typeof handlers.keyup === 'function') handlers.keyup(e);
    }
    canvas.addEventListener('keydown', onDown);
    canvas.addEventListener('keyup', onUp);
    return function release() {
      canvas.removeEventListener('keydown', onDown);
      canvas.removeEventListener('keyup', onUp);
    };
  }

  /**
   * Returns true if the user has requested reduced motion.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    try {
      return !!(root.matchMedia &&
        root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  /**
   * Apply a colorblind-simulation CSS filter to a canvas (or any element).
   * @param {HTMLElement} target Element to filter.
   * @param {'protanopia'|'deuteranopia'|'tritanopia'|'none'} mode Mode key.
   */
  function setColorblindMode(target, mode) {
    if (!target) return;
    var filter = COLORBLIND_FILTERS[mode];
    if (filter === undefined) filter = '';
    target.style.filter = filter;
  }

  /** Lazily-created singleton aria-live region used by announce(). */
  var liveRegion = null;
  function getLiveRegion() {
    if (liveRegion && liveRegion.isConnected) return liveRegion;
    var el = document.createElement('div');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.setAttribute('role', 'status');
    el.style.cssText =
      'position:absolute;left:-10000px;top:auto;width:1px;height:1px;' +
      'overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;';
    el.id = 'a11y-live-region';
    document.body.appendChild(el);
    liveRegion = el;
    return el;
  }

  /**
   * Announce text to assistive tech via an off-screen aria-live region.
   * @param {string} text Message to announce.
   */
  function announce(text) {
    if (!text) return;
    var region = getLiveRegion();
    // Clearing first forces SRs to re-read identical messages.
    region.textContent = '';
    root.setTimeout(function () { region.textContent = String(text); }, 30);
  }

  var FOCUSABLE =
    'a[href],area[href],input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),button:not([disabled]),iframe,object,embed,' +
    '[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

  /**
   * Trap Tab focus inside an element until the returned release() is called.
   * @param {HTMLElement} element Container to trap focus within.
   * @returns {Function} release() to remove the trap.
   */
  function focusTrap(element) {
    if (!element) throw new Error('a11y.focusTrap: element required');
    var previouslyFocused = document.activeElement;

    function getFocusable() {
      return Array.prototype.slice
        .call(element.querySelectorAll(FOCUSABLE))
        .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
    }

    function onKey(e) {
      if (e.key !== 'Tab') return;
      var nodes = getFocusable();
      if (nodes.length === 0) { e.preventDefault(); element.focus(); return; }
      var first = nodes[0], last = nodes[nodes.length - 1];
      var active = document.activeElement;
      if (e.shiftKey && (active === first || !element.contains(active))) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && (active === last || !element.contains(active))) {
        first.focus(); e.preventDefault();
      }
    }

    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.addEventListener('keydown', onKey);
    var initial = getFocusable()[0] || element;
    try { initial.focus(); } catch (_) {}

    return function release() {
      element.removeEventListener('keydown', onKey);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        try { previouslyFocused.focus(); } catch (_) {}
      }
    };
  }

  var api = {
    enableKeyboardNav: enableKeyboardNav,
    prefersReducedMotion: prefersReducedMotion,
    setColorblindMode: setColorblindMode,
    announce: announce,
    focusTrap: focusTrap
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  root.A11y = api;
})(typeof window !== 'undefined' ? window : globalThis);
