function millisecondToNearestFrame (msValue, mspf) {
  return Math.round(msValue / mspf)
}

module.exports = millisecondToNearestFrame
