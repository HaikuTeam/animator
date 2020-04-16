const fse = require('fs-extra');
const cp = require('child_process');
const path = require('path');
const nowVersion = require('./helpers/nowVersion');
// This line should be commented to build locally on windows
const deploy = require('./deploy');
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction');

require('./../config');
forceNodeEnvProduction();

const ROOT = global.process.cwd();

const platform = process.env.HAIKU_RELEASE_PLATFORM;
switch (platform) {
  case 'mac':
    process.env.CSC_LINK = `file://${deploy.vault}/${deploy.certificate}`;
    process.env.CSC_KEY_PASSWORD = fse.readFileSync(path.join(deploy.vault, `${deploy.certificate}.password`)).toString().trim();

    cp.execSync(`yarn electron-builder --mac --publish=never`, {cwd: ROOT, stdio: 'inherit'});
    // The latest build chain breaks our zip archive, so we need to manually zip it.
    const distRoot = path.resolve(ROOT, 'dist');
    const {productName} = require(path.join(ROOT, 'package.json')).build;
    const zipTarget = path.join(distRoot, `${productName}-${nowVersion()}-mac.zip`);
    cp.execSync(`/usr/bin/ditto -c -k --sequesterRsrc --keepParent '${productName}.app' '${zipTarget}'`, {cwd: path.join(distRoot, 'mac'), stdio: 'inherit'});
    break;
  case 'windows':
    // TODO: sign packages on Windows
    // process.env.WIN_CSC_LINK = `file://${deploy.vault}/${deploy.certificate}`
    // process.env.WIN_CSC_KEY_PASSWORD = fse.readFileSync(path.join(deploy.vault, `${deploy.certificate}.password`)).toString().trim()
    cp.execSync('yarn electron-builder --windows --publish=never --config.forceCodeSigning=false --x64 --ia32', {cwd: ROOT, stdio: 'inherit'});
    break;
  case 'linux':
    cp.execSync(`yarn electron-builder --linux --publish=never`, {cwd: ROOT, stdio: 'inherit'});
    break;
  default:
    throw new Error(`Unexpected platform: ${platform}`);
}
