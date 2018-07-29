const tape = require('tape');
const objectToOAST = require('../../src/ast/objectToOAST');
const generateCode = require('../../src/ast/generateCode');

tape.test('ast', (suite) => {
  suite.test('objectToOAST', (test) => {
    const bytecode = {
      timelines: {
        Default: {
          foobar: {
            // Only has one keyframe, but that keyframe is not 0, so should be left alone.
            leaveAlone1: {1: 'blah'},
            // Has more than one keyframe, so should be left alone.
            leaveAlone2: {0: 'blah', 1: 'blah'},
            // Object-values will confuse the serializer, so should be left alone.
            leaveAlone3: {0: {value: {}}},
            // Edited, so should be left alone.
            leaveAlone4: {0: {value: 'blah', edited: true}},
            // Edited, but can be shortened because it's a layout property.
            'sizeAbsolute.x': {0: {value: 5, edited: true}},
            // Should be shortened.
            cheez: {0: {value: 'swiss'}},
          },
        },
      },
      blah: {
        Default: {
          foobar: {
            // Has the right structure, but is not part of timelines, so should be left alone.
            leaveAlone5: {0: {value: 'blah'}},
          },
        },
      },
    };

    const ast = objectToOAST(bytecode);
    const serialized = generateCode(ast);
    test.deepEqual(
      JSON.parse(serialized),
      {
        timelines: {
          Default: {
            foobar: {
              leaveAlone1: {1: 'blah'},
              leaveAlone2: {0: 'blah', 1: 'blah'},
              leaveAlone3: {0: {value: {}}},
              leaveAlone4: {0: {value: 'blah', edited: true}},
              'sizeAbsolute.x': 5, // SHORTENED!
              cheez: 'swiss' // SHORTENED!
            },
          },
        },
        blah: {Default: {foobar: {leaveAlone5: {0: {value: 'blah'}}}}},
      },
      'shorthand was correctly applied during ASTification',
    );
    test.end();
  });

  suite.end();
});
