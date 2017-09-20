export default function getMillisecondModulus (pxpf) {
  if (pxpf >= 20) return 25
  if (pxpf >= 15) return 50
  if (pxpf >= 10) return 100
  if (pxpf >= 5) return 200
  if (pxpf === 4) return 250
  if (pxpf === 3) return 500
  if (pxpf === 2) return 1000
  return 5000
}
