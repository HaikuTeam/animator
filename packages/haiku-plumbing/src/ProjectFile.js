import * as fse from 'haiku-fs-extra';
import * as path from 'path';

export function ensure (folder, filepath, cb) {
  return fse.ensureFile(path.join(folder, filepath), (ensureErr) => {
    if (ensureErr) {
      return cb(ensureErr);
    }
    return cb();
  });
}

export function read (folder, filepath, cb) {
  return fse.readFile(path.join(folder, filepath), (readErr, buffer) => {
    if (readErr) {
      return cb(readErr);
    }
    const contents = buffer.toString();
    return cb(null, contents);
  });
}

export function write (folder, filepath, contents, cb) {
  return fse.writeFile(path.join(folder, filepath), contents, (writeErr) => {
    if (writeErr) {
      return cb(writeErr);
    }
    return cb(null, contents);
  });
}

export function update (folder, filepath, modifierFunction, cb) {
  return ensure(folder, filepath, (ensureErr) => {
    if (ensureErr) {
      return cb(ensureErr);
    }
    return read(folder, filepath, (readErr, contents) => {
      if (readErr) {
        return cb(readErr);
      }
      const modified = modifierFunction(contents); // Expected to modify in-place
      return write(folder, filepath, modified, (writeErr) => {
        if (writeErr) {
          return cb(writeErr);
        }
        return cb(null, modified);
      });
    });
  });
}
