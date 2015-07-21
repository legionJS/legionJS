'use strict';

define(['legion/class', 'legion/util'], function(Class, Util) {
  return Class.extend({
    className: 'Server',
    game: null,
    gameDir: null,
    port: 1337,
    w: 500,
    h: 500,
    multiplayer: false,

    init: function(properties) {
      this.parent(properties);
    },

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

      http.listen(this.port, function() {
        console.log('Legion!');
      });

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
