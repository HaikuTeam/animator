/* tslint:disable:only-arrow-functions */
import * as tape from 'tape';

// Loading the one exposed from the root to ensure Haiku.enhance ain't broken
const {enhance} = require('../..');

tape(
  'reflection.enhance',
  (t) => {
    t.plan(1);

    const f1 = function (a, b, c) {
      return [a, b, c];
    };

    enhance(f1);
    t.equal(
      JSON.stringify((f1 as any).specification),
      '{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return [a, b, c];"}',
    );
  },
);
