'use strict';

/**
 * @classdesc The basic legion game object.  All interactable things in the
 * game are entities - players bullets, platforms, etc.
 * @param  {object} - properties an object of properties to mixin
 * @class Entity
 * @extends Class
 */
define(['legion/class'], function(Class) {
  return Class.extend(
  /** @lends Entity# */
  {
    /**
     * The class name, 'Entity'
     * @type {String}
     * @default 'Entity'
     * @readonly
     */
    className: 'Entity',

    /**
     * The current x position in pixels
     * @type {Number}
     * @default 0
     */
    x: 0,

    /**
     * The current y position in pixels
     * @type {Number}
     * @default 0
     */
    y: 0,

    /**
     * The width of the entity/rectangular bounding box.
     * @type {Number}
     * @default 0
     */
    w: 0,

    /**
     * The height of the entity/rectangular bounding box.
     * @type {Number}
     * @default 0
     */
    h: 0,

    /**
     * The x velocity in pixels per second
     * @type {Number}
     * @default 0
     */
    vx: 0,

    /**
     * The y velocity in pixels per second
     * @type {Number}
     * @default 0
     */
    vy: 0,

    /**
     * The x acceleration in pixels per second
     * @type {Number}
     * @default 0
     */
    ax: 0,

    /**
     * The y acceleration in pixels per second
     * @type {Number}
     * @default 0
     */
    ay: 0,

    /**
     * Whether an entity should be synced.  Determines whether the game
     * will put the entity in the message it sends from the client
     * to the server or vice-versa.  Might be true on either the client
     * or the server, or both, or neither.
     * @type {Boolean}
     * @default false
     */
    sync: false,

    /**
     * _update() is called once each frame to update the entity's position
     * and velocity.
     * @private
     */
    _update: function() {
      this.vx += this.ax * this.game.delta / 1000;
      this.vy += this.ay * this.game.delta / 1000;
      this.x += this.vx * this.game.delta / 1000;
      this.y += this.vy * this.game.delta / 1000;
    },

    /**
     * Sets the velocity and acceleration of the entity.
     *
     * Can either set as up to four arguments, an array of up to four numbers
     * or an object with properties vx, vy, ax, ay.
     *
     * Any of the numbers not provided will remain unchanged.
     *
     * @param  {Number|Number[]|Object} vx - Either a number to set x velocity
     *   to, or an array of numbers in the order [vx, vy, ax, ay] or an object
     *   with properties vx, vy, ax, ay.
     * @param  {Number} [vy] - A number to set y velocity to
     * @param  {Number} [ax] - A number to set x acceleration to
     * @param  {Number} [ay] - A number to set y acceleration to
     *
     * @example
     *
     * // Set x velocity to 1
     * o.setVelocity(1);
     *
     * // Set x velocity to 1 and y velocity to 2 with an array
     * o.setVelocity([1, 2]);
     *
     * // Set x velocity to 1, y velocity to 2, x acceleration to 3 and y
     * // acceleration to 4
     * o.setVelocity(1, 2, 3, 4);
     *
     * // Just set y acceleration to 4 using an object
     * o.setVelocity({ay: 4});
     *
     * // Just set x acceleration to 3
     * o.setVelocity(null, null, 3);
     */
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

    /**
     * serialize() returns a serializable representation of the entity in the
     * format:
     *
     * <pre>
     * {
     *   id: id,
     *   clientID: clientID,
     *   className: className,
     *   x: x,
     *   y: y,
     *   w: w,
     *   h: h,
     *   vx: vx,
     *   vy: vy,
     *   ax: ax,
     *   ay: ay
     * }
     *</pre>
     *
     * @return {object} The object representation
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
