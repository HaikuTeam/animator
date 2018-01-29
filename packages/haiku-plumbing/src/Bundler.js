const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollup = require('rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify-es')
const includePaths = require('rollup-plugin-includepaths')
const logger = require('haiku-serialization/src/utils/LoggerInstance')

function createBundle (moduleDirectory, input, name, cb) {
  logger.info('[bundler] beginning in basedir', moduleDirectory)

  rollup.rollup({
    input,
    plugins: [
      includePaths({
        include: {
          '@haiku/core': require.resolve('@haiku/core'),
          '@haiku/core/dom': require.resolve('@haiku/core/dom'),
          '@haiku/player': require.resolve('@haiku/core'), // <~ Note how we're pointing legacy player to core here
          '@haiku/player/dom': require.resolve('@haiku/core/dom') // <~ Note how we're pointing legacy player to core here
        }
      }),
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        sourceMap: false,
        extensions: ['.js']
      }),
      json(),
      uglify()
    ]
  }).then((bundle) => {
    bundle.generate({
      name,
      // Although this is not ideal, we can't force our users to write strict code.
      strict: false,
      format: 'iife'
    }).then(({ code }) => {
      cb(null, code)
    }).catch((err) => {
      cb(err)
    })
  }).catch((err) => {
    cb(err)
  })
}

module.exports = {
  createBundle: createBundle
}
