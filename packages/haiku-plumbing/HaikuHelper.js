var Plumbing = require('./index')
var ReplBase = require('./lib/ReplBase').default
var envInfo = require('./lib/envInfo').default
var haikuInfo = require('./lib/haikuInfo').default
var cp = require('child_process')
var path = require('path')

if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
  var Raven = require('./lib/Raven')
  Raven.context(function () {
    go()
  })
} else {
  go()
}

function go () {
  var env = envInfo()
  var haiku = haikuInfo()
  var args = env.args
  var flags = env.flags

  if (flags.mode !== 'headless') haiku.mode = 'creator'

  console.log('Haiku plumbing initializing')
  console.log('args:', args)
  console.log('flags:', flags)
  console.log('config:', haiku)

  console.log('Installing Haiku CLI executable')
  cp.exec(path.join(__dirname, 'bins', 'install'), function (err, out) {
    if (err) {
      console.log('Warning: Unable to install Haiku CLI executable (' + err + ')')
    } else {
      console.log('Haiku CLI executable installed (' + out + ')')
    }
    console.log('Haiku plumbing launching')
    var plumbing = new Plumbing()
    if (flags.repl) {
      startEmUp(plumbing, haiku, function (err, folder) {
        // A quick-and-dirty 'REPL' mainly for testing the plumbing, but open to all
        var repl = new ReplBase()
        var prompt = 'haiku'
        var opts = { me: plumbing, folder: folder }
        repl.start(prompt, opts)
      })
    } else {
      if (haiku.folder) {
        if (haiku.folder[0] === path.sep) haiku.folder = haiku.folder
        else haiku.folder = path.join(process.cwd(), haiku.folder)
      }
      plumbing.launch(haiku, function() {
        console.log('Haiku plumbing running')
      })
    }
  })
}

function startEmUp (plumbing, haiku, cb) {
  delete haiku.folder
  plumbing.launch(haiku, function() {
    var folder = null
    if (flags.folder) {
      if (flags.folder[0] === path.sep) folder = flags.folder
      else folder = path.join(process.cwd(), flags.folder)
    }
    if (folder) {
      plumbing.initializeProject(null, { projectPath: folder }, null, null, function(err) {
        if (err) throw err
        plumbing.startProject(null, folder, function(err, info) {
          if (err) throw err
          cb(null, folder, info)
        })
      })
    } else {
      cb(null, folder, info)
    }
  })
}
