'use strict';

define([
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/input'
], function(Entity, DisplayObject, Input) {
  return Entity.implement([DisplayObject]).extend({

    className: 'Bunny',
    speed: 200,
    x: 200, y: 200,

    init: function(properties) {
      this.parent(properties);
      if (!legion.isNode) {
        var texture = PIXI.Texture.fromImage('game/bunny.png');
        var bunny = new PIXI.Sprite(texture);
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;

        this.displayObject = bunny;
      }
    },

    _update: function() {
      // Make sure that the inputs only effect your own bunny.
      if (!legion.isNode && this.clientID === this.game.clientID) {
        this.setVelocity(
          ( Input.state(Input.keys.LEFT) ? -this.speed :
                    Input.state(Input.keys.RIGHT) ? this.speed : 0),
          ( Input.state(Input.keys.UP) ? -this.speed :
                    Input.state(Input.keys.DOWN) ? this.speed : 0)
        );
      }

      this.parent();
    }
  });
});
