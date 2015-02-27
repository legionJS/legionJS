'use strict';

/*
  Entity is the base class for any game objects.
*/
define(['legion/class'], function(Class) {
  return Class.extend({

    // Current x/y pos
    x: 0,
    y: 0,

    // Width/height of the entity/rectangular bounding box.
    w: 0,
    h: 0,

    // Current x/y velocity in pixels/second
    vx: 0,
    vy: 0,

    /*
      _update() is called once each frame to update the entity.
    */
    _update: function() {
      this.x += this.vx * this.game.delta / 1000;
      this.y += this.vy * this.game.delta / 1000;
    },

    setVelocity: function(vx, vy) {
      if (Array.isArray(vx)) {
        vy = vx[1];
        vx = vx[0];
      }

      this.vx = vx;
      this.vy = vy;
    }
  });
});
