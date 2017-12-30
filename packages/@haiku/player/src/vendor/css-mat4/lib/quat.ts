// ZYX order
function fromEuler(quaternion, euler) {
  const x = euler[0];
  const y = euler[1];
  const z = euler[2];

  const sx = Math.sin(x / 2);
  const sy = Math.sin(y / 2);
  const sz = Math.sin(z / 2);
  const cx = Math.cos(x / 2);
  const cy = Math.cos(y / 2);
  const cz = Math.cos(z / 2);

  quaternion[3] = cx * cy * cz - sx * sy * sz;
  quaternion[0] = sx * cy * cz + cx * sy * sz;
  quaternion[1] = cx * sy * cz - sx * cy * sz;
  quaternion[2] = cx * cy * sz + sx * sy * cz;
  return quaternion;
}

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

export default {
  fromEuler,
  identity,
};
