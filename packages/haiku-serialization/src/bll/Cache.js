class Cache {
  constructor (data = {}) {
    this.data = data;
  }

  reset (data = {}) {
    this.data = data;
  }

  clear () {
    this.data = {};
  }

  get (key) {
    return this.data[key];
  }

  set (key, value) {
    this.data[key] = value;
  }

  unset (key) {
    this.data[key] = undefined;
  }

  fetch (key, provider, postproc) {
    const found = this.get(key);

    if (found !== undefined) {
      return (postproc) ? postproc(found) : found;
    }

    const given = provider();

    this.set(key, given);

    return (postproc) ? postproc(given) : given;
  }

  async (key, provider, cb, postproc) {
    const found = this.get(key);

    if (found !== undefined) {
      return cb(null, (postproc) ? postproc(found) : found);
    }

    return provider((err, given) => {
      if (err) {
        return cb(err);
      }

      this.set(key, given);

      return cb(null, (postproc) ? postproc(given) : given);
    });
  }
}

module.exports = Cache;
