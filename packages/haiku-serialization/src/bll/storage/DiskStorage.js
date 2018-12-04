const fse = require('haiku-fs-extra');
const path = require('path');

const {
  HOMEDIR_MODEL_STORAGE_PATH,
} = require('./../../utils/HaikuHomeDir');

fse.mkdirpSync(HOMEDIR_MODEL_STORAGE_PATH);

class DiskStorage {
  store (key, pojo) {
    fse.writeJsonSync(
      path.join(HOMEDIR_MODEL_STORAGE_PATH, `${key}.json`),
      pojo,
      {spaces: 2},
    );
    return pojo;
  }

  unstore (key) {
    return fse.readJsonSync(
      path.join(HOMEDIR_MODEL_STORAGE_PATH, `${key}.json`),
    );
  }
}

module.exports = DiskStorage;
