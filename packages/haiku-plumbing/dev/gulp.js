'use strict'

var each = require('lodash.foreach')
var fse = require('haiku-fs-extra')
var gulp = require('gulp')
var watch = require('gulp-watch')
var path = require('path')
var exec = require('child_process').exec

const argv = require('yargs').argv

var ROOT = path.join(__dirname, '..')
var SOURCE = './src/'
var DEST = './lib/'
var DEST_ABS = path.join(ROOT, DEST)
var BABEL_IGNORED = [
  '*/sketch-plugin/*',
  '**/*.ts',
]

function cmd(command, cb) {
  console.log('[gulp] Running `' + command + '`')
  var proc = exec(command, { cwd: ROOT }, function(err, out) {
    if (err) {
      setTimeout(function() {
        // sayAudibly(err.message)
      })
    }
    return cb(err, out)
  });
  proc.stdout.pipe(process.stdout);  
}

function copyFile(relpath, cb) {
  console.log('[gulp] Copying `' + relpath)
  var abssrc = path.join(ROOT, SOURCE, relpath)
  var absdest = path.join(ROOT, DEST, relpath)
  return fse.copy(abssrc, absdest, cb)
}

function compileAll(cb) {
  return fse.remove(DEST_ABS, function _rm(err) {
    if (err) return cb(err)
    return fse.mkdirp(DEST_ABS, function _mkdir(err) {
      if (err) return cb(err)
      return compileTypeScriptAll(function _compTs(err){
        if (err) return cb(err)
        return compileBabelAll(cb);
      })
    })
  })
}

function compileBabelAll(cb) {
  var str = 'babel -d ' + DEST + ' ' + SOURCE
  str += ' --copy-files'
  str += ' --source-maps'
  str += ' --ignore ' + BABEL_IGNORED.join(',')
  return cmd(str, cb)
}

function compileBabelOne(src, dest, cb) {
  var str = 'babel ' + src
  str += ' --out-file ' + dest
  str += ' --copy-files'
  str += ' --source-maps'
  return cmd(str, cb)
}

function compileTypeScriptAll(cb) {
  // var str = 'tsc --project "' + ROOT + '" --sourcemap --jsx react --rootdir ' + SOURCE  + ' --outdir ' + DEST
  // return cmd(str, cb)
  return cb()
}

function watchFiles(cb) {
  return watch(SOURCE + '**', function _watch(file) {
    var src = path.join(SOURCE, file.relative)
    var dest = path.join(DEST, file.relative)
    if (path.extname(src) === '.js') return compileBabelOne(src, dest, cb)
    else if (path.extname(src) === '.ts' || path.extname(src) === '.tsx') return compileTypeScriptAll(cb)
    else return copyFile(file.relative, cb)
    return cb()
  })
}

gulp.task('compile', function _compile(done) {
  return compileAll(done)
})

gulp.task('watch', function _watch(done) {
  const watch = () => watchFiles(function _watch(err) {
    if (err) return done(err)
  })

  if (argv['skip-initial-build']) {
    console.log('[gulp] Skipping initial build.')
    return watch()
  }

  return compileAll(function _compile(err) {
    if (err) return done(err)
    return watch()
  })
})
