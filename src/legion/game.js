'use strict';

/**
 * @module legion/game
 */
define([
    'legion/class', 'legion/timer', 'legion/event',
    'legion/input', 'legion/util'
], function(Class, Timer, Event, Input, Util) {
  /**
   * Creates a new Game.
   * @class Game
   * @extends module:legion/Class
   */
  var Game = Class.extend({

    /**
     * The target FPS
     * @type {Number}
     * @default 60
     */
    fps: 60,

    /**
     * The current game time
     * @type {Date}
     */
    clock: null,

    /**
     * Whether the game is paused
     * @type {Boolean}
     * @default false
     */
    paused: false,

    /**
     * The list of timers in the game
     * @type {Array.<Timer>}
     * @private
     */
    _timers: null,

    /**
     * frame times
     * @type {Array.<Number>}
     * @private
     */
    _frameTimes: null,

    /**
     * Whether it's a multiplayer game
     * @type {Boolean}
     * @default false
     */
    multiplayer: false,

    //Number of milliseconds between syncing TODO make private
    msPerSync: 50,

    //Timer for syncing
    syncTimer: null,

    /**
     * Available server-side in multiplayer games
     * @type {io}
     */
    io: null,

    /**
     * Available client-side in multiplayer games
     * @type {socket}
     */
    socket: null,

    /**
     * Current environment for the game
     * @type {Environment}
     */
    environment: null,

    /**
     * A sequential object ID to uniquely identify all objects.
     * @type {Number}
     */
    objectID: 0,

    // On the client-side this is the ID of the client.
    clientID: null,


   /**
    * Initialize the Game class.
    * @method
    * @param  {Object} properties - Class initialization properties
    * @return {undefined}
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

      if (this.multiplayer) {
        this.syncTimer = this.createTimer({target: this.msPerSync, loop:true});
      }

      if (!legion.isNode) {
        Input._bindGame(this);
      }

      if (legion.isNode && this.multiplayer) {
        this.initServer();
      } else {
        this.initClient();
      }
    },

    /**
     * Initialize the client.
     * @method
     * @return {undefined}
     */
    initClient: function() {
      if (this.multiplayer) {
        this.socket.on('connected', Util.hitch(this, this.onConnectionClient));

        this.socket.on('sync', Util.hitch(this, function(message) {
          this.event.trigger('sync', [message]);
        }));
        this.event.on('sync', Util.hitch(this, this.syncClient));
      }
    },

    /**
     * Initialize the server.
     * @method
     * @return {undefined}
     */
    initServer: function() {
      this.io.on('connection', Util.hitch(this, this.onConnectionServer));

      /*this.socket.on('sync', Util.hitch(this, function(message) {
        this.event.trigger('sync', [message]);
      }));*/
      this.event.on('sync', Util.hitch(this, this.syncServer));
    },

    /**
     * Called on the server-side when a client connects.
     * @method
     * @param  {Socket} socket - socket
     * @return {undefined}
     */
    onConnectionServer: function(socket) {
      console.log('player connected!');
      //console.log(this.connectionMessage(socket));
      //console.log(JSON.stringify(this.connectionMessage(socket)));
      socket.emit('connected', this.connectionMessage(socket));
      /*socket.on('sync', function(o) {
        console.log(o[0].x);
      });*/
      //socket.on('sync', Util.hitch(this, this.syncServer));
      socket.on('sync', Util.hitch(this, function(message) {
        this.event.trigger('sync', [message]);
      }));

      socket.on('disconnect', Util.hitch(this, function() {
        this.onDisconnect(socket);
      }));
    },

    /*
      connectionMessage() generates the message that will be sent to the
      client when it connects to the server.  It is in the form of a object.

      Default is just the client ID:

      {clientID:id}

      @param socket
      @return {object}
    */
    connectionMessage: function(socket) {
      return {clientID: socket.id};
    },

    /*
      Called on the client-side when the server responds to the client's
      connection.  Triggered by having the server's socket emit 'connect'.
    */
    onConnectionClient: function(message) {
      this.clientID = message.clientID;
      console.log('connected to server');
    },

    syncClient: function(message) {
      //console.log(message);
      this.environment._sync(message);
    },

    syncServer: function(message) {
      //console.log(message[0].x)
      this.environment._sync(message);
    },

    /*syncServer: function() {
      this.io.emit('sync', {clock: this.clock});
    },*/

    sendServerStateToClient: function() {
      var message = this.environment._getSyncMessage();
      //console.log(message);
      if (message.length > 0) {
        //console.log("boO!");
        //process.exit();
      }
      this.io.emit('sync', message);
    },

    /*
      Serialize any entites with syncDirection=='up' in the environment
      and send them to the server.
    */
    sendClientStateToServer: function() {
      var message = this.environment._getSyncMessage();
      //console.log(message);
      this.socket.emit('sync', message);
    },

    /**
     * The main game loop.
     * @return {undefined}
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

      if (this.syncTimer.triggered()) {
        if (legion.isNode && this.multiplayer) {
          this.sendServerStateToClient();
        } else {
          this.sendClientStateToServer();
        }
      }

      this.event._resolveEventQueue();

      if (legion.debug) {
        this._measureFPS(newClock);
      }
    },

    /**
     * [_measureFPS description]
     * @method
     * @private
     * @param  {Number} newTime - The time in milliseconds
     * @return {undefined}
     */
    _measureFPS: function(newTime) {
      if (this._frameTimes.length >= this.fps) {
        this._frameTimes.shift();
      }
      this._frameTimes.push(newTime);
      this.actualFps = 1000 * this._frameTimes.length /
        (this._frameTimes[this._frameTimes.length - 1] - this._frameTimes[0]);
    },


    /**
     * Called once each frame to the current environment.
     * @return {undefined}
     */
    _update: function() {
      if (this.environment) {
        this.environment._update();
      }
    },

   /**
    * Creates and returns a timer for the given milliseconds.
    * @method
    * @param  {Object} properties - New timer properties
    * @param  {Number} properties.target - The target time in milliseconds
    * @param  {Number} properties.loop - Whether to automatically loop the timer
    * @return {Timer} A timer for the specified milliseconds
    */
    createTimer: function(properties) {
      var timer = new Timer(properties);
      this._timers.push(timer);
      return timer;
    },


    /**
     * Updates all the timers in this.timers
     * @method
     * @private
     * @param  {Number} delta - The time difference in milliseconds
     * @return {undefined}
     */
    _updateTimers: function(delta) {
      for (var i = 0; i < this._timers.length; i++) {
        this._timers[i].tick(delta);
      }
    },

    /**
     * Sets the environment
     * @param  {Environment} environment - The environment to set to
     * @return {undefined}
     */
    setEnvironment: function(environment) {
      this.environment = environment;
      this.environment._bindGame(this);
    },

    /**
     * Gets the objectID
     * @return {Number} The objectID incremented by 1
     */
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
