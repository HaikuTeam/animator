const cp = require('child_process')

const getPackages = require('./helpers/packages')

const ROOT = global.process.cwd()
const processOptions = { cwd: ROOT, stdio: 'inherit' }

// The set of all projects we want to open source.
const openSourceProjects = new Set(['@haiku/player', '@haiku/cli'])

// Pull in the set of dependencies recursively.
const openSourcePackages = getPackages(Array.from(openSourceProjects))
const processedDependencies = new Set()
let foundNewDeps
do {
  foundNewDeps = false
  openSourcePackages.forEach((pack) => {
    if (processedDependencies.has(pack.name)) {
      return
    }

    if (pack.deps.size > 0) {
      openSourcePackages.push(...getPackages(Array.from(pack.deps)))
      foundNewDeps = true
    }

    processedDependencies.add(pack.name)
  })
} while (foundNewDeps)

// Pull standalone remotes.
openSourcePackages.forEach((pack) => {
  cp.execSync(`node ./scripts/git-subtree-pull.js --package=${pack.name}`, processOptions)
})

cp.execSync(`node ./scripts/git-subtree-pull.js --package=changelog`, processOptions)

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
  if (!openSourceProjects.has(pack.name)) {
    // Uglify pure dependencies.
    cp.execSync(`${compileCommand} --uglify=lib/**/*.js`, processOptions)
  }
})

// Player needs a special build.
cp.execSync(`node ./scripts/build-player.js --skip-compile=1`, processOptions)

openSourcePackages.forEach((pack) => {
  // Publish package to NPM as is.
  cp.execSync(`node ./scripts/publish-package.js --package=${pack.name}`, processOptions)
})

// Publish Player to CDN.
cp.execSync(`node ./scripts/upload-cdn-player.js`, processOptions)

// Push standalone remotes.
openSourcePackages.forEach((pack) => {
  cp.execSync(`node ./scripts/git-subtree-push.js --package=${pack.name}`, processOptions)
})
cp.execSync(`node ./scripts/git-subtree-push.js --package=changelog`, processOptions)
