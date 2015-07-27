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
      this.vx += this.ax * this.game.delta / 1000;
      this.vy += this.ay * this.game.delta / 1000;
      this.x += this.vx * this.game.delta / 1000;
      this.y += this.vy * this.game.delta / 1000;
    },

    setVelocity: function(vx, vy, ax, ay) {
      if (Array.isArray(vx)) {
        ay = vx[3];
        ax = vx[2];
        vy = vx[1];
        vx = vx[0];
      } else if (typeof vx === 'object') {
        ay = vx.ay;
        ax = vx.ax;
        vy = vx.vy;
        vx = vx.vx;
      }

      this.vx = vx === null || vx === undefined ? this.vx : vx;
      this.vy = vy === null || vy === undefined ? this.vy : vy;
      this.ax = ax === null || ax === undefined ? this.ax : ax;
      this.ay = ay === null || ay === undefined ? this.ay : ay;
    }
  });
});
