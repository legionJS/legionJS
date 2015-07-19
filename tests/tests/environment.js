define([
  'legion',
  'legion/environment',
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/graphics/shape'
], function(legion, Environment, Entity, DisplayObject, Shape) {
  describe('Environment', function() {
    it('Create Environment', function() {
      var e = new Environment();
    });

    it('Create Environment with Background Color', function() {
      var e = new Environment({backgroundColor: 0x123456});

      if (!legion.isNode) {
        chai.assert.equal(e.stage.backgroundColor, 0x123456);
      }
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

    it('Add Graphical Entities', function() {
      var e = new Environment({width: 100, height: 100});
      var ent = new (Entity.implement([DisplayObject, Shape]))({
        w: 50, h: 50, x: 300, y:300,
        color: 0xFFFF00, shape: 'rect'
      });
      e.addEntity(ent);

      if (!legion.isNode) {
        chai.assert.equal(e.stage.children[0], ent.displayObject);
      }
    });

    it('Render Environment', function() {
      e = new Environment();

      if (!legion.isNode) {
        e._render();
      }
    });

    it('Update Environment', function() {
      var e = new Environment({
        width: 100, height: 100,
        game: {delta: 1, _getObjectID: function(){}}
      });
      var ent = new (Entity.implement([DisplayObject, Shape]))({
        w: 50, h: 50, x: 300, y:300,
        color: 0xFFFF00, shape: 'rect'
      });
      e.addEntity(ent);

      var ent2 = new (Entity.implement([DisplayObject, Shape]))({
        w: 50, h: 50, x: 200, y:200,
        color: 0xFFFF00, shape: 'rect'
      });
      e.addEntity(ent2);

      e._update();

      if (!legion.isNode) {
        chai.assert.equal(ent.x, ent.displayObject.x);
        chai.assert.equal(ent.y, ent.displayObject.y);

        chai.assert.equal(ent2.x, ent2.displayObject.x);
        chai.assert.equal(ent2.y, ent2.displayObject.y);
      }
    });
  });
});
