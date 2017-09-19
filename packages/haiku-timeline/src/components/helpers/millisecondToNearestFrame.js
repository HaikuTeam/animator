export default function millisecondToNearestFrame (msValue, mspf) {
  return Math.round(msValue / mspf)
}
