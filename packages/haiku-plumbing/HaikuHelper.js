var Plumbing = require('./index')
var ReplBase = require('./lib/ReplBase').default
var envInfo = require('./lib/envInfo').default
var haikuInfo = require('./lib/haikuInfo').default
var path = require('path')

global.eval = function () {
  // noop: eval is forbidden
}

if (process.env.NODE_ENV === 'production') {
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

  console.log('Haiku plumbing launching')
  console.log('args:', args)
  console.log('flags:', flags)
  console.log('config:', haiku)

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
