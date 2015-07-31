define([
  'legion',
  'legion/game',
  'legion/environment',
  'legion/entity'
], function(legion, Game, Environment, Entity) {
  describe('Game', function() {
    it('Init Multiplayer Game', function() {
        var g = new Game({
          multiplayer: true,
          socket: {
            on: function() {}
          },
          io: {
            on: function() {}
          }
        });
    });

    it('Create and Loop Game', function(done) {
      var g = new (Game.extend({
        loop: function() {
          this.paused = true;
          this.parent();
          done();
          done = null;
        }
      }))();
      g.setEnvironment(new Environment());
      g.loop();
    });

    it('Bind game to environment/entities', function() {
      var env = new Environment();
      var g = new Game();
      g.setEnvironment(env);

      var ent = new Entity();
      env.addEntity(ent);

      chai.assert.equal(g, env.game);
      chai.assert.equal(g, ent.game);
    })
  });
});
