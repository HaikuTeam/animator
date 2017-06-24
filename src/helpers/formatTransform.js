var TRANSFORM_SUFFIX = ')'
var TRANSFORM_ZERO = '0'
var TRANSFORM_COMMA = ','
var TRANSFORM_ZILCH = TRANSFORM_ZERO + TRANSFORM_COMMA
var TWO = 2
var THREE = 3

function formatTransform (transform, format, devicePixelRatio) {
  transform[12] = Math.round(transform[12] * devicePixelRatio) / devicePixelRatio
  transform[13] = Math.round(transform[13] * devicePixelRatio) / devicePixelRatio
  var prefix
  var last
  if (format === TWO) {
    // Example: matrix(1,0,0,0,0,1)
    // 2d matrix is: matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
    // Modify via: matrix(a,b,c,d,tx,ty) <= matrix3d(a,b,0,0,c,d,0,0,0,0,1,0,tx,ty,0,1)
    var two = [transform[0], transform[1], transform[4], transform[5], transform[12], transform[13]]
    transform = two
    prefix = 'matrix('
    last = 5
  } else if (format === THREE) {
    // Example: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
    prefix = 'matrix3d('
    last = 15
  }
  for (var i = 0; i < last; i++) {
    prefix += (transform[i] < 0.000001 && transform[i] > -0.000001) ? TRANSFORM_ZILCH : transform[i] + TRANSFORM_COMMA
  }
  prefix += transform[last] + TRANSFORM_SUFFIX
  return prefix
}

module.exports = formatTransform
