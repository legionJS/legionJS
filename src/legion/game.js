define(['legion/class', 'legion/timer'], function(Class, Timer) {
  return Class.extend({

    // The target FPS
    fps: 60,

    // The current game time
    clock: null,

    // Whether the game is paused
    paused: false,

    // The list of timers in the game
    _timers: [],

    /*
      init({fps: 60})

      @param {object} properties 
    */
    init: function(properties) {
      this.parent(properties);
      this.clock = (new Date()).getTime();
      this.spf = 1000/this.fps;
    },


    /*
      loop() is the main game loop.
    */
    loop: function() {
      var new_clock = (new Date()).getTime();
      var delta = new_clock - this.clock;
      this.clock = new_clock;
      this._updateTimers(delta);
      if (!this.paused) {
        var t = Math.floor(this.spf - delta);
        t = t > 4 ? t : 4;
        this._loopTimeout = setTimeout(this.loop.bind(this), t);
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
    }
    
  });
});
