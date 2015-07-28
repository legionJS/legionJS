'use strict';

define(['legion/class'], function(Class) {
  var Event = Class.extend(
  /** @lends Event# */
  {
    /**
     * An object of events where the keys are the event names and the values
     * are arrays of callback functions.
     * @type {object}
     * @private
     * @default null
     */
    _events: null,

    /**
     * A queue of events that have been triggered. An array of the event
     * callbacks with the arguments passed to the event trigger.
     * @type {array}
     * @private
     * @default null
     */
    _queue: null,

    /**
     * Initialize the event object.
     * @constructs Event
     * @param  {object} properties - an object of properties to mixin
     * @classdesc Manages events.  Each instance of Event is distinct, with
     *            it's own events and triggers.  {@link Game} objects containing
     *            and instance of Event at game.event.
     */
    init: function(properties) {
      this.parent(properties);

      this._events = {};
      this._queue = [];
    },

    /*
      on(event, callback) subscribes a callback to a particular event.
    */

    /**
     * Subscribes to an event so that whenever that event is triggered the
     * callback will be called.  Multiple callbacks can be created on the same
     * event.
     *
     * @param  {String}   event - The event name
     * @param  {Function} callback - The function to be called on the event
     * @example
     *
     * //Log the name whenever a player Dies
     * event.on('die', function(player) {
     * 	console.log(player.name);
     * });
     */
    on: function(event, callback) {
      this._initializeEvent(event);
      this._events[event].push(callback);
    },

    /*
      trigger(event) triggers an event and adds all the callbacks to a queue
      to be processed at the end of the current frame.
    */

    /**
     * Triggers an event, adding any callbacks created with on to a queue to be
     * processed.  trigger doesn't call the callbacks itself, they are only
     * processed when [_resolveEventQueue]{@link Event#_resolveEventQueue} is
     * called.  In [Game._update]{@link Game#_update}
     * event triggers are resolved synchronously once each frame.
     *
     * @param  {String} event - event name
     * @param  {Array} parameters - an array of parameters that should be passed
     *                            to the callback functions.
     * @example
     *
     * event.trigger('die', [player]);
     */
    trigger: function(event, parameters) {
      this._initializeEvent(event);
      this._queue.push([this._events[event], parameters]);
    },

    /*
      _resolveEventQueue() resolves all the outstanding events in the queue.
    */

    /**
     * Resolves all outstanding events on the event queue.  Any events triggered
     * by the callbacks won't be resolved until the next call to
     * _resolveEventQueue.
     *
     * @private
     */
    _resolveEventQueue: function() {
      // Transfer to a temp queue and process that so new events triggered will
      // be resolved next frame.
      var tempQueue = this._queue;
      this._queue = [];
      while (tempQueue.length > 0) {
        var event = tempQueue.pop();
        for (var i = 0; i < event[0].length; i++) {
          //event[0][i].apply(null, event[1]);
          event[0][i].apply(null, event[1]);
        }
      }
    },

    /**
     * _initialzeEvent(event) creates an entry for the event in the _events
     * object if it doesn't already exist.
     *
     * @param {String} event - the name of the event
     * @private
    */
    _initializeEvent: function(event) {
      if (!(event in this._events)) {
        this._events[event] = [];
      }
    }
  });

  return Event;
});
