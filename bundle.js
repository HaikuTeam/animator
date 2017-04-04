var path = require('path')
var browserify = require('browserify')
var handlebars = require('handlebars')
var fse = require('fs-extra')
var async = require('async')
var DEMOS_PATH = path.join(__dirname, 'demo')

fse.removeSync(path.join(__dirname, 'build'))
var builddir = path.join(__dirname, 'build', Date.now() + '')
fse.mkdirpSync(builddir)

var entries = fse.readdirSync(DEMOS_PATH)
async.each(entries, function (demo, next) {
  var absdir = path.join(DEMOS_PATH, demo)
  var isdir = fse.lstatSync(absdir).isDirectory()
  if (!isdir) return next()
  var haikujsAbspath = path.join(DEMOS_PATH, demo, 'haiku.js')
  var haikuConfig = require(haikujsAbspath)
  if (!haikuConfig.interpreter) throw new Error('No interpreter')
  var interpreterAbspath = path.join(absdir, haikuConfig.interpreter)
  var vanillaHtml = fse.readFileSync(path.join(DEMOS_PATH, 'demo.html.handlebars')).toString()
  var vanillaTpl = handlebars.compile(vanillaHtml)
  return build(interpreterAbspath, demo, vanillaTpl, function (err, html) {
    if (err) return next(err)
    fse.outputFileSync(path.join(builddir, demo + '.bundle.html'), html)
    next()
  })
})

function build (abspath, demo, tpl, cb) {
  var br = browserify(abspath, { standalone: 'bundle' })
  br.on('error', cb)
  return br.bundle(function (err, jsbuf) {
    if (err) return cb(err)
    var js = jsbuf.toString()
    var html = tpl({ demo: demo, bundle: js })
    return cb(null, html)
  })
}

// var reactAbspath = path.join(absdir, 'react-dom.js')
// var reactHtml = fse.readFileSync(path.join(DEMOS_PATH, 'react-dom.html.handlebars'))
// var reactTpl = handlebars.compile(reactHtml)
// http://haiku-misc-public.s3-website-us-east-1.amazonaws.com