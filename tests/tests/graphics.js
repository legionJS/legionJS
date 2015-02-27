define([
  'legion',
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/graphics/shape'
], function(legion, Entity, DisplayObject, Shape) {

  describe('Graphics', function() {
    it('DisplayObject', function() {
      var RawDisplayEntity = Entity.implement(DisplayObject);
      var ent = new RawDisplayEntity({
        x: 150, y: 150, displayObject: {x: 0, y:0},
        game: {delta: 1}
      });
      ent._update();

      if (!legion.isNode) {
        chai.assert.equal(ent.x, ent.displayObject.x);
        chai.assert.equal(ent.y, ent.displayObject.y);
      }
    });

    it('Square', function() {
      var ShapeEntity = Entity.implement([DisplayObject, Shape]);

      var square = new ShapeEntity({
        w: 50, h: 50, x: 300, y:300,
        color: 0xFFFF00, shape: 'rect',
        game: {delta: 1}
      });

      square._update();

      if (!legion.isNode) {
        chai.assert(square.displayObject);
        chai.assert.equal(square.x, square.displayObject.x);
        chai.assert.equal(square.y, square.displayObject.y);
      }
    });

    it('Circle', function() {
      var ShapeEntity = Entity.implement([DisplayObject, Shape]);

      var circle = new ShapeEntity({
        x: 300, y:300, r: 50,
        color: 0xFFFF00, shape: 'circle',
        game: {delta: 1}
      });

      circle._update();

      chai.assert.equal(circle.w, circle.r*2);
      chai.assert.equal(circle.h, circle.r*2);

      if (!legion.isNode) {
        chai.assert(circle.displayObject);
        chai.assert.equal(circle.x, circle.displayObject.x);
        chai.assert.equal(circle.y, circle.displayObject.y);
      }
    });
  });
});
