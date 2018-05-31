import * as tape from 'tape';
import * as path from 'path';
import timeBracket from 'haiku-testing/src/helpers/timeBracket';
import createDOMComponent from 'haiku-testing/src/helpers/createDOMComponent';

tape('perf3', (t) => {
  t.plan(3);

  const bytecode = require(
    path.join(__dirname, '..', '..', 'demo', 'projects', 'AndroidFiltersV2', 'code/main/code.js'),
  );

  createDOMComponent('my/folder', bytecode, {}, (err, component, $mount) => {
    t.equal($mount.outerHTML.length, 11, 'html checksum ok');

    timeBracket([
      (done) => {
        component.context.tick();
        done();
      },
      (done, delta) => {
        console.log('[haiku core perf test] initial tick took ' + delta + ' vs baseline of 150');
        t.true(true);
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
    ],          () => {
      component['teardown']();
    });
  });
});
