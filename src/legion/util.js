'use strict';

define(function() {
  return {
    hitch: function(_this, f) {
      return f.bind(_this);
    }
  };
});
