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

require('./tests/legion');
require('./tests/class');
require('./tests/entity');
require('./tests/environment');
require('./tests/graphics');
require('./tests/timer');
require('./tests/util');
require('./tests/game');
require('./tests/input');

//Make sure all src files are included so that coverage will take into account untested files.
file = require('file');
file.walk('src', function(_, dirPath, dirs, files) {
  for (var i = 0; i < files.length; i++) {
    require('../' + files[i].split('.js')[0]);
  }
});
