const cp = require('child_process');
const fse = require('fs-extra');
const path = require('path');

const log = require('./helpers/log');
const runFlakyCommand = require('./helpers/runFlakyCommand');

const processOptions = {cwd: global.process.cwd(), stdio: 'inherit'};

runFlakyCommand(() => {
  cp.execSync('yarn install', processOptions);
  log.hat('installed dependencies');
}, 'mono yarn install', 10);

const gitHooksPath = path.join(global.process.cwd(), '.git', 'hooks');
const repoHooksPath = path.join(global.process.cwd(), 'hooks');
if (fse.existsSync(gitHooksPath)) {
  fse.removeSync(gitHooksPath);
}

fse.link(repoHooksPath, gitHooksPath, () => {
  log.hat('installed hooks');
});
