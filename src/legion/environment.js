'use strict';

define(['legion/class'], function(Class) {
  var Environment = Class.extend(
  /** @lends Environment */
  {

    /**
     * The class name, 'Environment'
     * @type {String}
     */
    className: 'Environment',

    /**
     * Width of the environment in pixels.
     * @type {Number}
     * @default 0
     */
    width: 0,

    /**
     * Height of the environment in pixels.
     * @type {Number}
     * @default 0
     */
    height: 0,

    /**
     * Map of entities in the environment with the entity IDs as the keys.
     * @type {object}
     * @default null
     */
    entities: null,

    /**
     * A solid background color for the environment.
     * @type {Number}
     * @default 0x000000
     */
    backgroundColor: 0x000000,

    /**
     * Initialize the environment
     * @constructs Environment
     * @param  {object} properties - object of properties to mixin
     * @classdesc Environments are the game world or levels.
     */
    init: function(properties) {
      //Why was this here?
      //properties = typeof properties !== 'undefined' ? properties : {};
      this.entities = {};
      //this.entityMap = {};
      this.parent(properties);
    },

    /**
     * Add an entity to the environment and bind the game to the entity.
     *
     * @param  {Entity} entity - The entity to add to the environment.
     */
    addEntity: function(entity) {
      entity._bindGame(this.game);
      this.entities[entity.id] = entity;
    },

    /**
     * Remove an entity from the environment by passing in the entity or
     * it's ID.
     *
     * @param  {Entity|Number|String} entityID - the ID of the entity to remove.
     * @return {Entity} - Return the removed entity.
     */
    removeEntity: function(entityID) {
      // If the entity is passed in get its id
      if (entityID instanceof Class) {
        entityID = entityID.id;
      }

      var entity = this.entities[entityID];

      this.entities[entityID] = undefined;

      return entity;
    },

    /**
     * forEachEntity calls a function for each entity in the environment.  The
     * function is passed an entity.
     *
     * @param  {function} func - A function to execute on each entity.
     * @example
     *
     * // Log each entity ID
     * env.forEachEntity(function(entity) {
     * 	console.log(entity.id);
     * });
     */
    forEachEntity: function(func) {
      for (var id in this.entities) {
        if (this.entities.hasOwnProperty(id) &&
          this.entities[id] !== undefined) {
          func(this.entities[id]);
        }
      }
    },

    /**
     * _update() is called once each frame and calls _update() for all the
     * entites inside it.
     * @private
     */
    _update: function() {
      this.forEachEntity(function(entity) {
        entity._update();
      });
    },

    /**
     * Binds a game to the environment and then binds the game to any entities
     * already inside the environment.
     *
     * @param  {Game} game - the game to bind
     * @private
     */
    _bindGame: function(game) {
      this.parent(game);
      this.forEachEntity(function(entity) {
        entity._bindGame(game);
      });
    },

    /**
     * Returns a serializable object representing the state of the syncable
     * entities inside the environment.
     *
     * @return {object[]} - an array of entity representations
     * @private
     */
    _getSyncMessage: function() {
      var message = [];
      this.forEachEntity(function(entity) {
        if (entity.sync) {
          message.push(entity.serialize());
        }
      });
      return message;
    },

    /**
     * _sync() takes a remote message (if this is the server, from clients, and
     * if this is a client, from the server) and updates the environment with
     * the properties in the message.
     *
     * @param  {object[]} entities - an array of serialized entities.
     * @private
     */
    _sync: function(entities) {
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        //If the entity is new to the client/server.
        if (this.entities[entity.id] === undefined) {
          this.addEntity(new legion._classes[entity.className](entity));
          //this.entities.push(entity);
        } else {
          // Don't override local copy with servers if it's the player's entity.
          if (!this.game.clientID || this.game.clientID !== entity.clientID) {
            this.entities[entity.id].mixin(entity);
          }
        }
      }
    },
  });

  // On node return an environment without rendering
  if (legion.isNode) {
    return Environment;
  } else {

    // Return an environment with rendering
    return Environment.extend({

      // PIXI stage
      stage: null,

      init: function(properties) {
        //properties = typeof properties !== 'undefined' ? properties : {};
        this.parent(properties);

        this.stage = new PIXI.Stage(this.backgroundColor);
      },

      addEntity: function(entity) {
        this.parent(entity);

        if ('displayObject' in entity) {
          this.stage.addChild(entity.displayObject);
        }
      },

      removeEntity: function(entityID) {
        var entity = this.parent(entityID);

        if ('displayObject' in entity) {
          this.stage.removeChild(entity.displayObject);
        }

        return entity;
      },

      _render: function() {
        legion._renderer.render(this.stage);
      }

    });
  }
});
