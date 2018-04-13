const fse = require('haiku-fs-extra')
const fs = require('fs')
const path = require('path')
const basedir = path.join(__dirname, '..', '..', '..', '..')
const config = require(path.join(basedir, 'monkey.config.js'))

const validWorkspace = (workspace) => {
  if (workspace && typeof workspace === 'string') {
    fse.mkdirpSync(workspace)
    return workspace
  } else {
    return false
  }
}

const loggableArg = (arg, n = 2) => {
  if (Array.isArray(arg)) {
    if (n > 0) {
      return arg.map((a) => {
        return loggableArg(a, n - 1)
      })
    } else {
      return '[…]'
    }
  } else if (typeof arg === 'object') {
    if (arg.constructor.prototype !== Object.constructor.prototype) {
      return arg.constructor.name
    } else {
      if (n > 0) {
        const out = {}
        for (const key in arg) {
          out[key] = loggableArg(arg[key], n - 1)
        }
        return out
      } else {
        return '{…}'
      }
    }
  } else if (typeof arg === 'function') {
    return `<${arg.name || 'anonymous'}>`
  } else {
    return arg + ''
  }
}

const loggableArgs = (args) => {
  return args.map((a) => {
    try {
      return JSON.stringify(a)
    } catch (exception) {
      return '?'
    }
  })
}

const recordClass = (klass, hook, options = {}) => {
  Object.getOwnPropertyNames(klass.prototype).forEach((fn) => {
    if (typeof klass.prototype[fn] === 'function') {
      const original = klass.prototype[fn]

      klass.prototype[fn] = function (...args) {
        hook(klass, original, this, args)
        return original.call(this, ...args)
      }
    }
  })
}

module.exports = (view, dirname, env, options = {}) => {
  const workspace = validWorkspace(env.HAIKU_RECORDER_WORKSPACE)

  if (!workspace) {
    return
  }

  const logfile = path.join(workspace, `logfile-${view}`)
  fse.outputFileSync(logfile, '') // Empty file to start with

  // TODO: When should we call stream.end()?
  const stream = fs.createWriteStream(logfile, {flags: 'a'})

  if (config.modules) {
    for (const modname in config.modules) {
      for (const cached in require.cache) {
        if (cached.indexOf(modname) !== -1) {
          console.info(`[monkey] enabled recording of ${cached}`)

          recordClass(
            require.cache[cached].exports,
            // This function is invoked any time the host class' method is called
            (klass, fn, binding, args) => {
              stream.write(`${view} ${Date.now()} ${klass.name}#${fn.name}(${loggableArgs(args).join(',')})\n`)
            }
          )
        }
      }
    }
  }
}
