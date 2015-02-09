// Check if running on node.js
var isNode = false;

if (typeof module !== 'undefined' && module.exports) {
  isNode = true;
}

// Create legion global
legion = {
  isNode: isNode,
  renderer: null,

  init: function(w,h) {
    if (!isNode) {
      this.renderer = PIXI.autoDetectRenderer(w,h);
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
    return legion;
  })
} else {
  define(['pixi'], function(pixi) {
    PIXI = pixi;

    return legion;
  });
}
