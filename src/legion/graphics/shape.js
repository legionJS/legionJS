'use strict';

/*
  Shape is an interface for drawing primative shapes.
*/
define([], function() {

  //Base Shape interface for both browser and server. 
  var Shape = {
    _createBoundingBox: function() {
      if (this.shape === 'circle') {
        this.w = this.h = this.r*2;
      }
    }
  };

  if (legion.isNode) {
    //On server just update bounding box
    Shape.init = function(properties) {
      this.parent(properties);
      this._createBoundingBox();
    };

    return Shape;
  } else {
    //On browser add graphics.
    Shape.init = function(properties) {
      this.parent(properties);
      this._createDisplayObject();
      this._createBoundingBox();
    };

    Shape._createDisplayObject = function() {
      var graphics = new PIXI.Graphics();

      graphics.beginFill(this.color);

      if (this.shape === 'rect') {
        graphics.drawRect(0, 0, this.w, this.h);
      } else if (this.shape === 'circle') {
        graphics.drawCircle(0, 0, this.r);       
      }

      this.displayObject = graphics;
    };

    return Shape;
  }
});
