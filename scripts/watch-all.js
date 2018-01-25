const async = require('async')
const cp = require('child_process')
const argv = require('yargs').argv

const log = require('./helpers/log')
const allPackages = require('./helpers/packages')()

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development'
}

// Note the packages we would never want to develop for specific dev choices.
const appOwnedDeps = ['haiku-websockets', 'haiku-creator', 'haiku-plumbing']
const devChoiceExclusions = {
  glass: appOwnedDeps.concat(['haiku-timeline']),
  timeline: appOwnedDeps.concat(['haiku-glass']),
  everything: []
}
const devChoice = argv.devChoice || 'everything'
const children = []

const runInstruction  = (cwd, args, cb) => {
  const cmd = 'yarn'
  const proc = cp.spawn(cmd, args, { cwd, env: process.env, stdio: 'inherit' })
  children.push({
    info: { cwd, cmd, args },
    proc
  })
  cb()
}

async.each(allPackages, (pack, done) => {
  const { shortname } = pack
  if (devChoiceExclusions[devChoice] && devChoiceExclusions[devChoice].includes(shortname)) {
    done()
    return
  }

  switch (shortname) {
    case 'player':
      // TS module, but one that uses "develop" for something different than watching.
      runInstruction(pack.abspath, ['watch'], done)
      break
    case 'websockets':
    case 'creator':
    case 'glass':
    case 'timeline':
    case 'plumbing':
      // Babel modules where we can skip the initial (slow) build.
      runInstruction(pack.abspath, ['watch', '--skip-initial-build'], done)
      break
    case 'state-object':
    case 'bytecode':
    case 'serialization':
    case 'fs-extra':
      // These don't have watchers or need special treatment.
      break
    default:
      // Standard, new way of doing things: `yarn develop`.
      runInstruction(pack.abspath, ['develop'], done)
      break
  }
})

const exit = () => {
  log.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
  log.log('exiting; telling children to interrupt')
  log.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')

  children.forEach(function (child, index) {
    if (child.proc.stdin) child.stdin.pause()
    log.log('$$$$$ ' + index + ' ' + JSON.stringify(child.info))
    child.proc.kill('SIGKILL')
  })
}

global.process.on('exit', exit)
global.process.on('SIGINT', exit)
global.process.on('SIGHUP', exit)
global.process.on('SIGTERM', exit)
global.process.on('uncaughtException', exit)
