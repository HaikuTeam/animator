const jsdom = require('jsdom');
const async = require('async');
const Config = require('../lib/Config').default;
const HaikuDOMAdapter = require('../lib/adapters/dom').default;
const HaikuDOMRenderer = require('../lib/renderers/dom').default;
const HaikuContext = require('../lib/HaikuContext').default;
const HaikuGlobal = require('../lib/HaikuGlobal').default;

const createDOM = (cb) => {
  const html = '<!doctype html><html><body><div id="mount"></div></body></html>';
  const doc = new jsdom.JSDOM(html);
  const win = doc.window;

  global.window = win;
  global.document = win.document;

  for (const key in win) {
    if (!win.hasOwnProperty(key)) continue;
    if (key in global) continue;
    global[key] = window[key];
  }

  const mount = global.window.document.createElement('div');

  mount.width = 800;
  mount.height = 600;

  // Trick jsdom into giving us proper layout on mounts so we can write sizing tests.
  Object.defineProperties(win.HTMLElement.prototype, {
    offsetWidth: {
      get: () => mount.width
    },
    offsetHeight: {
      get: () => mount.height
    }
  });

  global.window.document.body.appendChild(mount);

  return cb(null, win, mount, HaikuGlobal);
}

const createRenderTest = (template, timelines, baseConfig, cb) => {
  return createDOM((err, window, mount) => {
    if (err) throw err

    const config = Config.build(baseConfig, { cache: {}, seed: Config.seed() });
    const renderer = new HaikuDOMRenderer(mount, config);
    const context = new HaikuContext(mount, renderer, {}, { timelines, template }, config);
    const component = context.component;
    const container = renderer.createContainer(mount);
    const tree = component.render(container, context.config);

    renderer.render(container, tree, component, false);

    function teardown () {
      component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
      return;
    }

    return cb(null, mount, renderer, context, component, teardown);
  })
}

const createComponent = (bytecode, options, cb) => {
  return createDOM((err, window, mount) => {
    if (err) throw err;

    const runner = HaikuDOMAdapter(bytecode, options, window);
    const component = runner(mount, options);

    // If rafs and timers aren't cancelled, the tests never finish due to leaked handles
    const teardown = () => {
      component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
      return;
    }

    return cb(component, teardown, mount);
  })
}

const simulateEvent = (element, name) => {
  const document = element.ownerDocument;
  const event = document.createEvent('HTMLEvents');

  event.initEvent(name, false, true);
  element.dispatchEvent(event);

  return event;
}

const timeBracket = (steps, cb) => {
  let delta = 0;

  return async.eachOfSeries(steps, (step, key, next) => {
    const start = Date.now();

    return step(() => {
      const end = Date.now();
      delta = end - start;

      return next();
    }, delta);
  }, cb);
}

const getBytecode = (projectName) => {
  return require(`../demo/projects/${projectName}/code/main/code.js`);
}

module.exports = {
  createDOM,
  createRenderTest,
  createComponent,
  getBytecode,
  simulateEvent,
  timeBracket
};
