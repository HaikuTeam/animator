import * as tape from 'tape';

// Loading the one exposed from the root to ensure Haiku.inject ain't broken
const {inject} = require('../..');

tape(
  'reflection.inject',
  (t) => {
    t.plan(6);

    const f1: any = inject((a, b, c) => {
      return [a, b, c];
    });
    t.equal(
      JSON.stringify(f1.specification),
      '{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return [a, b, c];"}',
    );
    t.equal(
      f1.injectee,
      true,
    );

    // Make sure it's safe to double it up
    const f2: any = inject(inject((a, b, c) => {
      return [a, b, c];
    }));
    t.equal(
      JSON.stringify(f2.specification),
      '{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return [a, b, c];"}',
    );
    t.equal(
      f2.injectee,
      true,
    );

    // See what happens if only the flag is there
    let f3: any = (a, b, c) => [a, b, c];
    f3.injectee = true;
    f3 = inject(
      f3,
      'd',
      'e',
      'f',
    ); // ...And if we specify these
    t.equal(
      JSON.stringify(f3.specification),
      '{"type":"FunctionExpression","name":null,"params":["d","e","f"],"body":"return [a, b, c];","injectee":true}',
    );
    t.equal(
      f3.injectee,
      true,
    );
  },
);
