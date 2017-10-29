function mod (idx, max) {
  return (idx % max + max) % max
}

module.exports = mod
