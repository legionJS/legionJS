'use strict';

define([
    'legion/class', 'legion/timer', 'legion/event',
    'legion/input', 'legion/util'
], function(Class, Timer, Event, Input, Util) {

  var Game = Class.extend(
    /** @lends Game# */
    {

    /**
     * The class name, 'Game'
     * @type {String}
     * @default 'Game'
     * @readonly
     */
    className: 'Game',

    /**
     * The target FPS (Frames per second)
     * @type {Number}
     * @default 60
     */
    fps: 60,

    /**
     * The current game time
     * @type {Date}
     * @default null
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
     * @default null
     * @private
     */
    _timers: null,

    /**
     * An array of the timestamps for each of the last X frames, where X is
     * this.fps.
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

    /**
     * The number of milliseconds between sending sync messages.
     * @type {Number}
     * @default 50
     */
    msPerSync: 50,

    /**
     * The timer for sending sync messages
     * @type {Timer}
     * @default null
     */
    syncTimer: null,

    /**
     * socket.io instance available server-side in multiplayer games
     * @type {socket.io}
     * @default null
     */
    io: null,

    /**
     * socket.io socket available client-side in multiplayer games
     * @type {socket}
     * @default null
     */
    socket: null,

    /**
     * Current environment for the game
     * @type {Environment}
     * @default null
     */
    environment: null,

    /**
     * A sequential object ID to uniquely identify all objects.
     * @type {Number}
     * @default 0
     */
    objectID: 0,

    /**
     * On the client-side this is the ID of the client.  The clientID is the
     * same as the socket.io socket id.
     * @type {String}
     * @default null
     */
    clientID: null,


   /**
    * Initialize the Game class.
    * @constructs Game
    * @param  {Object} properties - an object of properties to mixin
    * @extends Class
    * @classdesc The game class.
    */
    init: function(properties) {
      this.parent(properties);
      this.clock = (new Date()).getTime();
      this.spf = 1000 / this.fps;
      this.event = new Event();
      this._timers = [];
      this._frameTimes = [];

      if (this.multiplayer) {
        this.syncTimer = this.createTimer({target: this.msPerSync, loop:true});
      }

      // On client-side bind the global Input object to this game
      // On server it will be bound individually to each connection's
      // input object.
      if (!legion.isNode) {
        Input._bindGame(this);
      }

      // Call the server/client specific init methods.
      if (legion.isNode) {
        if (this.multiplayer) {
          this.serverInit();
        }
      } else {
        this.clientInit();
      }
    },

    /**
     * Client-side specific initialization.  Called automatically by the
     * constructor on client-side.
     */
    clientInit: function() {
      if (this.multiplayer) {

        // Called when the server sends the client it's initial connection
        this.socket.on('connected', Util.hitch(this, this.clientOnConnection));

        // Called when the the server sends a sync message.  Trigger a sync
        // event to handle the sync synchronously.
        this.socket.on('sync', Util.hitch(this, function(message) {
          this.event.trigger('sync', [message]);
        }));
        this.event.on('sync', Util.hitch(this, this.clientHandleSync));
      }
    },

    /**
     * Server-side specific initialization.  Called automatically by the
     * constructor on server-side.
     */
    serverInit: function() {
      // On the socket.io connection event trigger the connection event
      this.io.on('connection', Util.hitch(this, function(socket) {
        this.event.trigger('connection', [socket]);
      }));
      this.event.on('connection', Util.hitch(this, this.serverOnConnection));

      // Create an event to handle client sync messages.
      this.event.on('sync', Util.hitch(this, this.serverHandleSync));
    },

    /**
     * Called on the server-side when a client connects. Sets up listeners
     * for the client's sync messages and for client disconnect.  Then emits
     * a message to the client using
     * [serverConnectionMessage]{@link Game.serverConnectionMessage}.
     *
     * @param  {Socket} socket - socket
     */
    serverOnConnection: function(socket) {
      // Handle a sync message from the client.
      socket.on('sync', Util.hitch(this, function(message) {
        this.event.trigger('sync', [message]);
      }));

      // Handle a client disconnecting from the server.
      socket.on('disconnect', Util.hitch(this, function() {
        this.serverOnDisconnect(socket);
      }));

      // Send the connection message to the client.
      socket.emit('connected', this.serverConnectionMessage(socket));
    },

    /**
     * Called when a client disconnects from the server.  Does nothing by
     * default.
     *
     * @param  {Socket} socket - The socket that disconnected
     */
    serverOnDisconnect: function() {},

    /**
     * Generates a message to send to the client when it connects.  It is in
     * the form of an object.  The default message just contains the clientID:
     * <pre>
     * {clientID: clientID}
     * </pre>
     * @param  {Socket} socket - The client's socket.io socket
     */
    serverConnectionMessage: function(socket) {
      return {clientID: socket.id};
    },

    /**
     * Called on the client-side when the client receives the server's
     * connection message.  The message will contain info for the client to
     * initialize the game, such as the client's character.
     *
     * @param  {object} message - object with information to setup client
     */
    clientOnConnection: function(message) {
      this.clientID = message.clientID;
    },

    /**
     * Handle an incoming sync message from the server.
     *
     * @param  {Object|Object[]} message
     */
    clientHandleSync: function(message) {
      this.environment._sync(message);
    },

    /**
     * Handle an incoming sync message from a client.
     *
     * @param  {Object|Object[]} message
     */
    serverHandleSync: function(message) {
      this.environment._sync(message);
    },

    /**
     * Send the state of the server to the clients.
     */
    serverSendState: function() {
      var message = this.environment._getSyncMessage();
      this.io.emit('sync', message);
    },

    /**
     * Send the state of the client to the server.
     */
    clientSendState: function() {
      var message = this.environment._getSyncMessage();
      this.socket.emit('sync', message);
    },

    /**
     * The main game loop.
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

      if (this.syncTimer && this.syncTimer.triggered()) {
        if (legion.isNode) {
          this.serverSendState();
        } else {
          this.clientSendState();
        }
      }

      this.event._resolveEventQueue();

      if (legion.debug) {
        this._measureFPS(newClock);
      }
    },

    /**
     * Measure the actual FPS
     * @private
     * @param  {Number} newTime - The timestamp of the current frame
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
     * Called once each frame to update the current environment.
     * @private
     */
    _update: function() {
      if (this.environment) {
        this.environment._update();
      }
    },

   /**
    * Creates and returns a timer for the given milliseconds.
    *
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
     * @private
     * @param  {Number} delta - The time difference since the last update
     *                        in milliseconds
     */
    _updateTimers: function(delta) {
      for (var i = 0; i < this._timers.length; i++) {
        this._timers[i].tick(delta);
      }
    },

    /**
     * Sets the game to the given environment
     *
     * @param  {Environment} environment - The environment to set to
     */
    setEnvironment: function(environment) {
      this.environment = environment;
      this.environment._bindGame(this);
    },

    /**
     * Gets a new unique object ID
     *
     * @private
     * @return {Number} Object ID
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
