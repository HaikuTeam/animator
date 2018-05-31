import * as tape from 'tape';

tape('index', (test: tape.Test) => {
  test.test('the truth is true', (testInner: tape.Test) => {
    testInner.true(true);
    testInner.end();
  });

  test.end();
});
