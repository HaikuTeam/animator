import * as tape from 'tape';

tape('index', (test: tape.Test) => {
  test.test('the truth is true', (test: tape.Test) => {
    test.true(true);
    test.end();
  });

  test.end();
});
