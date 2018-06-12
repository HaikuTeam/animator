import * as commonjs from 'rollup-plugin-commonjs';
import * as json from 'rollup-plugin-json';
import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as uglify from 'rollup-plugin-uglify-es';
import * as includePaths from 'rollup-plugin-includepaths';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

function createBundle (moduleDirectory, input, name, cb) {
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
  }).then((bundle) => {
    bundle.generate({
      name,
      // Although this is not ideal, we can't force our users to write strict code.
      strict: false,
      format: 'iife',
    }).then(({code}) => {
      cb(null, code);
    }).catch((err) => {
      cb(err);
    });
  }).catch((err) => {
    cb(err);
  });
}

module.exports = {
  createBundle,
};
