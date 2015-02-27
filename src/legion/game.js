'use strict';

define(['legion/class', 'legion/timer', 'legion/event', 'legion/input'],
  function(Class, Timer, Event, Input) {
  var Game = Class.extend({

    // The target FPS
    fps: 60,

    // The current game time
    clock: null,

    // Whether the game is paused
    paused: false,

    // The list of timers in the game
    _timers: null,

    // frame times
    _frameTimes: null,

    /*
      init({fps: 60})

      @param {object} properties
    */
    init: function(properties) {
      this.parent(properties);
      this.clock = (new Date()).getTime();
      this.spf = 1000 / this.fps;
      this.event = new Event();
      this._timers = [];
      this._frameTimes = [];
      // On client-side bind the global Input object to this game
      // On server it will be bound individually to each connection's
      // input object.
      if (!legion.isNode) {
        Input._bindGame(this);
      }
    },


    /*
      loop() is the main game loop.
    */
    loop: function() {
      var newClock = (new Date()).getTime();
      var delta = newClock - this.clock;
      this.clock = newClock;
      this._updateTimers(delta);
      if (!this.paused) {
        var t = Math.round(2 * this.spf - delta - 1);
        t = t > 4 ? t : 4;
        this._loopTimeout = setTimeout(this.loop.bind(this), t);
      }

      this._update();

      this.event._resolveEventQueue();

      if (legion.debug) {
        this._measureFPS(newClock);
      }
    },

    _measureFPS: function(newTime) {
      if (this._frameTimes.length >= this.fps) {
        this._frameTimes.shift();
      }
      this._frameTimes.push(newTime);
      this.actualFps = 1000 * this._frameTimes.length /
        (this._frameTimes[this._frameTimes.length - 1] - this._frameTimes[0]);
    },


    /*
      _update() is called once each frame to the current environment.
    */
    _update: function() {
      if (this.environment) {
        this.environment._update();
      }
    },


    /*
      createTimer() creates and returns a timer for the given milliseconds.

      Takes an object with:
        target: The target time in milliseconds
        loop: Whether to automatically loop the timer.

      @param {int} milliseconds
    */
    createTimer: function(properties) {
      var timer = new Timer(properties);
      this._timers.push(timer);
      return timer;
    },


    /*
      _updateTimers() updates all the timers in this.timers
    */
    _updateTimers: function(delta) {
      for (var i = 0; i < this._timers.length; i++) {
        this._timers[i].tick(delta);
      }
    },

    setEnvironment: function(environment) {
      this.environment = environment;
      this.environment._bindGame(this);
    }
  });

  // On node return a game without rendering
  if (legion.isNode) {
    return Game;
  } else {
    return Game.extend({

      /*
        loop() is the main game loop.
      */
      loop: function() {
        this.parent();
        this._render();
      },

      /*
        _render() renders the environment on the canvas.
      */
      _render: function() {
        if (this.environment) {
          this.environment._render();
        }
      }
    });
  }
});
