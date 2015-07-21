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

    // Whether this object should be synced from the client to the server
    // or vice-versa.  Either 'up' or 'down'.  Each object should only be
    // 'up' on at most a single client.
    syncDirection: 'down',

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
        vy: vy
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
      return obj;
    }
  });
});
