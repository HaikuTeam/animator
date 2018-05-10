const jsdom = require('jsdom');
const async = require('async');
const Config = require('../lib/Config').default;
const HaikuDOMAdapter = require('../lib/adapters/dom').default;
const HaikuDOMRenderer = require('../lib/renderers/dom').default;
const HaikuContext = require('../lib/HaikuContext').default;
const HaikuGlobal = require('../lib/HaikuGlobal').default;
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

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
    const tree = component.render(context.config);

    renderer.render(context.container, tree, component, false);

    function teardown () {
      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
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
      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
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


/* Inspired by  https://gist.github.com/teppeis/6e0f2d823a94de4ae442 and
 * https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API */
function compileStringToTypescript(contents, libSource, compilerOptions) {
    // Generated outputs
    var outputs = [];
    // Create a compilerHost object to allow the compiler to read and write files
    var compilerHost = {
        getSourceFile: function (filename, languageVersion) {
            if (filename === "file.ts")
                return ts.createSourceFile(filename, contents, compilerOptions.target, "0");
            if (filename === "lib.d.ts")
                return ts.createSourceFile(filename, libSource, compilerOptions.target, "0");
            return undefined;
        },
        writeFile: function (name, text, writeByteOrderMark) {
            outputs.push({ name: name, text: text, writeByteOrderMark: writeByteOrderMark });
        },
        getDefaultLibFileName: function () { return "lib.d.ts"; },
        useCaseSensitiveFileNames: function () { return false; },
        getCanonicalFileName: function (filename) { return filename; },
        getCurrentDirectory: function () { return ""; },
        getNewLine: function () { return "\n"; }
    };
    // Create a program from inputs
    const program = ts.createProgram(["file.ts"], compilerOptions, compilerHost);

    const emitResult = program.emit();

    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    const fileErrors = allDiagnostics.filter( (diagnostic) => diagnostic.file)// && diagnostic.code == 2322)
    
    fileErrors.forEach(fileError => {
      let { line, character } = fileError.file.getLineAndCharacterOfPosition(fileError.start);
      let message = ts.flattenDiagnosticMessageText(fileError.messageText, '\n');
      console.log(`[${fileError.code}] ${fileError.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });
    
    const TYPE_ERRO_CODE = 2322
    const typeErrors = allDiagnostics.filter( (diagnostic) => diagnostic.code == TYPE_ERRO_CODE)

    return typeErrors
}

module.exports = {
  createDOM,
  createRenderTest,
  createComponent,
  getBytecode,
  simulateEvent,
  timeBracket,
  compileStringToTypescript
};
