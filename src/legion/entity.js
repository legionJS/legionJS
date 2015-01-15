/*
  Entity is the base class for any game objects.
*/
define(['legion/class', 'legion/strings'], function(Class, strings) {
  return Class.extend({

    /*
      init() takes an object of properties and adds them to the Entity.  

      @param {object} properties 
    */
    init: function(properties) {
      this.mixin(properties, true);
      this.parent(properties);
    },

    /*
      mixin() adds the properties in properties to this entity.  By default
      it will not override existing functions with functions included in the
      properties object because this will not maintain this.parent().
      It is recommended to use extend or implement in order to add new 
      functions.  This behavior can be overridden by passing false to the
      safe parameter.

      @param {object} properties
      @param {boolean} safe
      @return {object} this
    */
    mixin: function(properties, safe) {
      for (var key in properties) {

        //Check if it's overriding a function and if using safe mode
        if (typeof properties[key] !== 'function' || !(key in this) || !safe) {
          this[key] = properties[key];
        } else {
          legion.log(strings[legion.locale]['unsafe_mixin']);
        }
      }
      return this;
    }
  });
});
