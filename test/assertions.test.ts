import {assertXmlIsEquivalent} from '@testing/assertions';
import * as tape from 'tape';

tape('assertions', (suite: tape.Test) => {
  suite.test('assertXmlIsEquivalent', (test: tape.Test) => {
    assertXmlIsEquivalent(
      test,
      '<div foo="bar" bat="baz">  Hello  </div>',
      '<div bat="baz"     foo="bar">Hello</div>',
    );

    test.end();
  });
});
