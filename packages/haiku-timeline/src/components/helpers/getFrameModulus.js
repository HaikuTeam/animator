// return value means "show every nth frame"
export default function getFrameModulus (pxpf) {
  if (pxpf >= 20) return 1
  if (pxpf >= 15) return 2
  if (pxpf >= 10) return 5
  if (pxpf >= 5) return 10
  if (pxpf === 4) return 15
  if (pxpf === 3) return 20
  if (pxpf === 2) return 30
  return 50
}
