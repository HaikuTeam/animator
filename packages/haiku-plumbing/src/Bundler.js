const commonjs = require('rollup-plugin-commonjs')
import json from 'rollup-plugin-json'
const nodeResolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify-es')
const logger = require('haiku-serialization/src/utils/LoggerInstance')

function createBundle (moduleDirectory, input, name, cb) {
  logger.info('[bundler] beginning in basedir', moduleDirectory)

  rollup.rollup({
    input,
    plugins: [
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
