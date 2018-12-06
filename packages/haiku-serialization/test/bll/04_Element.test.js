const tape = require('tape');
const path = require('path');
const async = require('async');
const fse = require('haiku-fs-extra');
const Project = require('./../../src/bll/Project');
const Row = require('./../../src/bll/Row');

tape('Element', (t) => {
  setupTest((ac, bytecode, done) => {
    t.plan(11);
    const el0 = ac.findElementByComponentId(bytecode.template.attributes['haiku-id']);
    const a1 = el0.getCompleteAddressableProperties();
    t.ok(a1, 'addressables are present');
    t.ok(a1['translation.x'], 'standard prop present');
    t.equal(a1['translation.x'].type, 'native');
    t.equal(a1['translation.x'].name, 'translation.x');
    t.equal(a1['translation.x'].prefix, 'translation');
    t.equal(a1['translation.x'].suffix, 'x');
    t.equal(a1['translation.x'].fallback, 0);
    t.equal(a1['translation.x'].typedef, 'number');
    t.equal(a1['translation.x'].mock, undefined);
    t.equal(a1['translation.x'].value, undefined);
    t.deepEqual(a1['translation.x'].cluster, {prefix: 'translation', name: 'Position'});
    done();
  });
});

tape('Element.buildClipboardPayload', (t) => {
  setupTest((ac, bytecode, done) => {
    const id = bytecode.template.attributes['haiku-id'];
    const element = ac.findElementByComponentId(id);
    element.upsertEventHandler('click', SERIALIZED_EVENT.click);
    const payload = element.buildClipboardPayload();

    t.equal(payload.kind, 'bytecode', 'the payload returned must have a kind property with the correct value');
    t.ok(payload.data.eventHandlers, 'they payload must contain the event handlers of the element');
    t.ok(payload.data.eventHandlers[`haiku:${id}`].click);
    t.ok(payload.data.eventHandlers[`haiku:${id}`].click.handler.__function, 'the payload contains the event handlers of the element serialized');
    t.ok(payload.data.timelines, 'the payload must contain the timelines of the element');
    t.ok(payload.data.template, 'the payload must contain the template of the element');
    t.end();
    done();
  });
});

const setupTest = (doTest) => {
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'element-getaddressables-01');
  fse.removeSync(folder);
  const bytecode = require(path.join(__dirname, '..', '..', '..', 'haiku-timeline', 'test', 'projects', 'complex', 'code', 'main', 'code.js'));
  const websocket = {on: () => {}, send: () => {}, action: () => {}, connect: () => {}};
  const platform = {};
  const userconfig = {};
  const fileOptions = {doWriteToDisk: true, skipDiffLogging: true};
  const envoyOptions = {mock: true};
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', {from: 'test'}, (err) => {
      if (err) {
 throw err;
}
      const ac0 = project.getCurrentActiveComponent();
      return ac0.fetchActiveBytecodeFile().mod.update(bytecode, () => {
        return ac0.hardReload({}, {}, () => {
          return async.series([], (err) => {
            if (err) {
 throw err;
}
            doTest(ac0, bytecode, () => {
              fse.removeSync(folder);
            });
          });
        });
      });
    });
  });
};

const SERIALIZED_EVENT = {
  click: {
    handler: {
      __function: {
        params: ['event'],
        body: '/** action logic goes here */\nconsole.log(12);',
        type:'FunctionExpression',
        name:null,
      },
    },
  },
};
