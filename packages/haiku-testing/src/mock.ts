import {join} from 'path';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

/**
 * Retrieves a fresh stub.
 */
export const getStub = () => sinon.stub();

/**
 * Generic stub importer based on proxyquire and sinon.
 *
 * Given a source module and a hashmap of targets, returns an array of stubs with an import target unshifted as the
 * first element and a done callback to restore stubs at the end.
 *
 * For example, given the following module:
 *
 * `haiku-stuff/lib/something.js`
 *
 *   import {doFoo} from 'foo';
 *   import bar from 'bar';
 *
 *   export const doStuff = () => doFoo(bar(), 'world');
 *
 * We can mock the 'foo' and 'bar' dependencies using stubs in our test:
 *
 * `haiku-stuff/test/something.test.js`
 *
 *   import {importStubs} from 'haiku-testing/lib/mock';
 *
 *   const [{doStuff}, spyDoFoo, spyBar, unstub] = importStubs('../lib/something', {'foo': 'doFoo', 'bar': 'default'});
 *   bar.returns('hello');
 *   doStuff();
 *   test.true(spyBar.calledOnce);
 *   test.true(spyDoFoo.calledOnce);
 *   test.true(spyDoFoo.calledWith('hello', 'world'));
 *   unstub();
 *
 * This allows us to test all the behavior of doStuff without concern for the actual behavior of the dependencies from
 * 'foo' and 'bar'.
 *
 * Remember to always call `unstub()` before the end of your tests!
 */
export const importStubs = (from: string, spyTargets: {[key: string]: string} = {}) => {
  const targets = {};
  const stubs = [];
  const basePath = join(global.process.cwd(), from);
  for (const module in spyTargets) {
    targets[module] = require(join(basePath, module));
    stubs.push(sinon.stub(targets[module], spyTargets[module]));
  }

  return [proxyquire(basePath, targets), ...stubs, () => {
    stubs.forEach((stub) => stub.restore());
  }];
};

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
  const stubs = properties.map((property) => sinon.stub(target, property));
  return [...stubs, () => {
    stubs.forEach((stub) => stub.restore());
  }];
};
