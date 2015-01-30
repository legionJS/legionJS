define(['legion/class'], function(Class) {
  return Class.extend({

    // Width of the environment in pixels, default 0
    width: 0,

    // Height of the environment in pixels, default 0
    height: 0,

    // Array of entities in the environment, default []
    entities: [],

    /*
      init()

      @param {object} properties 
    */
    init: function(properties) {
      properties = typeof properties !== 'undefined' ? properties : {};
      this.parent(properties);
    },

    /*
      addEntity() adds the entity to the environment.

      @param {object} entity
    */
    addEntity: function(entity) {
      this.entities.push(entity);
    }
  });
});
