define([
  'legion',
  'legion/class'
], function(legion, Class) {

  describe('Class', function() {
    it('Single inheritance', function() {
      console.dir(Class)
      var A = Class.extend({a: 'a'});
      var B = A.extend({b: 'b'});

      var b = new B();

      chai.assert.equal(b.a, 'a');
      chai.assert.equal(b.b, 'b');

      chai.assert(b instanceof Class);
      chai.assert(b instanceof A);
      chai.assert(b instanceof B);
    });

    it('Multiple inheritance', function() {
      var A = Class.extend({a: 'a'});
      var B = Class.extend({b: 'b'});
      var C = Class.extend({c: 'c'});

      var ABC = Class.implement([A, B, C]);

      var abc = new ABC();

      chai.assert.equal(abc.a, 'a');
      chai.assert.equal(abc.b, 'b');
      chai.assert.equal(abc.c, 'c');

      chai.assert(abc instanceof Class);
      chai.assert(abc instanceof ABC);
    });

    it('Multiple inheritance #2', function() {
      var A = Class.extend({a: 'a'});
      var B = Class.extend({b: 'b'});
      var C = Class.extend({c: 'c'});

      var ABC = A.implement([B, C]);

      var abc = new ABC();

      chai.assert.equal(abc.a, 'a');
      chai.assert.equal(abc.b, 'b');
      chai.assert.equal(abc.c, 'c');

      chai.assert(abc instanceof Class);
      chai.assert(abc instanceof A);
      chai.assert(abc instanceof ABC);
    });

    it('Multiple inheritance #3', function() {
      var A = Class.extend({a: 'a'});
      var B = Class.extend({b: 'b'});

      var ABC = A.implement([B, {c: 'c'}]);

      var abc = new ABC();

      chai.assert.equal(abc.a, 'a');
      chai.assert.equal(abc.b, 'b');
      chai.assert.equal(abc.c, 'c');

      chai.assert(abc instanceof Class);
      chai.assert(abc instanceof A);
      chai.assert(abc instanceof ABC);
    });

    it('Multiple inheritance #4', function() {
      var ABC = Class.implement([
        {a: 'a'}, {b: 'b'}, {c: 'c'}
      ]);

      var abc = new ABC();

      chai.assert.equal(abc.a, 'a');
      chai.assert.equal(abc.b, 'b');
      chai.assert.equal(abc.c, 'c');

      chai.assert(abc instanceof Class);
      chai.assert(abc instanceof ABC);
    });

    it('Chaining extend/implement', function() {
      var A;
      var ABC = (A = Class.extend({a: 'a'})).implement([
        {b: 'b'}, {c: 'c'}
      ]);

      var abc = new ABC();

      chai.assert.equal(abc.a, 'a');
      chai.assert.equal(abc.b, 'b');
      chai.assert.equal(abc.c, 'c');

      chai.assert(abc instanceof Class);
      chai.assert(abc instanceof A);
      chai.assert(abc instanceof ABC);
    });

    it('Parent functions', function() {
      var A = Class.extend({
        str: function() {
          return 'a';
        }
      });

      var B = A.extend({
        str: function() {
          return this.parent() + 'b';
        }
      });

      var b = new B();

      chai.assert.equal(b.str(), 'ab');

      var C = B.extend({
        str: function() {
          return this.parent() + 'c';
        }
      });

      var c = new C();

      chai.assert.equal(c.str(), 'abc');
    });

    it('Parent functions with implement', function() {
      var A = Class.extend({
        str: function() {
          return 'a';
        }
      });

      var B = {
        str: function() {
          return this.parent() + 'b';
        }
      };

      var C = {
        str: function() {
          return this.parent() + 'c';
        }
      };

      var ABC = A.implement([B, C]);
      var abc = new ABC();

      chai.assert.equal(abc.str(), 'abc');
    });

    it('Init function', function() {
      var A = Class.extend({
        init: function(letter) {
          this.letter = letter;
        }
      });

      var a = new A('a');

      chai.assert.equal(a.letter, 'a');
    });

    it('Init + Parent', function() {
      var A = Class.extend({
        init: function(letter) {
          this.letter = letter;
        }
      });

      var B = A.extend({
        init: function(letter) {
          this.parent(letter + 'b');
        }
      });

      var ab = new B('a');

      chai.assert.equal(ab.letter, 'ab');
    });
  });
});
