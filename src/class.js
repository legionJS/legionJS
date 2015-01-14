var createParent = function(childFunction, parentFunction) {	
	return function() {
		var tmp = this.parent;
		this.parent = parentFunction;
		var returnValue = childFunction.apply(this, arguments);
		this.parent = tmp;
		return returnValue;
	};
};

var extend = function(c) {
	if (c instanceof Array) {
		var _this = this;
		for (var i = 0; i < c.length; i++) {
			_this = _this.extendSingle(c[i]);
		}
		return _this;
	} else {
		return this.extendSingle(c);
	}
};

var extendSingle = (function(){
	var extending;
	return function(c) {
		
		var Class = function() {
			if (!extending) {
				this.init.apply(this, arguments);
			}
		};

		Class.prototype.init = function() {};

		if (typeof c == "function") {
			extending = true;
			c = new c();
			extending = false;
		} 

		if (typeof c == "object") {
			extending = true;
			Class.prototype = new this();
			extending = false;

			for (var key in c) {
				if (typeof c[key] == "function") {
					Class.prototype[key] = createParent(c[key], Class.prototype[key]);
				} else {
					Class.prototype[key] = c[key];
				}
			}
		}

		Class.extend = extend;
		Class.extendSingle = extendSingle;
		return Class;
	};
})();

var Class = extendSingle.apply(function(){}, {});