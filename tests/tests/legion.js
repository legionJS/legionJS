define([
  'legion'
], function(legion) {

  describe('Legion Core', function() {
    it('init', function() {
      legion.init(100,100);
    });

    it('log', function() {
      legion.debug = true;
      legion.log('Error Message');
      legion.debug = false;
    });
  });
});
