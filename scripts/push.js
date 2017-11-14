const cp = require('child_process')
const path = require('path')
const argv = require('yargs').argv
const ROOT = path.join(__dirname, '..')

// pull standalone remotes
if (!argv['no-pull']) {
  cp.execSync(`node ./scripts/git-subtree-pull.js --package=haiku-player`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`node ./scripts/git-subtree-pull.js --package=haiku-cli`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`node ./scripts/git-subtree-pull.js --package=haiku-sdk-client`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`node ./scripts/git-subtree-pull.js --package=haiku-sdk-inkstone`, { cwd: ROOT, stdio: 'inherit' })
}

// bump semver in all projects, plus their @haiku/* dependencies, and commit
cp.execSync(`node ./scripts/semver.js --non-interactive`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git add --all .`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git commit -m "auto: Update"`, { cwd: ROOT, stdio: 'inherit' })

// regenerate changelog and push to remote
cp.execSync(`node ./scripts/changelog.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git add --all .`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git commit -m "auto: Update changelog"`, { cwd: ROOT, stdio: 'inherit' })
if (!argv['no-remote']) {
  cp.execSync(`node ./scripts/git-subtree-push.js --package=changelog`, { cwd: ROOT, stdio: 'inherit' })
}

// compile packages
cp.execSync(`node ./scripts/build-player.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/compile-package.js --package=haiku-sdk-inkstone --uglify=lib/**/*.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/compile-package.js --package=haiku-sdk-client --uglify=lib/**/*.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/compile-package.js --package=haiku-cli`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git add --all .`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git commit -m "auto: Recompile libs"`, { cwd: ROOT, stdio: 'inherit' })

// publish packages to npm registry and cdn
cp.execSync(`node ./scripts/upload-cdn-player.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/publish-package.js --package=haiku-player`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/publish-package.js --package=haiku-sdk-inkstone`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/publish-package.js --package=haiku-sdk-client`, { cwd: ROOT, stdio: 'inherit' })

// update dependants' yarn.lock files appropriately
cp.execSync(`yarn install`, { cwd: path.join(ROOT, 'packages', 'haiku-cli'), stdio: 'inherit' })
cp.execSync(`yarn install`, { cwd: path.join(ROOT, 'packages', 'haiku-serialization'), stdio: 'inherit' })
cp.execSync(`yarn install`, { cwd: path.join(ROOT, 'packages', 'haiku-creator'), stdio: 'inherit' })
cp.execSync(`yarn install`, { cwd: path.join(ROOT, 'packages', 'haiku-plumbing'), stdio: 'inherit' })
cp.execSync(`git add --all .`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git commit -m "auto: Reinstall"`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/publish-package.js --package=haiku-cli`, { cwd: ROOT, stdio: 'inherit' })

// push standalone remotes
cp.execSync(`node ./scripts/git-subtree-push.js --package=haiku-player`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/git-subtree-push.js --package=haiku-cli`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/git-subtree-push.js --package=haiku-sdk-client`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/git-subtree-push.js --package=haiku-sdk-inkstone`, { cwd: ROOT, stdio: 'inherit' })
