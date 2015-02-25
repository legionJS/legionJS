'use strict';

/*
  Return singleton on client side so that there is one instance of input
  for the client.

  On server each user needs a separate instance of input.

  Provide the following:

  //Keyboard
  //Check key state in game loop
  input.down(key) //True in the first frame after a key is pressed down
  input.up(key) //True in the first frame after a key is released
  input.state(key) //True is down, false if up.

  //Bind events
  input.onPress(function) //call when this key is pressed (up/down)
  input.onDown(function) //Call when the key is pressed down
  input.onUp(function) //call when key is released
*/

define(['legion/class', 'legion/util'], function(Class, util) {
  var Input = Class.extend({
    _state: {},

    keys: {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    },

    state: function(keyCode) {
      return !!this._state[keyCode]; // !! to handle undefined
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
        });

        global.onkeyup = util.hitch(this, function(e) {
          this._state[e.keyCode] = false;
        });
      }
    }))();
  }
});
