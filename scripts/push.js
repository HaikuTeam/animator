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
const openSourcePackages = getPackages(Array.from(openSourceProjects))

// Pull in the set of dependencies recursively.
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
cp.execSync('yarn sync', processOptions)
openSourcePackages.forEach((pack) => {
  const compileCommand = `node ./scripts/compile-package.js --package=${pack.name}`;
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

  fse.writeFileSync(path.join(pack.abspath, 'package.json'), JSON.stringify(pack.pkg, null, 2) + '\n')
  // Publish package to NPM as is.
  cp.execSync(`node ./scripts/publish-package.js --package=${pack.name}`, processOptions)
})

// Rewrite lockfiles, then revert changes in package.json.
openSourcePackages.forEach((pack) => {
  cp.execSync(
    `yarn install --mutex file:/tmp/.yarn_mono_lock --cache-folder="/tmp/.yarn_mono_cache" --ignore-engines \
      --non-interactive`,
    { cwd: pack.abspath, stdio: 'inherit' }
  )

  cp.execSync(`git checkout ${path.join(pack.abspath, 'package.json')}`)
})
cp.execSync(`git add -u`, processOptions)
cp.execSync(`git commit -m "auto: Bump open-source dependency versions."`, processOptions)

// Publish Player to CDN.
cp.execSync(`node ./scripts/upload-cdn-player.js`, processOptions)

// Push standalone remotes.
if (!argv['no-remote']) {
  openSourcePackages.forEach((pack) => {
    cp.execSync(`node ./scripts/git-subtree-push.js --package=${pack.name}`, processOptions)
  })
}
