// ZYX order
function fromEuler (quaternion, euler) {
  let x = euler[0]
  let y = euler[1]
  let z = euler[2]

  let sx = Math.sin(x / 2)
  let sy = Math.sin(y / 2)
  let sz = Math.sin(z / 2)
  let cx = Math.cos(x / 2)
  let cy = Math.cos(y / 2)
  let cz = Math.cos(z / 2)

  quaternion[3] = cx * cy * cz - sx * sy * sz
  quaternion[0] = sx * cy * cz + cx * sy * sz
  quaternion[1] = cx * sy * cz - sx * cy * sz
  quaternion[2] = cx * cy * sz + sx * sy * cz
  return quaternion
}

function identity(out) {
  out[0] = 0
  out[1] = 0
  out[2] = 0
  out[3] = 1
  return out
}

export default {
  fromEuler,
  identity
}
