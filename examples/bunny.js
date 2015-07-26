define([
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/input'
], function(Entity, DisplayObject, Input) {
  return Entity.implement([DisplayObject]).extend({

    speed: 200,
    x: 200, y: 200,
    ax: 100, ay: 100,

    init: function(properties) {
      var texture = PIXI.Texture.fromImage("game/bunny.png");
      var bunny = new PIXI.Sprite(texture);
      bunny.anchor.x = 0.5;
      bunny.anchor.y = 0.5;

      this.displayObject = bunny;
    },

    _update: function() {
      this.setVelocity(
        this.speed * ( Input.state(Input.keys.LEFT) ? -1 : 
                  Input.state(Input.keys.RIGHT) ? 1 : 0),
        this.speed * ( Input.state(Input.keys.UP) ? -1 : 
                  Input.state(Input.keys.DOWN) ? 1 : 0),
        this.ax, this.ay

      );
      this.parent();
    }
  });
});