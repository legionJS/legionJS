define([
  'legion/environment',
  'legion/game',
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/graphics/shape',
  'legion/input',
  'game/bunny'
], function(Environment, Game, Entity, DisplayObject, Shape, Input, Bunny) {
  return Game.extend({
    initClient: function() {
      this.parent(arguments);
      var env = new Environment({backgroundColor: 0x66FF99});
      this.setEnvironment(env);

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
    },

    /*
      Create a bunny object for the player.
    */
    onConnectionClient: function(socket) {
      this.parent(socket);
      this.environment.addEntity(new Bunny());
    }
  })
});