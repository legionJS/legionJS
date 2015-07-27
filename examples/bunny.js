define([
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/input'
], function(Entity, DisplayObject, Input) {
  return Entity.implement([DisplayObject]).extend({

    speed: 200,
    x: 200, y: 200,
    ax: 1, ay: 2,

    init: function(properties) {
      var texture = PIXI.Texture.fromImage("game/bunny.png");
      var bunny = new PIXI.Sprite(texture);
      bunny.anchor.x = 0.5;
      bunny.anchor.y = 0.5;

      this.displayObject = bunny;
    },

    _update: function() {
      this.setVelocity(
        ( Input.state(Input.keys.LEFT) ? -this.speed :
                  Input.state(Input.keys.RIGHT) ? this.speed : null),
        ( Input.state(Input.keys.UP) ? -this.speed :
                  Input.state(Input.keys.DOWN) ? this.speed : null)
      );
      this.parent();
    }
  });
});