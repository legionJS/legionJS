'use strict';

/**
 * Shape is an interface for drawing primative shapes. Supports rectangles and
 * circles
 * @interface Shape
 */
define([], function() {

  //Base Shape interface for both browser and server.
  var Shape = {

    /**
     * The type of shape
     * @type {'rect'|'circle'}
     * @default 'rect'
     * @name Shape#shape
     */
    shape: 'rect',

    /**
     * If the shape is a circle, the radius.
     * @type {Number}
     * @default 0
     * @name Shape#r
     */
    r: 0,

    /**
     * Create a rectangular bounding box based on the type of shape and
     * dimensions.
     * @name Shape#_createBoundingBox
     * @function
     * @private
     */
    _createBoundingBox: function() {
      if (this.shape === 'circle') {
        this.w = this.h = this.r * 2;
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

    /**
     * Create the PIXI display object associated with the given shape.
     *
     * @name Shape#_createDisplayObject
     * @private
     * @function
     */
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
