'use strict';

/*
  Return singleton on client side so that there is one instance of input
  for the client.

  On server each user needs a separate instance of input.

  Provide the following:

  //Keyboard
  //Check key state in game loop
  input.state(key) //True is down, false if up.

  //Bind events
  input.onDown(function) //Call when the key is pressed down
  input.onUp(function) //call when key is released
*/

define(['legion/class', 'legion/util'], function(Class, util) {
  var Input = Class.extend({
    _state: null,

    keys: {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    },

    init: function(properties) {
      this._state = {};
      this.parent(properties);
    },

    state: function(keyCode) {
      return !!this._state[keyCode]; // !! to handle undefined
    },

    onDown: function(keyCode, callback) {
      this.game.event.on('keyDown_' + keyCode, callback);
    },

    onUp: function(keyCode, callback) {
      this.game.event.on('keyUp_' + keyCode, callback);
    }
  });

  if (legion.isNode) {
    return Input;
  } else {
    return new (Input.extend({
      init: function(properties) {
        this.parent(properties);

        global.onkeydown = util.hitch(this, function(e) {
          this._state[e.keyCode] = true;
          this.game.event.trigger('keyDown_' + e.keyCode);
        });

        global.onkeyup = util.hitch(this, function(e) {
          this._state[e.keyCode] = false;
          this.game.event.trigger('keyUp_' + e.keyCode);
        });
      }
    }))();
  }
});
