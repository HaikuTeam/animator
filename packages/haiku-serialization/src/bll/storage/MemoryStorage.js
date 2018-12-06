class MemoryStorage {
  store (key, pojo) {
    MemoryStorage.data[key] = pojo;
    return pojo;
  }

  unstore (key) {
    return MemoryStorage.data[key];
  }
}

MemoryStorage.data = {};

module.exports = MemoryStorage;
