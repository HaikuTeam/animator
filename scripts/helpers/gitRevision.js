const child_process = require('child_process');

module.exports = () => child_process.execSync('git rev-parse HEAD').toString().trim();
