const cp = require('child_process')

const openSourcePackages = require('./helpers/openSourcePackages')
const openSourceProjects = require('./helpers/openSourceProjects')
const nowVersion = require('./helpers/nowVersion')

const ROOT = global.process.cwd()
const processOptions = { cwd: ROOT, stdio: 'inherit' }

// Perform hard reset.
cp.execSync(`git reset --hard origin/master`)

// Pull standalone remotes.
cp.execSync(`node ./scripts/git-subtree-pull.js --package=all`, processOptions)

// Bump semver in all projects, plus their @haiku/* dependencies, and commit.
cp.execSync(`node ./scripts/semver.js --non-interactive`, processOptions)
cp.execSync(`git add -u`, processOptions)
cp.execSync(`git commit -m "auto: Bumps semver."`, processOptions)

// Regenerate changelog and push to remote.
cp.execSync(`node ./scripts/changelog.js`, processOptions)
cp.execSync(`git add -u`, processOptions)

// git commit might fail if there is no changelog. Not a big deal.
try {
  cp.execSync(`git commit -m "auto: Updates changelog."`, processOptions)
} catch (e) {}

// Compile packages.
cp.execSync('yarn install --frozen-lockfile', processOptions)
cp.execSync('yarn compile-all --force', processOptions)
openSourcePackages.forEach((pack) => {
  const compileCommand = `node ./scripts/compile-package.js --package=${pack.name}`
  if (!openSourceProjects.has(pack.name) || pack.name.startsWith('haiku-')) {
    // Uglify pure dependencies.
    cp.execSync(`${compileCommand} --uglify=lib/**/*.js`, processOptions)
  }
})

// @haiku/core needs a special build.
cp.execSync(`node ./scripts/build-core.js --skip-compile=1`, processOptions)

// Push up before we begin the actual work of publishing. This ensures that unmergeable changes are never published to
// our standalones.
cp.execSync('git fetch')
cp.execSync('git merge origin/master')
cp.execSync(`git tag -a ${nowVersion()} -m 'release ${nowVersion()}'`)
cp.execSync(`git push -u origin rc-${nowVersion()} --tags`)

openSourcePackages.forEach((pack) => {
  // Publish package to NPM as is.
  cp.execSync(`node ./scripts/publish-package.js --package=${pack.name}`, processOptions)
})

// Publish @haiku/core to CDN.
cp.execSync(`node ./scripts/upload-cdn-core.js`, processOptions)

// Push standalone remotes.
openSourcePackages.forEach((pack) => {
  cp.execSync(`node ./scripts/git-subtree-push.js --package=${pack.name}`, processOptions)
})
cp.execSync(`node ./scripts/git-subtree-push.js --package=changelog`, processOptions)
