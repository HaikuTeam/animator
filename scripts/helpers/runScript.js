const cp = require('child_process');
const path = require('path');

const ROOT = global.process.cwd();

module.exports = function runScript(name, args, cb) {
  const child = cp.fork(path.join(__dirname, '..', `${name}.js`), args || [], {stdio: 'inherit', cwd: ROOT});
  child.on('close', (code) => {
    if (code !== 0) return cb(new Error(`Error in ${name}`));
    return cb();
  });
};
