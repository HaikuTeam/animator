export default function normalize(out, mat) {
  const m44 = mat[15];
  // Cannot normalize.
  if (m44 === 0) {
    return false;
  }
  const scale = 1 / m44;
  for (let i = 0; i < 16; i++) {
    out[i] = mat[i] * scale;
  }
  return true;
}
