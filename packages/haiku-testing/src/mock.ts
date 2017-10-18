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
 * first element.
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
 *   const [{doStuff}, spyDoFoo, spyBar] = importStubs('../lib/something', {'foo': 'doFoo', 'bar': 'default'});
 *   bar.returns('hello');
 *   doStuff();
 *   test.true(spyBar.calledOnce);
 *   test.true(spyDoFoo.calledOnce);
 *   test.true(spyDoFoo.calledWith('hello', 'world'));
 *
 * This allows us to test all the behavior of doStuff without concern for the actual behavior of the dependencies from
 * 'foo' and 'bar'.
 */
export const importStubs = (from: string, spyTargets: {[key: string]: string} = {}) => {
  const targets = {};
  const spies = [];
  for (const module in spyTargets) {
    const spy = sinon.stub();
    const spyTarget = {};
    spyTarget[spyTargets[module]] = spy;
    spies.push(spy);
    targets[module] = spyTarget;
  }

  return [proxyquire(join(global.process.cwd(), from), targets), ...spies];
};
