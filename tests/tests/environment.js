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
      var a = new Entity({id: 'a'});
      var b = new Entity({id: 'b'});

      e.addEntity(a);
      e.addEntity(b);

      chai.assert.equal(e.entities.a, a);
      chai.assert.equal(e.entities.b, b);
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
        w: 50, h: 50, x: 300, y:300, id: 1,
        color: 0xFFFF00, shape: 'rect'
      });
      e.addEntity(ent);

      var ent2 = new (Entity.implement([DisplayObject, Shape]))({
        w: 50, h: 50, x: 200, y:200, id: 2,
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

    it('Remove Entity', function() {
      var e = new Environment({
        width: 100, height: 100
      });
      e.stage = {
        addChild: function() {},
        removeChild: function() {}
      };
      var a = new Entity({id: 'a'});
      var b = new Entity({id: 'b', displayObject: {}});

      e.addEntity(a);
      e.addEntity(b);

      chai.assert.equal(e.entities.a, a);
      chai.assert.equal(e.entities.b, b);

      e.removeEntity(a);

      chai.assert.equal(e.entities.a, undefined);
      chai.assert.equal(e.entities.b, b);

      e.removeEntity(b.id);

      chai.assert.equal(e.entities.a, undefined);
      chai.assert.equal(e.entities.b, undefined);
    });

    it('Bind Game', function() {
      var e = new Environment({id: 'e'});
      var a = new Entity({id: 'a'});
      e.addEntity(a);
      var game = {};
      e._bindGame(game);
      chai.assert.equal(game, a.game);
    });

    it('Sync Message', function() {
      var e = new Environment();
      var a = new Entity({id: 'a', sync: true});
      var b = new Entity({id: 'b'});
      e.addEntity(a);
      e.addEntity(b);
      var msg = e._getSyncMessage();
      chai.assert.equal(msg.length, 1);
      chai.assert.equal(msg[0].id, 'a');
    });

    it('Sync', function() {
      var e = new Environment({game: {clientID: 1337}});
      var a = new Entity({id: 'a', clientID: 1337});
      var b = new Entity({id: 'b', clientID: 1338});
      var c = new Entity({id: 'c', clientID: 1338});

      e.addEntity(a);
      e.addEntity(b);

      var msg = [a.serialize(), b.serialize(), c.serialize()];
      msg[0].x = 50;
      msg[1].x = 50;

      chai.assert.isDefined(e.entities.a);
      chai.assert.equal(e.entities.b.x, 0);
      chai.assert.isUndefined(e.entities.c);

      e._sync(msg);

      chai.assert.equal(a.x, 0);
      chai.assert.equal(b.x, 50);
      chai.assert.isDefined(e.entities.c);
    });
  });
});
