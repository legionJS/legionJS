'use strict';

/*
  Entity is the base class for any game objects.
*/
define(['legion/class'], function(Class) {
  return Class.extend({

    className: 'Entity',

    // Current x/y pos
    x: 0,
    y: 0,

    // Width/height of the entity/rectangular bounding box.
    w: 0,
    h: 0,

    // Current x/y velocity in pixels/second
    vx: 0,
    vy: 0,

    // Whether an entity should be synced.  Determines whether the game
    // will put the entity in the message it sends from the client
    // to the server or vice-versa.  Might be true on either the client
    // or the server, or both, or neither.  Defaults to false.
    sync: false,

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
      } else if (vx && typeof vx === 'object') {
        ay = vx.ay;
        ax = vx.ax;
        vy = vx.vy;
        vx = vx.vx;
      }

      this.vx = vx === null || vx === undefined ? this.vx : vx;
      this.vy = vy === null || vy === undefined ? this.vy : vy;
      this.ax = ax === null || ax === undefined ? this.ax : ax;
      this.ay = ay === null || ay === undefined ? this.ay : ay;
    },

    /*
      serialize() returns a serializable object of the format:

      {
        id: id,
        x: x,
        y: y,
        w: w,
        h: h,
        vx: vx,
        vy: vy,
        ax: ax,
        ay: ay
      }

      @return {object}
    */
    serialize: function() {
      var obj = this.parent();
      obj.x = this.x;
      obj.y = this.y;
      obj.w = this.w;
      obj.h = this.h;
      obj.vx = this.vx;
      obj.vy = this.vy;
      obj.ax = this.ax;
      obj.ay = this.ay;
      return obj;
    }
  });
});
