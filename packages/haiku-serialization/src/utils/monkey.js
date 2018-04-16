const fse = require('haiku-fs-extra')
const fs = require('fs')
const path = require('path')
const util = require('util')
const uselector = require('unique-selector').default
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

const loggableArgs = (args) => {
  return args.map((arg) => {
    try {
      return util.inspect(arg, {
        depth: 1,
        maxArrayLength: 10
      }).replace(/\s+/g, ' ')
    } catch (exception) {
      console.warn('[monkey]', exception.message)
      return '?'
    }
  })
}

const doExcludeMethodOfName = (name, options = {}) => {
  return (
    name === 'constructor' || // Including the constructor interferes with existing object extensions
    name.slice(0, 2) === 'is' || // Avoid noise
    name.slice(0, 3) === 'get' || // Avoid noise
    name.slice(0, 4) === 'find' || // Avoid noise
    name.slice(0, 5) === 'fetch' || // Avoid noise
    (options.exclude && options.exclude[name]) // Explicit method exclusions per module
  )
}

const recordClass = (klass, hook, options = {}) => {
  Object.getOwnPropertyNames(klass.prototype).forEach((name) => {
    if (doExcludeMethodOfName(name, options)) {
      return
    }

    if (typeof klass.prototype[name] === 'function') {
      const original = klass.prototype[name]

      klass.prototype[name] = function (...args) {
        hook(klass, original, this, args)
        return original.call(this, ...args)
      }
    }
  })
}

const loggableEventTarget = (target) => {
  if (!target) return '?'
  if (typeof target !== 'object') return '?'
  try {
    return uselector(target)
  } catch (exception) {
    return '?'
  }
}

const loggableEventValue = (event) => {
  if (!event) return null
  if (event.code) {
    // eslint-disable-next-line
    return `(${event.code}${(event.metaKey && '+meta') || ''}${(event.shiftKey && '+shift') || ''}${(event.altKey && '+alt') || ''}${(event.ctrlKey && '+ctrl' || '')})`
  }
  if (event.clientX) {
    return `[${event.clientX},${event.clientY}]`
  }
}

module.exports = (view, dirname, env, win) => {
  const workspace = validWorkspace(env.HAIKU_RECORDER_WORKSPACE)

  if (!workspace) {
    return
  }

  const logfile = path.join(workspace, `logfile`)
  fse.outputFileSync(logfile, '') // Empty file to start with

  // TODO: When should we call stream.end()?
  const stream = fs.createWriteStream(logfile, {flags: 'a'})

  if (config.modules) {
    for (const modname in config.modules) {
      let options = config.modules[modname]

      if (!options) {
        continue
      }

      if (typeof options !== 'object') {
        options = {}
      }

      for (const cached in require.cache) {
        if (cached.indexOf(modname) === -1) {
          continue
        }

        console.info(`[monkey] enabling recording of ${cached}`)

        let exports = require.cache[cached].exports
        if (exports.default) exports = exports.default

        recordClass(
          exports,
          // This function is invoked any time the host class' method is called
          (klass, fn, binding, args) => {
            const out = `${Date.now()} (${view}) ${klass.name}#${fn.name}(${loggableArgs(args).join(', ')})\n`

            if (options.log && options.log.not) {
              // Allow configuration to prevent methods from reaching the logs
              if (options.log.not(out)) {
                return
              }
            }

            stream.write(out)
          },
          options
        )
      }
    }
  }

  if (win) {
    const handleUIEvent = (event) => {
      const out = `${Date.now()} (ui-${view})'${(event && event.type) || '?'}' ${loggableEventTarget(event && event.target) || ''} ${loggableEventValue(event) || ''}\n`
      stream.write(out)
    }

    win.addEventListener('focus', handleUIEvent)
    win.addEventListener('blur', handleUIEvent)
    win.addEventListener('mousedown', handleUIEvent)
    win.addEventListener('mouseup', handleUIEvent)
    win.addEventListener('keydown', handleUIEvent)
    win.addEventListener('keyup', handleUIEvent)
  }
}
