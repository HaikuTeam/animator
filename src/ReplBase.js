import repl from 'repl'

function cb (err, out) {
  if (err) console.log(err)
  if (out !== undefined) console.log(out)
  return out
}

export default class Repl {
  start (prompt, scopes) {
    const r = repl.start({
      prompt: `${prompt} > `
    })

    if (!scopes.cb) scopes.cb = cb

    for (const name in scopes) {
      Object.defineProperty(r.context, name, {
        configurable: false,
        enumerable: true,
        value: scopes[name]
      })
    }

    return this
  }
}
