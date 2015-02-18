define([
  'legion',
  'legion/environment',
  'legion/entity'
], function(legion, Environment, Entity) {
  describe('Environment', function() {
    it('Create Environment', function() {
      var e = new Environment();
    });

    it('Create Environment with Size', function() {
      var e = new Environment({width: 100, height: 200});

      chai.assert.equal(e.width, 100);
      chai.assert.equal(e.height, 200);
    });

    it('Add Entities to Environment', function() {
      var e = new Environment({width: 100, height: 100});
      var a = new Entity();
      var b = new Entity();

      e.addEntity(a);
      e.addEntity(b);

      chai.assert.equal(e.entities[0], a);
      chai.assert.equal(e.entities[1], b);
      chai.assert.equal(e.entities.length, 2);
    });
  });
});
