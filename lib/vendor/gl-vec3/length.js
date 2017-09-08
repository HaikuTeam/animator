module.exports = length

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length (a) {
  var x = a[0]
  var y = a[1]
  var z = a[2]
  return Math.sqrt(x * x + y * y + z * z)
}
