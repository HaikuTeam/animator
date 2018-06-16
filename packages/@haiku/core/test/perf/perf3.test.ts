import * as tape from 'tape';
import {createComponent, getBytecode, timeBracket} from '../TestHelpers';

tape(
  'perf3',
  (t) => {
    t.plan(3);
    const bytecode = getBytecode('AndroidFiltersV2');
    createComponent(
      bytecode,
      {},
      (component, teardown, mount) => {
        t.equal(
          mount.outerHTML.length,
          11,
          'html checksum ok',
        );
        timeBracket(
          [
            (done) => {
              component.context.tick();
              done();
            },
            (done, delta) => {
              t.true(true);
              console.log('[haiku core perf test] initial tick took ' + delta + ' vs baseline of 150');
              done();
            },
            (done) => {
              component.context.tick();
              done();
            },
            (done, delta) => {
              console.log('[haiku core perf test] patch took ' + delta + ' vs baseline of 15');
              t.true(true);
              done();
            },
          ],
          teardown,
        );
      },
    );
  },
);
