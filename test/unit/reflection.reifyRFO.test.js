var test = require('tape');
var reifyRFO = require('./../../src/reflection/reifyRFO');

test('reflection.reifyRFO', function(t) {
  var specs = [
    // named standard function
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: '_foobar',
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function _foobar(a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: '_foobar',
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function _foobar(a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: '_foobar',
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function _foobar(a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: '_foobar',
          params: ['a', 'b', 'c'],
          body: '  /** hyasdf\\n  yaya\\n  */return 123; // thingy'
        }
      },
      'function _foobar(a, b, c) {\n    /** hyasdf\\n  yaya\\n  */return 123; // thingy\n}'
    ],

    // anonymous standard function
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  /** hyasdf\\n  yaya\\n  */return 123; // thingy'
        }
      },
      'function (a, b, c) {\n    /** hyasdf\\n  yaya\\n  */return 123; // thingy\n}'
    ],

    // anonymous standard function
    [
      {
        __function: {
          type: 'FunctionExpression',
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          params: ['a', 'b', 'c'],
          body: '  /** hyasdf\\n  yaya\\n  */return 123; // thingy'
        }
      },
      'function (a, b, c) {\n    /** hyasdf\\n  yaya\\n  */return 123; // thingy\n}'
    ],

    // anonymous standard function
    [
      { __function: { params: ['a', 'b', 'c'], body: '  return 123;' } },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      { __function: { params: ['a', 'b', 'c'], body: '  return 123;' } },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      { __function: { params: ['a', 'b', 'c'], body: '  return 123;' } },
      'function (a, b, c) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          params: ['a', 'b', 'c'],
          body: '  /** hyasdf\\n  yaya\\n  */return 123; // thingy'
        }
      },
      'function (a, b, c) {\n    /** hyasdf\\n  yaya\\n  */return 123; // thingy\n}'
    ],

    // anonymous arrow function with braced body
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      '(a, b, c) => {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      '(a, b, c) => {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  return 123;'
        }
      },
      '(a, b, c) => {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: ['a', 'b', 'c'],
          body: '  /** hyasdf\\n  yaya\\n  */return 123; // thingy'
        }
      },
      '(a, b, c) => {\n    /** hyasdf\\n  yaya\\n  */return 123; // thingy\n}'
    ],

    // standard with argument object destructuring
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: [{ a: 'a', b: 'b', c: 'c' }],
          body: '  return 123;'
        }
      },
      'function ({ a, b, c }) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: [{ a: 'a', b: 'b', c: { d: 'd', e: 'e' } }],
          body: '  return 123;'
        }
      },
      'function ({ a, b, c: { d, e } }) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: [{ a: 'a', b: 'b', c: ['d', 'e'] }],
          body: '  return 123;'
        }
      },
      'function ({ a, b, c: [ d, e ] }) {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'FunctionExpression',
          name: null,
          params: [
            { a: 'a', b: 'b', c: ['d', 'e'] },
            {
              f: 'f',
              z: ['g', 'h'],
              i: 'i',
              j: 'j',
              k: { l: 'l', m: { n: 'n', o: 'o' } }
            },
            { __rest: 'args' }
          ],
          body: '  return 123;'
        }
      },
      'function ({ a, b, c: [ d, e ] }, { f, z: [ g, h ], i, j, k: { l, m: { n, o } } }, ...args) {\n    return 123;\n}'
    ],

    // // arrow with argument object destructuring
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: [{ a: 'a', b: 'b', c: 'c' }],
          body: '  return 123;'
        }
      },
      '({ a, b, c }) => {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: [{ a: 'a', b: 'b', c: { d: 'd', e: 'e' } }],
          body: '  return 123;'
        }
      },
      '({ a, b, c: { d, e } }) => {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: [{ a: 'a', b: 'b', c: ['d', 'e'] }],
          body: '  return 123;'
        }
      },
      '({ a, b, c: [ d, e ] }) => {\n    return 123;\n}'
    ],
    [
      {
        __function: {
          type: 'ArrowFunctionExpression',
          name: null,
          params: [
            { a: 'a', b: 'b', c: ['d', 'e'] },
            {
              f: 'f',
              z: ['g', 'h'],
              i: 'i',
              j: 'j',
              k: { l: 'l', m: { n: 'n', o: 'o' } }
            },
            { __rest: 'args' }
          ],
          body: '  return 123;'
        }
      },
      '({ a, b, c: [ d, e ] }, { f, z: [ g, h ], i, j, k: { l, m: { n, o } } }, ...args) => {\n    return 123;\n}'
    ]
  ];

  t.plan(specs.length);

  specs.forEach(spec => {
    var object = spec[0].__function;
    var expected = spec[1];
    var result = reifyRFO(object);
    t.equal(JSON.stringify(result.toString()), JSON.stringify(expected));
  });
});
