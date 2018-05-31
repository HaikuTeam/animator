import * as tape from 'tape';

tape('index', (suite: tape.Test) => {
  suite.test('the truth is true', (test: tape.Test) => {
    test.true(true);
    test.end();
  });

  suite.end();
});
