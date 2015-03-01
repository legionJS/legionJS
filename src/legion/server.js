'use strict';

define(['legion/class', 'legion/util'], function(Class, Util) {
  return Class.extend({
    game: null,
    gameDir: null,
    port: 1337,
    w: 500,
    h: 500,

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
        console.log(typeof data);
        res.send(mustache.render(data, {
          game: this.game,
          w: this.w,
          h: this.h
        }));
      }));

      http.listen(this.port, function() {
        console.log('Legion!');
      });
    }
  });
});
