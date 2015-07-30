'use strict';

define(['legion/class', 'legion/util'], function(Class, Util) {
  return Class.extend(
  /** @lends Server# **/
  {

    /**
     * The class name, 'Server'
     * @type {String}
     * @default 'Server'
     * @readonly
     */
    className: 'Server',

    /**
     * The name of the file of the game to run on the server.
     * @type {String}
     * @default null
     */
    game: null,

    /**
     * The directory where the game is.
     * @type {String}
     * @default null
     */
    gameDir: null,

    /**
     * The port to run the server on.
     * @type {Number}
     * @default 1337
     */
    port: 1337,

    /**
     * The width of the game in pixels.
     * @type {Number}
     * @default 500
     */
    w: 500,

    /**
     * The height of the game in pixels.
     * @type {Number}
     * @default 500
     */
    h: 500,

    /**
     * Whether the game is multiplayer or not.  If the game is multiplayer
     * then the game will also run on the server.  If it is not then the
     * game files will just be served.
     * @type {Boolean}
     * @default false
     */
    multiplayer: false,

    /**
     * Initialize the server.
     * @constructs Server
     * @param  {object} properties - an object of properties to mixin
     * @extends Class
     * @classdesc Use server to serve game and/or run a multiplayer game.
     */
    init: function(properties) {
      this.parent(properties);
    },

    /**
     * Launches the server on the configured port.
     */
    run: function() {
      var express = require('express');
      var app = express();
      var http = require('http').Server(app);
      var fs = require('fs');
      var path = require('path');
      var mustache = require('mustache');

      // Set up static directories
      app.use(
        '/node_modules',
        express.static(path.join(__dirname, '../../node_modules'))
      );
      app.use('/src', express.static(path.join(__dirname, '../../src')));
      app.use('/game', express.static(this.gameDir));

      // Serve Game at root
      app.get('/', Util.hitch(this, function(req, res) {
        res.header('Content-Type', 'text/html');
        var data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        res.send(mustache.render(data, {
          game: this.game,
          w: this.w,
          h: this.h,
          multiplayer: this.multiplayer
        }));
      }));

      http.listen(this.port, Util.hitch(this, function() {
        console.log('Serving Legion on 127.0.0.1:' + this.port);
      }));

      if (this.multiplayer) {
        var Game = require(path.join(this.gameDir, this.game));
        var game = new Game({
          io: require('socket.io')(http),
          multiplayer: this.multiplayer
        });
        game.loop();
      }
    }
  });
});
