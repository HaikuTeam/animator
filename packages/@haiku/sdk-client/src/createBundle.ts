// @ts-ignore
import * as rollup from 'rollup';
// @ts-ignore
import * as commonjs from 'rollup-plugin-commonjs';
// @ts-ignore
import * as includePaths from 'rollup-plugin-includepaths';
// @ts-ignore
import * as json from 'rollup-plugin-json';
// @ts-ignore
import * as nodeResolve from 'rollup-plugin-node-resolve';
// @ts-ignore
import * as uglify from 'rollup-plugin-uglify-es';

const logger = console;

export const createBundle = (moduleDirectory: string, input: string, name: string, cb: any) => {
  logger.info('[bundler] beginning in basedir', moduleDirectory);

  rollup.rollup({
    input,
    plugins: [
      includePaths({
        include: {
          '@haiku/core': require.resolve('@haiku/core'),
          '@haiku/core/dom': require.resolve('@haiku/core/dom'),
          // Note how we're pointing legacy player to core here
          '@haiku/player': require.resolve('@haiku/core'),
          '@haiku/player/dom': require.resolve('@haiku/core/dom'),
        },
      }),
      nodeResolve({
        jsnext: true,
        main: true,
      }),
      commonjs({
        sourceMap: false,
        extensions: ['.js'],
      }),
      json(),
      uglify(),
    ],
  }).then((bundle: any) => {
    bundle.generate({
      name,
      // Although this is not ideal, we can't force our users to write strict code.
      strict: false,
      format: 'iife',
    }).then(({code}: any) => {
      cb(null, code);
    }).catch((err: any) => {
      cb(err);
    });
  }).catch((err: any) => {
    cb(err);
  });
};
