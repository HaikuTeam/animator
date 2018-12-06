const nodehook = require('node-hook');
const path = require('path');
const remapSource = require('../ast/remapSource');

module.exports = (cb, remapParams, iterator) => {
  nodehook.hook('.js', (source, filename) => {
    if (path.basename(filename) !== 'code.js') {
      return source;
    }
    const updated = remapSource(source, remapParams);
    if (iterator) {
      iterator(filename, updated, source);
    }
    return updated;
  });

  return cb(() => nodehook.unhook('.js'));
};
