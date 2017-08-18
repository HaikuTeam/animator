#!/usr/bin/env node

var Uglify2 = require('uglify-js')
var glob = require('glob-all')
var async = require('async')
var path = require('path')
var fs = require('fs-extra')

console.log('uglifying code')
glob([
  // plumbing
  'libs/plumbing/dev/*.js',
  'libs/plumbing/lib/**/*.js',
  'libs/plumbing/src/**/*.js',
  'libs/plumbing/test/**/*.js',

  // bytecode
  'libs/plumbing/node_modules/haiku-bytecode/src/**/*.js',
  'libs/plumbing/node_modules/haiku-bytecode/test/**/*.js',

  // cli
  'libs/plumbing/node_modules/haiku-cli/src/*.js',
  'libs/plumbing/node_modules/haiku-cli/lib/*.js',

  // creator
  'libs/plumbing/node_modules/haiku-creator-electron/public/**/*.js',
  'libs/plumbing/node_modules/haiku-creator-electron/react/**/*.js',
  'libs/plumbing/node_modules/haiku-creator-electron/utils/**/*.js',

  // glass
  'libs/plumbing/node_modules/haiku-glass/public/**/*.js',
  'libs/plumbing/node_modules/haiku-glass/react/**/*.js',
  'libs/plumbing/node_modules/haiku-glass/test/**/*.js',

  // sdk
  'libs/plumbing/node_modules/haiku-sdk/lib/**/*.js',
  'libs/plumbing/node_modules/haiku-sdk/src/**/*.js',
  'libs/plumbing/node_modules/haiku-sdk-client/lib/**/*.js',
  'libs/plumbing/node_modules/haiku-sdk-client/src/**/*.js',
  'libs/plumbing/node_modules/haiku-sdk-inkstone/lib/**/*.js',
  'libs/plumbing/node_modules/haiku-sdk-inkstone/src/**/*.js',

  // serialization
  'libs/plumbing/node_modules/haiku-serialization/src/**/*.js',
  'libs/plumbing/node_modules/haiku-serialization/test/**/*.js',

  // state-object
  'libs/plumbing/node_modules/haiku-state-object/*.js',
  'libs/plumbing/node_modules/haiku-state-object/lib/*.js',

  // timeline
  'libs/plumbing/node_modules/haiku-timeline/public/**/*.js',
  'libs/plumbing/node_modules/haiku-timeline/src/**/*.js',

  // websockets
  'libs/plumbing/node_modules/haiku-websockets/lib/*.js',
  'libs/plumbing/node_modules/haiku-websockets/src/*.js',
  'libs/plumbing/node_modules/haiku-websockets/test/*.js',
], function(err, files) {
  return async.eachSeries(files, function(file, next) {
    console.log('uglifying', file, '...')
    var sourcepath = path.join(process.cwd(), file)
    var destpath = path.join(process.cwd(), file)
    try {
      var result = Uglify2.minify(sourcepath)
      var code = result.code
      return fs.outputFile(destpath, code, function(err) {
        if (err) return next(err)
        return next()
      })
    } catch (exception) {
      console.log('cannot uglify (' + exception.message + ')')
      return next()
    }
  }, function() {
    console.log('done uglifying')
  })
})
