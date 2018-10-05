
// @ts-ignore
import * as rollup from 'rollup';
// @ts-ignore
import * as commonjs from 'rollup-plugin-commonjs';
// @ts-ignore
import * as json from 'rollup-plugin-json';
// @ts-ignore
import * as nodeResolve from 'rollup-plugin-node-resolve';
// @ts-ignore
import * as uglify from 'rollup-plugin-uglify-es';

import * as path from 'path';

export const createCoreBundle = (input: string, name: string, doUglify = false) => {
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
  }).then((bundle: any) => bundle.generate({
    name,
    format: 'iife',
  }));
};

export const createCoreMinContent = (): Promise<string> => {
  const input = require.resolve(path.join('@haiku/core', 'dom', 'index.js'));
  const name = 'HaikuDOMAdapter';

  return new Promise<string>((resolve) => {
    // TODO: setting doUglify to true (uglifying the resultin bundle) is not working on linux
    // production build, probably it can be solved by changing rollup-plugin-uglify-es to
    // rollup-plugin-terser or updating rollup itself
    createCoreBundle(input, name, true).then(({code}: any) => {
      resolve(code);
    });
  });
};
