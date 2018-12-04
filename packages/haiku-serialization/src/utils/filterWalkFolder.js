let fse = require('haiku-fs-extra');
let path = require('path');

module.exports = (dir, filter, done) => {
  const items = [];
  return fse.walk(dir)
    .on('data', (item) => {
      if (!filter) {
        return items.push(item);
      }
      if (filter(item.path, null, item, path.relative(dir, item.path))) {
        return items.push(item);
      }
    })
    .on('end', () => done(null, items))
    .on('error', done);
};
