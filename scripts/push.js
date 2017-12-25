const cp = require('child_process')
const fse = require('fs-extra')
const path = require('path')
const argv = require('yargs').argv

const getPackages = require('./helpers/allPackages')
const depTypes = require('./helpers/depTypes')
const nowVersion = require('./helpers/nowVersion')

const ROOT = global.process.cwd()
const processOptions = { cwd: ROOT, stdio: 'inherit' }

// The set of all projects we want to open source.
const openSourceProjects = new Set(['haiku-player', 'haiku-cli'])

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

    depTypes.forEach((depType) => {
      if (!pack.pkg.hasOwnProperty(depType)) {
        return
      }

      Object.values(pack.pkg[depType]).forEach((depVersion) => {
        const matches = depVersion.match(/^HaikuTeam\/(.+)\.git$/)
        if (matches && !processedDependencies.has(`haiku-${matches[1]}`)) {
          foundNewDeps = true
          openSourcePackages.push(...getPackages(`haiku-${matches[1]}`))
        }
      })
    })

    processedDependencies.add(pack.name)
  })
} while (foundNewDeps)

// Pull standalone remotes.
if (!argv['no-pull']) {
  openSourcePackages.forEach((pack) => {
    cp.execSync(`node ./scripts/git-subtree-pull.js --package=${pack.name}`, processOptions)
  })
}
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

if (!argv['no-remote']) {
  cp.execSync(`node ./scripts/git-subtree-push.js --package=changelog`, processOptions)
}

// Compile packages.
cp.execSync('yarn install', processOptions)
cp.execSync('yarn compile-all', processOptions)
openSourcePackages.forEach((pack) => {
  const compileCommand = `node ./scripts/compile-package.js --package=${pack.name}`
  if (openSourceProjects.has(pack.name)) {
    cp.execSync(compileCommand, processOptions)
  } else {
    // Uglify pure dependencies.
    cp.execSync(`${compileCommand} --uglify=lib/**/*.js`, processOptions)
  }
})

// Player needs a special build.
cp.execSync(`node ./scripts/build-player.js --skip-compile=1`, processOptions)

const semver = nowVersion()
openSourcePackages.forEach((pack) => {
  depTypes.forEach((depType) => {
    if (!pack.pkg.hasOwnProperty(depType)) {
      return
    }

    for (const dep in pack.pkg[depType]) {
      if (/^HaikuTeam\/(.+)\.git$/.test(pack.pkg[depType][dep])) {
        pack.pkg[depType][dep] = semver
      }
    }
  })

  // We're using the dependencies we loaded *before* bumping semver, so will need to update it again before writing
  // it out.
  pack.pkg.version = semver
  fse.writeFileSync(path.join(pack.abspath, 'package.json'), JSON.stringify(pack.pkg, null, 2) + '\n')
  // Publish package to NPM as is.
  cp.execSync(`node ./scripts/publish-package.js --package=${pack.name}`, processOptions)
})

// Now that we have published, revert to evergreen dependencies.
openSourcePackages.forEach((pack) => {
  cp.execSync(`git checkout ${path.join(pack.abspath, 'package.json')}`)
})

// Publish Player to CDN.
cp.execSync(`node ./scripts/upload-cdn-player.js`, processOptions)

// Push standalone remotes.
if (!argv['no-remote']) {
  openSourcePackages.forEach((pack) => {
    cp.execSync(`node ./scripts/git-subtree-push.js --package=${pack.name}`, processOptions)
  })
}
