function _transformVectorByMatrix (out, v, m) {
  out[0] = m[0] * v[0] + m[4] * v[1] + m[12]
  out[1] = m[1] * v[0] + m[5] * v[1] + m[13]
  return out
}

module.exports = _transformVectorByMatrix
