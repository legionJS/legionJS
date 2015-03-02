// node test.js to Run server
// Go to localhost:

define = require('node-requirejs-define');
define.config({
  baseUrl: __dirname,

  paths: {
    'legion': '../src/legion',
    'pixi':  '../node_modules/pixi.js/bin/pixi',
    'game': __dirname
  }
});

define(['legion', 'legion/server'], function(legion, Server) {
  var server = new Server({
    game: 'example_game', 
    gameDir: __dirname,
    port: 1337,
    w: 500,
    h: 500
  });
  server.run();
});
