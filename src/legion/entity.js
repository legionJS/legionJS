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

    // Current x/y acceleration in pixels/second
    ax: 0,
    ay: 0,

    /*
      _update() is called once each frame to update the entity.
    */
    _update: function() {
      this.x += (this.vx * this.game.delta / 1000) +
        0.5 * this.ax * ((this.game.delta / 1000) * (this.game.delta / 1000));
      this.y += (this.vy * this.game.delta / 1000) +
        0.5 * this.ay * ((this.game.delta / 1000) * (this.game.delta / 1000));
    },

    setVelocity: function(vx, vy, ax, ay) {
      if (Array.isArray(vx)) {
        ay = vx[3];
        ax = vx[2];
        vy = vx[1];
        vx = vx[0];
      }

      this.vx = vx;
      this.vy = vy;
      this.ax = ax;
      this.ay = ay;
    }
  });
});
