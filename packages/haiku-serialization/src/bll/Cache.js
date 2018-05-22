class Cache {
  constructor (data = {}) {
    this.data = data
  }

  reset (data = {}) {
    this.data = data
  }

  clear () {
    this.data = {}
  }

  get (key) {
    return this.data[key]
  }

  set (key, value) {
    this.data[key] = value
  }

  unset (key) {
    this.data[key] = undefined
  }

  fetch (key, provider) {
    const found = this.get(key)

    if (found !== undefined) {
      return found
    }

    const given = provider()

    this.set(key, given)

    return given
  }
}

module.exports = Cache
