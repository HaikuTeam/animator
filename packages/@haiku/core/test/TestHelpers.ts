import * as async from 'async';
import * as jsdom from 'jsdom';
import * as ts from 'typescript';

Error.stackTraceLimit = Infinity;

import HaikuDOMAdapter from '@core/adapters/dom/HaikuDOMAdapter';
import Config from '@core/Config';
import HaikuContext from '@core/HaikuContext';
import HaikuGlobal from '@core/HaikuGlobal';
import HaikuDOMRenderer from '@core/renderers/dom/HaikuDOMRenderer';

// Tell typescript we have these types on Global
interface Global {
  window: any;
  document: any;
  haiku: any;
}

declare var global: Global;

const createDOM = (cb) => {
  const html = '<!doctype html><html><body><div id="mount"></div></body></html>';
  const doc = new jsdom.JSDOM(html);
  const win = doc.window;

  global.window = win;
  global.document = win.document;

  for (const key in win) {
    if (!win.hasOwnProperty(key)) {
      continue;
    }
    if (key in global) {
      continue;
    }
    global[key] = window[key];
  }

  const mount = global.window.document.createElement('div');

  mount.width = 800;
  mount.height = 600;

  // Trick jsdom into giving us proper getBoundingClientRect on mounts so we can write sizing tests.
  win.HTMLElement.prototype.getBoundingClientRect = () => ({width: mount.width, height: mount.height});

  global.window.document.body.appendChild(mount);

  return cb(
    null,
    win,
    mount,
    HaikuGlobal,
  );
};

const createRenderTest = (template, timelines, baseConfig, cb) => {
  createRenderTestFromBytecode(
    {
      timelines,
      template,
    },
    baseConfig,
    cb,
  );
};

const createRenderTestFromBytecode = (bytecode, baseConfig, cb) => {
  return createDOM((err, window, mount) => {
    if (err) {
      throw err;
    }

    const config = Config.build(
      baseConfig,
      {
        cache: {},
        seed: Config.seed(),
      },
    );
    const renderer = new HaikuDOMRenderer(
      mount,
      config,
    );
    const context = new HaikuContext(
      mount,
      renderer,
      {},
      bytecode,
      config,
    );
    const component = context.component;
    const tree = component.render(context.config);

    renderer.render(
      context.container,
      tree,
      component,
    );

    function teardown () {
      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
      return;
    }

    return cb(
      null,
      mount,
      renderer,
      context,
      component,
      teardown,
    );
  });
};

const createComponent = (bytecode, options, cb) => {
  return createDOM((err, window, mount) => {
    if (err) {
      throw err;
    }

    const runner = HaikuDOMAdapter(
      bytecode,
      options,
      window,
    );
    const component = runner(
      mount,
      options,
    );

    // If rafs and timers aren't cancelled, the tests never finish due to leaked handles
    const teardown = () => {
      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
      return;
    };

    return cb(
      component,
      teardown,
      mount,
    );
  });
};

const timeBracket = (steps, cb) => {
  let delta = 0;

  return async.eachOfSeries(
    steps,
    (step: Function, key, next) => {
      const start = Date.now();

      return step(
        () => {
          const end = Date.now();
          delta = end - start;

          return next();
        },
        delta,
      );
    },
    cb,
  );
};

const getBytecode = (projectName) => require(`../demo/projects/${projectName}/code/main/code.js`);

/* Inspired by  https://gist.github.com/teppeis/6e0f2d823a94de4ae442 and
 * https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API */
function compileStringToTypescript (contents, libSource, compilerOptions) {
  // Generated outputs
  const outputs = [];
  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: any = {
    getSourceFile (filename, languageVersion) {
      if (filename === 'file.ts') {
        return ts.createSourceFile(
          filename,
          contents,
          compilerOptions.target,
          false,
        );
      }
      if (filename === 'lib.d.ts') {
        return ts.createSourceFile(
          filename,
          libSource,
          compilerOptions.target,
          false,
        );
      }
      console.log(ts.sys.getCurrentDirectory());
      const sourceText = ts.sys.readFile(filename);
      return sourceText !== undefined ? ts.createSourceFile(
        filename,
        sourceText,
        languageVersion,
      ) : undefined;
    },
    writeFile (name, text, writeByteOrderMark) {
      outputs.push({
        name,
        text,
        writeByteOrderMark,
      });
    },
    getDefaultLibFileName () {
      return 'lib.d.ts';
    },
    useCaseSensitiveFileNames () {
      return false;
    },
    getCanonicalFileName (filename) {
      return filename;
    },
    getNewLine () {
      return '\n';
    },
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
  };
  // Create a program from inputs
  const program = ts.createProgram(
    ['file.ts'],
    compilerOptions,
    compilerHost,
  );

  const emitResult = program.emit();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  const fileErrors = allDiagnostics.filter((diagnostic) => diagnostic.file); // && diagnostic.code == 2322)

  fileErrors.forEach((fileError) => {
    const {line, character} = fileError.file.getLineAndCharacterOfPosition(fileError.start);
    const message = ts.flattenDiagnosticMessageText(
      fileError.messageText,
      '\n',
    );
    console.log(`[${fileError.code}] ${fileError.file.fileName} (${line + 1},${character + 1}): ${message}`);
  });

  const TYPE_ERRO_CODE = 2322;
  const typeErrors = allDiagnostics.filter((diagnostic) => diagnostic.code === TYPE_ERRO_CODE);

  return typeErrors;
}

export {
  createDOM,
  createRenderTest,
  createComponent,
  getBytecode,
  timeBracket,
  compileStringToTypescript,
  createRenderTestFromBytecode,
};
