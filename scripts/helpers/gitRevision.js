const childProcess = require('child_process');

module.exports = () => childProcess.execSync('git rev-parse HEAD').toString().trim();
