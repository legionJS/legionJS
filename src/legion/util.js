'use strict';

/** @module Util */

define(function() {
  return {

    /**
     * Returns a function with this bound to the given object.  Used for event
     * callbacks when this may be different from the scope where the function
     * is defined.
     *
     * @param  {object} _this - the object to use as `this` in the function.
     * @param  {function} f - the function to bind
     * @return {function} - the function bound to _this
     * @example
     *
     * this.hp = 100;
     *
     * event.on('collide', function() {
     * 	this.hp -= 10; // Error! this.hp is undefined!
     * });
     *
     * event.on('collide', Util.hitch(this, function() {
     * 	this.hp -= 10; //Works!
     * }));
     *
     * It is equivalent to doing the following:
     * var callback = function() {
     * 	this.hp -= 10;
     * }
     *
     * event.on('collide', callback.bind(this));
     */
    hitch: function(_this, f) {
      return f.bind(_this);
    }
  };
});
