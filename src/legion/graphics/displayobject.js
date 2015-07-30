'use strict';

/**
  DisplayObject is the base interface for drawable entities.

  @interface DisplayObject
*/
define([], function() {

  if (legion.isNode) {
    return {};
  } else {
    return {

      /**
       * The PIXI display object
       * @type {PIXI.DisplayObject}
       * @default null
       * @name DisplayObject#displayObject
       */
      displayObject: null,

      /**
       * Updates needed for all display objects.
       * @name DisplayObject#_update
       * @function
       */
      _update: function() {
        this.parent();
        this.displayObject.x = this.x;
        this.displayObject.y = this.y;
      }
    };
  }
});
