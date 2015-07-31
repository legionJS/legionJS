define([
  'legion',
  'legion/entity'
], function(legion, Entity) {
  describe('Entity', function() {
    it('Create Entity', function() {
      var a = new Entity();
    });

    it('Create Entity with parameters', function() {
      var a = new Entity({a: 'a'});
      chai.assert.equal(a.a, 'a');
    });

    it('Add function as parameter', function() {
      var a = new Entity({
        a: function(){ return 'a'; }
      });

      chai.assert.equal(a.a(), 'a');
    });

    it('Don\'t override parent function by default', function() {
      var A = Entity.extend({
        a: function() { return 'a'; }
      });

      var a = new A({
        a: function(){ return 'b'; }
      });

      chai.assert.equal(a.a(), 'a');
    });

    it('Override function with mixin and safe==false', function() {
      var A = Entity.extend({
        a: function() { return 'a'; }
      });

      var a = new A().mixin({
        a: function(){ return 'b'; }
      }, false);

      chai.assert.equal(a.a(), 'b');
    });

    it('Set Velocity along with Acceleration', function() {
      var a = new Entity();

      a.setVelocity(10, 20, 10, 20);
      chai.assert.equal(a.vx, 10);
      chai.assert.equal(a.vy, 20);
      chai.assert.equal(a.ax, 10);
      chai.assert.equal(a.ay, 20);

      a.setVelocity(15, 30);
      chai.assert.equal(a.vx, 15);
      chai.assert.equal(a.vy, 30);
      chai.assert.equal(a.ax, 10);
      chai.assert.equal(a.ay, 20);

      a.setVelocity([100, 200, 100, 200]);
      chai.assert.equal(a.vx, 100);
      chai.assert.equal(a.vy, 200);
      chai.assert.equal(a.ax, 100);
      chai.assert.equal(a.ay, 200);

      a.setVelocity({vx: 10, vy: 20, ax: 15, ay: 20});
      chai.assert.equal(a.vx, 10);
      chai.assert.equal(a.vy, 20);
      chai.assert.equal(a.ax, 15);
      chai.assert.equal(a.ay, 20);

      a.setVelocity(undefined, undefined, 10, 10);
      chai.assert.equal(a.vx, a.vx);
      chai.assert.equal(a.vy, a.vy);
      chai.assert.equal(a.ax, 10);
      chai.assert.equal(a.ay, 10);
    });

    it('Serialize', function() {
      var props = {
        x: 1, y: 2, w: 3, h: 4,
        vx: 5, vy: 6, ax: 7, ay: 8,
        id: 9, clientID: 10,
        className: 'Entity'
      };

      var a = new Entity(props);
      var s = a.serialize();

      chai.assert.deepEqual(props, s);
    });
  });
});
