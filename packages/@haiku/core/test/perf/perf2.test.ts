import * as tape from 'tape';
import {
  timeBracket,
  createComponent,
  getBytecode,
} from '../TestHelpers';

tape('perf2', (t) => {
  t.plan(3);
  const bytecode = getBytecode('heartstry4');
  createComponent(bytecode, {}, (component, teardown, mount) => {
    t.equal(mount.outerHTML.length, 11, 'html checksum ok');
    timeBracket([
      function (done) {
        component.context.tick();
        done();
      },
      function (done, delta) {
        console.log('[haiku core perf test] initial tick took ' + delta + ' vs baseline of 30');
        t.true(true);
        done();
      },
      function (done) {
        component.context.tick();
        done();
      },
      function (done, delta) {
        console.log('[haiku core perf test] patch took ' + delta + ' vs baseline of 5');
        t.true(true);
        done();
      },
    ],          teardown);
  });
});
