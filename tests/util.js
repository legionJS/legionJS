define([
  'legion',
  'legion/util'
], function(legion, Util) {

  describe('Util', function() {
    it('hitch', function() {
      Util.hitch({a:'a'}, function() {
        chai.assert.equal(this.a, 'a');
      })();
    });
  });
});