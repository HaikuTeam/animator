// @ts-ignore
import * as sinon from 'sinon';

/**
 * Retrieves a fresh stub.
 */
// @ts-ignore
export const getStub = () => sinon.stub();

/**
 * A light-weight stub "applicator" for single objects.
 *
 * Given a source object and a hashmap of targets, returns an array of stubs with a done callback to restore stubs at
 * the end.
 *
 * For example, given the following object:
 *
 * `haiku-stuff/lib/something.js`
 *
 *   export const a = {foo: () => 'bar'};
 *
 * We can mock the 'foo' property directly using stubs in our test:
 *
 * `haiku-stuff/test/something.test.js`
 *
 *   import {stubProperties} from 'haiku-testing/lib/mock';
 *   import {a} from 'haiku-stuff/lib/something';
 *
 *   const [fooStub, unstub] = stubProperties(a, 'foo');
 *   fooStub.returns('baz');
 *   test.equal(a.foo(), 'baz');
 *   unstub();
 */
export const stubProperties = (target: object, ...properties: string[]) => {
  // @ts-ignore
  const stubs = properties.map((property) => sinon.stub(target, property));
  return [...stubs, () => {
    stubs.forEach((stub) => stub.restore());
  }];
};
