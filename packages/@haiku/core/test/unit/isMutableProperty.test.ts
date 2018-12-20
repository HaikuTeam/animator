import isMutableProperty from '@core/helpers/isMutableProperty';
import * as tape from 'tape';

tape(
  'isMutableProperty',
  (t) => {
    t.true(
      isMutableProperty(
        {
          0: 'foo',
          1: 'bar',
        },
        'blah',
      ),
      'multiple keyframes => mutable',
    );
    t.true(
      isMutableProperty(
        {1: 'foo'},
        'blah',
      ),
      'no keyframe at t = 0 => mutable',
    );
    t.true(
      isMutableProperty(
        {
          0: {
            value: function foo () {
              // ...
            },
          },
        },
        'blah',
      ),
      'function-valued single keyframe => mutable',
    );
    t.true(
      isMutableProperty(
        {0: {value: 0}},
        'controlFlow.blah',
      ),
      'controlFlow => mutable',
    );
    t.false(
      isMutableProperty({0: {value: 'foo'}}, 'blah'),
      'scalar-valued single keyframe => immutable',
    );
    t.false(
      isMutableProperty(undefined, 'bad-property'),
      'undefined passed as property should return false'
    );
    t.false(
      isMutableProperty(null, 'bad-property'),
      'null passed as property should return false'
    );
    t.false(
      isMutableProperty('bad-property', 'bad-property'),
      'string passed as property should return false'
    );
    t.end();
  },
);
