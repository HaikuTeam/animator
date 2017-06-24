var compactTransform = require('./compactTransform')

// var CIDENT = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'

function isEqualTransformString (t1, t2) {
  if (t1 === t2) return true
  if (!t1) return false
  var c1 = compactTransform(t1)
  var c2 = compactTransform(t2)
  if (c1 === c2) return true
  // if (t2 === CIDENT) return true // Historic hack that causes module replacement update issues as of Dec 7 2016
  return false
}

module.exports = isEqualTransformString
