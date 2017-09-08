'use strict'

var each = require('lodash.foreach')
var fse = require('haiku-fs-extra')
var gulp = require('gulp')
var watch = require('gulp-watch')
var path = require('path')
var exec = require('child_process').exec
var execSync = require('child_process').execSync
var spawn = require('child_process').spawn

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

function scmd(command, args, cb) {
  console.log('[gulp] Spawning `' + command + ' '+ args.join(' ') +'`')
  var proc = spawn(command, args, { cwd: ROOT })
  proc.stdout.pipe(process.stdout);
  return cb(null, proc)
}

function copyFile(relpath, cb) {
  console.log('[gulp] Copying `' + relpath)
  var abssrc = path.join(ROOT, SOURCE, relpath)
  var absdest = path.join(ROOT, DEST, relpath)
  return fse.copy(abssrc, absdest, cb)
}

var SAY_VOICE = process.env.SAY_VOICE || 'Alex'
var SAY_SPEED = process.env.SAY_SPEED || 300
function sayAudibly(message) {
  try {
    if (!message) return void (0)
    message = message.split('\n')[1]
    if (!message) return void (0)
    message = message.split(/\s+/).slice(0, 5)
    message = 'Air Roar! ' + message
    execSync('say -v ' + JSON.stringify(SAY_VOICE) + ' -r ' + SAY_SPEED + ' ' + JSON.stringify(message))
  } catch (exception) {
    // empty
  }
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

function flagsToArgs(flags) {
  var args = []
  each(flags, (value, key) => {
    if (value === true) return args.push('--' + key)
    else args.push('--' + key + '=' + value)
  })
  return args
}

gulp.task('compile', function _compile(done) {
  return compileAll(done)
})

gulp.task('watch', function _watch(done) {
  return compileAll(function _compile(err) {
    if (err) return done(err)
    return watchFiles(function _watch(err) {
      if (err) return done(err)
    })
  })
})
