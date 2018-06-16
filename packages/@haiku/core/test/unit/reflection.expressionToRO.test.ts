import * as tape from 'tape';

import expressionToRO from '@core/reflection/expressionToRO';

tape(
  'reflection.expressionToRO',
  (t) => {
    t.plan(2);

    const exp1 = {
      func (a, b, c) {
        return 123;
      },
    };
    const ro1 = expressionToRO(exp1);
    t.equal(
      JSON.stringify(ro1),
      '{"func":{"__function":{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return 123;"}}}',
    );

    // It should leave this thing as-is since it's already serialized
    const exp2 = {
      func: {
        __function: {
          params: ['a', 'b', 'c'],
          body: 'return 123',
        },
      },
    };
    const ro2 = expressionToRO(exp2);
    t.equal(
      JSON.stringify(ro2),
      '{"func":{"__function":{"params":["a","b","c"],"body":"return 123"}}}',
    );
  },
);
