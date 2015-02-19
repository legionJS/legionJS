'use strict';

/*
  DisplayObject is the base interface for drawable entities.
*/
define([], function() {
  return {
    _update: function() {
      this.displayObject.x = this.x;
      this.displayObject.y = this.y;
    }
  };
});