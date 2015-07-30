'use strict';

define(['legion/class'], function(Class) {
  return Class.extend(
  /** @lends Timer# */
  {

    /**
     * The class name, 'Timer'
     * @type {String}
     * @default 'Timer'
     * @readonly
     */
    className: 'Timer',

    /**
     * The target amount of time in milliseconds for when the timer should
     * trigger.
     * @type {Number}
     * @default 0
     */
    target: 0,

    /**
     * Whether the timer should automatically reset after it triggers.
     * @type {Boolean}
     * @default false
     */
    loop: false,

    /**
     * How much time has elapsed since the timer started or was last reset.
     * @type {Number}
     * @default 0
     * @private
     */
    _elapsed: 0,

    // Number of times the timer triggered since triggered() was last called.
    /**
     * Number of times the timer has triggered since
     * [triggered]{@link Timer.triggered} was last called.  0 means it hasn't
     * yet hit it's target time.  1 means it has triggered. On a non-looping
     * timer this will be at most 1, but if the timer loops then it may be
     * higher.
     * @type {Number}
     * @default 0
     * @private
     */
    _timesTriggered: 0,

    /**
     * Set to true every time the timer is reset back to the beginning.  Set to
     * false when the timer triggers.
     * @type {Boolean}
     * @default true
     * @private
     */
    _reset: true,

    /**
     * Initialize the Timer
     *
     * @param {object} properties - Object of properties to mixin.
     * @param {number} properties.target - the target time for the timer
     * @param {boolean} properties.loop - Whether to automatically loop the
     *                                  timer when it triggers.
     * @constructs Timer
     * @extends Class
     * @classdesc Timers are used to keep track of elapsed time and trigger
     * periodic events.
     */
    init: function(properties) {
      this.parent(properties);
    },

    /**
     * Advance the timer by the given number of milliseconds.
     *
     * @param  {number} delta - milliseconds to advance the timer by
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

    /**
     * Returns the time until the timer will trigger.
     *
     * @return {number} - The number of milliseconds until the timer will
     * trigger
     */
    delta: function() {
      return this.target - this._elapsed;
    },


    /**
     * Returns the number of times the timer has triggered since
     * triggered was last called.  Will be at most 1 unless automatic
     * looping is enabled. Returns 0 if the timer hasn't triggered since
     * the last call to triggered.
     *
     * @return {number} - number of times triggered since the last call to
     * triggered
     *
     * @example
     *
     * // Create a timer to spawn enemies every 10 seconds.
     * // In your game's init:
     * this.spawnTimer = this.createTimer({target: 10000, loop: true});
     *
     * // In game's loop check if the timer has triggered. This will only be
     * // true once every 10 seconds.
     * if (this.spawnTimer.triggered()) {
     * 	this.spawnEnemy();
     * }
     */
    triggered: function() {
      var t = this._timesTriggered;
      this._timesTriggered = 0;
      return t;
    },


    /**
     * Resets the timers elapsed time back to 0.  If adjust is true
     * then the elapsed time will be reset relative to the amount of time that
     * has elapsed past the target time.  For example, if a timer with a target
     * of 1000 was reset 1025 milliseconds after starting with adjust==true,
     * then it would next trigger in 975 milliseconds.
     *
     * @param {boolean} [adjust=false] - Whether to adjust the next timer
     *                                 based on how much this timer overshot
     *                                 the target.
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
