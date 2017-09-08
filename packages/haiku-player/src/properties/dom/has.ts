// Just a utility function for populating these objects
function has () {
  var obj = {}
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    for (var name in arg) {
      var fn = arg[name]
      obj[name] = fn
    }
  }
  return obj
}

module.exports = has
