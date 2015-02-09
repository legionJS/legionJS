chai = require('chai');
define = require('node-requirejs-define');
define.config({
  baseUrl: __dirname,

  paths: {
    'legion': '../src/legion',
    'pixi':  '../node_modules/pixi.js/bin/pixi',
    'tests': '.'
  }
});


require('./class');
require('./entity');
require('./environment');
require('./timer');
