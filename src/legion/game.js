'use strict';

define([
    'legion/class', 'legion/timer', 'legion/event',
    'legion/input', 'legion/util'
], function(Class, Timer, Event, Input, Util) {
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

    // Whether it's a multiplayer game
    multiplayer: false,

    // Available server-side in multiplayer games
    io: null,

    // Available client-side in multiplayer games
    socket: null,

    // Current environment for the game
    environment: null,

    // A sequential object ID to uniquely identify all objects.
    objectID: 0,

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

      if (legion.isNode && this.multiplayer) {
        this.initServer();
      } else {
        this.initClient();
      }
    },

    initClient: function() {
      if (this.multiplayer) {
        this.socket.on('connect', Util.hitch(this, this.onConnectionClient));
        this.socket.on('sync', Util.hitch(this, function(syncObject) {
          this.event.trigger('sync', [syncObject]);
        }));
        this.event.on('sync', Util.hitch(this, this.syncClient));
      }
    },

    initServer: function() {
      this.io.on('connection', Util.hitch(this, this.onConnectionServer));
    },

    /*
      Called on the server-side when a client connects.
    */
    onConnectionServer: function(socket) {
      console.log('player connected!');
      socket.emit('connect');
    },

    /*
      Called on the client-side when the server responds to the client's
      connection.  Triggered by having the server's socket emit 'connect'.
    */
    onConnectionClient: function() {
      console.log('connected to server');
    },

    syncClient: function() {
    },

    syncServer: function() {
      this.io.emit('sync', {clock: this.clock});
    },

    /*
      loop() is the main game loop.
    */
    loop: function() {
      var newClock = (new Date()).getTime();
      this.delta = newClock - this.clock;
      this.clock = newClock;
      this._updateTimers(this.delta);
      if (!this.paused) {
        var t = Math.round(2 * this.spf - this.delta - 1);
        t = t > 4 ? t : 4;
        this._loopTimeout = setTimeout(this.loop.bind(this), t);
      }

      this._update();

      if (legion.isNode && this.multiplayer) {
        this.syncServer();
      }

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
    },

    _getObjectID: function() {
      return this.objectID++;
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
