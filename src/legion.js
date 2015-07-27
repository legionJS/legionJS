'use strict';
/* jshint browser: true */

/**
 * @module legion
 */

// Check if running on node.js
var isNode = false;
if (typeof module !== 'undefined' && module.exports) {
  isNode = true;
}

// If on browser create a "global" variable which points to window
// and can be referenced instead of window for consistency.
if (!isNode) {
  window.global = window;
}

/**
 * legion global object
 * @exports legion
 */
global.legion = {
  /**
   * Whether the game is executing within node.js or not.
   * @type {Boolean}
   */
  isNode: isNode,

  /**
   * The graphics renderer.  Gets set by PIXI.autoDetectRenderer.
   * On the server it is null.
   * @type {PIXI.Renderer}
   * @default null
   * @private
   */
  _renderer: null,

  /**
   * A map of all Classes that have been loaded by the game with their
   * 'className' as the key.
   *
   * @example
   * // Create a new Entity
   * var e = new legion._classes['Entity']();
   *
   * @type {Object}
   * @private
   * @default {}
   */
  _classes: {},

  /**
   * Whether debug mode is on.
   * @type {Boolean}
   * @default false
   */
  debug: false,

  /**
   * The locale code for internationalization and localization.
   * @type {String}
   * @default 'en'
   */
  locale: 'en',

  /**
   * Initialize legion core.
   *
   * @param  {number} w - Width of the game in pixels
   * @param  {number} h - Height of the game in pixels
   * @return {undefined}
   */
  init: function(w, h) {
    if (!isNode) {
      this._renderer = PIXI.autoDetectRenderer(w, h);
      document.body.appendChild(this._renderer.view);
    }
  },


  /**
   * Log a message to console when debugging is on.
   *
   * @param  {string} message - The message to log
   * @return {undefined}
   */
  log: function(message) {
    if (this.debug) {
      console.log(message);
    }
  }
};

// If on node, just return legion, else first include PIXI
if (isNode) {
  define([], function() {
    return global.legion;
  });
} else {
  define(['pixi'], function(pixi) {
    global.PIXI = pixi;
    return global.legion;
  });
}
