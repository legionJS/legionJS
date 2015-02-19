'use strict';

/*
  Shape is an interface for drawing primative shapes.
*/
define([], function() {
  return {
    init: function(properties) {
      this.parent(properties);
      this._createDisplayObject();
    },

    _createDisplayObject: function() {
      var graphics = new PIXI.Graphics();

      graphics.beginFill(this.color);

      if (this.shape === 'rect') {
        graphics.drawRect(0,0, this.w, this.h);
      }

      this.displayObject = graphics;
    }
  };
});