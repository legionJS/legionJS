define([
  'legion/environment',
  'legion/game',
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/graphics/shape',
  'legion/input'
], function(Environment, Game, Entity, DisplayObject, Shape, Input) {
  return Game.extend({
    initClient: function() {
      var env = new Environment({backgroundColor: 0x66FF99});
      this.setEnvironment(env);


      /* Raw PIXI Display Object */

      // Create a raw PIXI display object
      var texture = PIXI.Texture.fromImage("game/bunny.png");
      var bunny = new PIXI.Sprite(texture);
      bunny.anchor.x = 0.5;
      bunny.anchor.y = 0.5;

      // Create an entity with the displayObject
      var ent = new (Entity.implement([DisplayObject, {
        _update: function() {
          var speed = 200;
          this.setVelocity(
            speed * ( Input.state(Input.keys.LEFT) ? -1 : 
                      Input.state(Input.keys.RIGHT) ? 1 : 0),
            speed * ( Input.state(Input.keys.UP) ? -1 : 
                      Input.state(Input.keys.DOWN) ? 1 : 0)
          );
          this.parent();
        }
      }]))({
        displayObject: bunny, x: 200, y: 150
      });

      // Add it to the environment
      env.addEntity(ent);


      /* Basic Shapes */

      var CustomEnt = Entity.implement([DisplayObject, Shape])
        .extend({
          _update: function() {
            this.parent();

            //Loop the entities
            if (this.x > 500) {
              this.x = -100;
            }

            if (this.y > 500) {
              this.y = -100;
            }
          }
        });

      // Create an entity that implements Shape and create
      // a rectangle instance.
      var ent2 = new CustomEnt({
        w: 50, h: 50, x: 300, y:300, vx: 200,
        color: 0xFFFF00, shape: 'rect'
      });
      env.addEntity(ent2);

      var ent3 = new CustomEnt({
        x: 250, y:250, r: 30, vx: 200, vy: 200,
        color: 0x0000FF, shape: 'circle'
      });
      env.addEntity(ent3);
    }
  })
});