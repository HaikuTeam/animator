// Just a utility function for populating these objects
function has() {
  let obj = {}
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i]
    for (let name in arg) {
      let fn = arg[name]
      obj[name] = fn
    }
  }
  return obj
}

module.exports = has
