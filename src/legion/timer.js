'use strict';

define(['legion/class'], function(Class) {
  return Class.extend({

    // Target Time in milliseconds
    target: 0,

    // Whether to automatically reset the Timer
    loop: false,

    // How much time has elapsed since the timer was last reset
    _elapsed: 0,

    // Number of times the timer triggered since triggered() was last called.
    _timesTriggered: 0,

    // Set to true every time the timer resets back to the beginning.
    _reset: true,

    /*
      init({target: 0, loop: false})

      @param {object} properties
    */
    init: function(properties) {
      //this._clock = legion.currentTime;
      this.parent(properties);
      //this._target = legion.currentTime
    },


    /*
      tick() advances the timer given the new current time.

      @param {int} currentTime - milliseconds since 1/1/1970
    */
    tick: function(delta) {
      this._elapsed += delta;
      if (this._elapsed >= this.target && this._reset) {
        this._timesTriggered += 1;
        this._reset = false;
        if (this.loop) {
          this.reset(true);
        }
      }
    },


    /*
      delta() returns this time until the timer triggers.
    */
    delta: function() {
      return this.target - this._elapsed;
    },


    /*
      triggered() returns the number of times the timer has triggered since
      triggered was last called.  Will usually only be 1 unless automatic
      looping is enabled.
    */
    triggered: function() {
      var t = this._timesTriggered;
      this._timesTriggered = 0;
      return t;
    },


    /*
      reset() resets the timers elapsed time back to 0.  If adjust is true
      then the elapsed time will be reset relative to the amount of time that
      has elapsed past the target time.
    */
    reset: function(adjust) {
      adjust = typeof adjust !== 'undefined' ? adjust : false;

      if (adjust) {
        this._elapsed -= this.target;
      } else {
        this._elapsed = 0;
      }

      this._reset = true;
    }
  });
});
