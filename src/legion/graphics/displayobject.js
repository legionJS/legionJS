'use strict';

/*
  DisplayObject is the base interface for drawable entities.
*/
define([], function() {

  if (legion.isNode) {
    return {};
  } else {
    return {
      _update: function() {
        this.parent();
        this.displayObject.x = this.x;
        this.displayObject.y = this.y;
      }
    };
  }
});
