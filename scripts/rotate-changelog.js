const {execSync} = require('child_process');
const {existsSync, writeFileSync, copyFileSync} = require('fs');
const {join} = require('path');

const log = require('./helpers/log');
const nowVersion = require('./helpers/nowVersion')();

const ROOT = join(global.process.cwd(), 'changelog', 'public');
const newOldVersion = join(ROOT, `${nowVersion}.json`);
const latestVersion = join(ROOT, 'latest.json');

if (existsSync(join(ROOT, `${nowVersion}.json`))) {
  log.warn('It looks like the changelog has already been rotated. Aborting!');
  global.process.exit(1);
}

copyFileSync(latestVersion, newOldVersion);
writeFileSync(latestVersion, `{
  "sections": {
    "What's new": [
      "FIRST!"
    ],
    "Fixes": [
      "FIRST!"
    ]
  }
}
`);

const processOptions = {cwd: global.process.cwd(), stdio: 'inherit'};
execSync('git reset --mixed', processOptions);
execSync(`git add ${ROOT}`, {cwd: global.process.cwd(), stdio: 'inherit'});
execSync('git commit -m "auto: rotate changelog"', {cwd: global.process.cwd(), stdio: 'inherit'});
