const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const path = require('path');
const uglify = require('rollup-plugin-uglify-es');
const fse = require('fs-extra');

const ROOT = global.process.cwd();
const DIST = path.join(ROOT, 'dist');

const createBundle = (input, name, doUglify = false) => {
  const plugins = [
    nodeResolve({
      jsnext: true,
      main: true,
    }), commonjs({
      sourceMap: false,
      extensions: ['.js'],
    }), json(),
  ];

  if (doUglify) {
    plugins.push(uglify());
  }

  return rollup.rollup({
    input,
    plugins,
  }).then((bundle) => bundle.generate({
    name,
    format: 'iife',
  }));
};

const adapters = {
  dom: {
    name: 'HaikuDOMAdapter',
    dir: '',
  },
  'vue-dom': {
    name: 'HaikuVueAdapter',
    dir: 'vue',
  },
};

fse.mkdirp(DIST);
for (const bundleName in adapters) {
  const {name, dir} = adapters[bundleName];
  const input = path.join(
    ROOT,
    'dom',
    dir,
    'index.js',
  );
  // Full bundle.
  createBundle(
    input,
    name,
  ).then(({code}) => {
    fse.outputFileSync(
      path.join(
        DIST,
        `${bundleName}.bundle.js`,
      ),
      code,
    );
  });
  // Minified bundle.
  createBundle(
    input,
    name,
    true,
  ).then(({code}) => {
    fse.outputFileSync(
      path.join(
        DIST,
        `${bundleName}.bundle.min.js`,
      ),
      code,
    );
  });
}
