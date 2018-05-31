import tmp from 'tmp';
import haikuFsExtra from 'haiku-fs-extra';
import * as path from 'path';
import randomAlphabetical from 'haiku-serialization/src/utils/randomAlphabetical';

export default (cb) => {
  return tmp.dir({unsafeCleanup: true}, (err, dir, cleanup) => {
    if (err) {
      throw err;
    }

    const folder = path.join(dir, randomAlphabetical());

    haikuFsExtra.mkdirpSync(folder);

    return cb(folder, cleanup);
  });
};
