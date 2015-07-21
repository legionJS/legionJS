'use strict';
/* jshint browser: true */

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

// Create legion global
global.legion = {
  isNode: isNode,
  renderer: null,
  classes: {},

  init: function(w, h) {
    if (!isNode) {
      this.renderer = PIXI.autoDetectRenderer(w, h);
      document.body.appendChild(this.renderer.view);
    }
  },

  debug: true,
  locale: 'en',
  // TODO - implement proper logging.
  log: function(message) {
    if (this.debug) {
      console.log(message);
    }
  }
};

// If on node, just return legion, else first include PIXI
if (isNode) {
  define([], function() {
    global.legion.syncDirection = 'down';
    return global.legion;
  });
} else {
  define(['pixi'], function(pixi) {
    global.legion.syncDirection = 'up';
    global.PIXI = pixi;

    return global.legion;
  });
}
