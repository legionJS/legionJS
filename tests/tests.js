// tests.js
describe('Class', function() {
  describe('Inheritance', function() {
    it('Single inheritance', function() {
      var A = legion.Class.extend({a: "a"});
      var B = A.extend({b: "b"});

      var b = new B();

      chai.assert.equal(b.a, "a");
      chai.assert.equal(b.b, "b");
    });

    it('Multiple inheritance', function() {
      var A = legion.Class.extend({a: "a"});
      var B = legion.Class.extend({b: "b"});
      var C = legion.Class.extend({c: "c"});

      var ABC = legion.Class.extend([A, B, C]);

      var abc = new ABC();

      chai.assert.equal(abc.a, "a");
      chai.assert.equal(abc.b, "b");
      chai.assert.equal(abc.c, "c");
    });

    it('Multiple inheritance #2', function() {
      var A = legion.Class.extend({a: "a"});
      var B = legion.Class.extend({b: "b"});
      var C = legion.Class.extend({c: "c"});

      var ABC = A.extend([B, C]);

      var abc = new ABC();

      chai.assert.equal(abc.a, "a");
      chai.assert.equal(abc.b, "b");
      chai.assert.equal(abc.c, "c");
    });

    it('Multiple inheritance #3', function() {
      var A = legion.Class.extend({a: "a"});
      var B = legion.Class.extend({b: "b"});

      var ABC = A.extend([B, {c: "c"}]);

      var abc = new ABC();

      chai.assert.equal(abc.a, "a");
      chai.assert.equal(abc.b, "b");
      chai.assert.equal(abc.c, "c");
    });

    it('Multiple inheritance #4', function() {
      var ABC = legion.Class.extend([
        {a: "a"}, {b: "b"}, {c: "c"}
      ]);

      var abc = new ABC();

      chai.assert.equal(abc.a, "a");
      chai.assert.equal(abc.b, "b");
      chai.assert.equal(abc.c, "c");
    });

    it('Parent functions', function() {
      var A = legion.Class.extend({
        str: function() {
          return "a";
        }
      });

      var B = A.extend({
        str: function() {
          return this.parent() + "b";
        }
      });

      var b = new B();

      chai.assert.equal(b.str(), "ab");

      var C = B.extend({
        str: function() {
          return this.parent() + "c";
        }
      });

      var c = new C();

      chai.assert.equal(c.str(), "abc");
    });

    it('Init function', function() {
      var A = legion.Class.extend({
        init: function(letter) {
          this.letter = letter;
        }
      });

      var a = new A("a");

      chai.assert.equal(a.letter, "a");
    });

    it('Init + Parent', function() {
      var A = legion.Class.extend({
        init: function(letter) {
          this.letter = letter;
        }
      });

      var B = A.extend({
        init: function(letter) {
          this.parent(letter + "b");
        }
      });

      var ab = new B("a");

      chai.assert.equal(ab.letter, "ab");
    });
  });
});