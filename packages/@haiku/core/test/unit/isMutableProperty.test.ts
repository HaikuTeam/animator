import * as tape from 'tape';
const isMutableProperty = require('./../../lib/helpers/isMutableProperty').default;

tape('isMutableProperty', (t) => {
  t.true(isMutableProperty({0: 'foo', 1: 'bar'}), 'multiple keyframes => mutable');
  t.true(isMutableProperty({1: 'foo'}), 'no keyframe at t = 0 => mutable');
  t.true(isMutableProperty({0: {value: function foo() {}}}), 'function-valued single keyframe => mutable');
  t.true(isMutableProperty({0: {value: 0}}, 'controlFlow.placeholder'), 'controlFlow => mutable');
  t.false(isMutableProperty({0: {value: 'foo'}}), 'scalar-valued single keyframe => immutable');
  t.end();
});
