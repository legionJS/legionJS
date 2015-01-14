define(function() {

  /*
    createParent() returns a function that calls childFunction with 
    parentFunction added as "this.parent" to the scope of childFunction.

    @param {function} childFunction - the function to call
    @param {function} parentFunction - the function to add as this.parent

    @return {function}
  */
  var createParent = function(childFunction, parentFunction) {  
    return function() {

      // Save this.parent as a temporary variable in case parent functions are
      // being called recursively. Then assign parentFunction to function.
      var tmp = this.parent;
      this.parent = parentFunction;

      // Call childFunction
      var returnValue = childFunction.apply(this, arguments);

      // Restor the old parent
      this.parent = tmp;

      return returnValue;
    };
  };

  /*
    extend() extends the current Class with child and returns the new Class.
    Uses extendSingle to do the work of extending.

    @param {array, object, function} child - child can either be an object, 
      a function or an array of objects and/or functions.  If it is an object
      it's properties are added to the current class; if it is a function a new
      instance is created and it's properties are added to the current class;
      and if it is an array each element is handled in the above manner.

    @return {function} - Returns a new class with this extended by child.
  */
  var extend = function(child) {

    // If child is an array then call _extendSingle repeatedly for each element.
    if (child instanceof Array) {
      var _this = this;
      for (var i = 0; i < child.length; i++) {
        _this = _this.extendSingle(child[i]);
      }
      return _this;
    } else {
      return this.extendSingle(child);
    }
  };

  /*
    extendSingle() extends the current class by a child class.
    It is defined inside an anonymous functiont to create a closure for the 
    "extending" variable.

    @param {object, function} child - child to extend the current Class with.

    @return {function} - Returns a new class extended by child.
  */
  var extendSingle = (function(){

    /*
      A variable that is used to keep track of whether the extendSingle
      function is currently being called.  Needed to not call the init 
      function when creating a new instance of classes during extension.
    */
    var extending;

    return function(child) {
      
      // Base Class definition
      var Class = function() {

        // "init" is used as the constructor for Classes so don't
        // call it when we are in extendSingle.
        if (!extending) {
          this.init.apply(this, arguments);
        }
      };

      //Class.prototype.init = function() {};
      Class.extend = extend;
      Class.extendSingle = extendSingle;

      // If child is a function, reassign child to an instance of itself.
      if (typeof child == "function") {
        extending = true;
        child = new child();
        extending = false;
      } 
      
      extending = true;
      Class.prototype = new this();
      extending = false;

      // Assign properties of the child to the new class.
      for (var key in child) {

        // If the property is a function call with this.parent assigned.
        if (typeof child[key] == "function" && 
            typeof Class.prototype[key] == "function") {
          Class.prototype[key] = createParent(child[key], Class.prototype[key]);
        } else {
          Class.prototype[key] = child[key];
        }
      }
      
      return Class;
    };
  })();

  // Return the base instance of Class
  return extendSingle.call(function(){}, {init: function(){}});
});
