const lodash = require('lodash')
const fse = require('fs-extra')
const path = require('path')
const argv = require('yargs').argv
const semver = require('semver')
const inquirer = require('inquirer')
const log = require('./helpers/log')
const getSemverTop = require('./helpers/getSemverTop')
const allPackages = require('./helpers/allPackages')()

const current = getSemverTop()
const patched = semver.inc(current, 'patch')

const DEFAULTS = {
  version: patched
}

const INTERNAL_YET_PUBLIC_DEP_NAMES = {
  '@haiku/player': true,
  '@haiku/cli': true,
  '@haiku/sdk-client': true,
  '@haiku/sdk-inkstone': true
}

const inputs = lodash.assign({}, DEFAULTS, argv)

if (argv['non-interactive']) {
  go()
} else {
  inquirer.prompt([
    {
      type: 'input',
      name: 'version',
      message: 'Enter version to set in all projects:',
      default: inputs.version
    }
  ]).then(function (answers) {
    lodash.assign(inputs, answers)

    if (semver.lt(inputs.version, current)) {
      throw new Error('You cannot set a lower version than the current one')
    }

    log.hat('setting version to ' + inputs.version)

    go()
  })
}

function go () {
  lodash.forEach(allPackages, function (pack) {
    const packageJsonPath = path.join(pack.abspath, 'package.json')
    const packageJson = fse.readJsonSync(packageJsonPath)

    log.log('setting ' + pack.name + ' to ' + inputs.version + ' (was ' + packageJson.version + ')')

    packageJson.version = inputs.version

    // Now make sure this package's @haiku/* dependencies match that version
    const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
    depTypes.forEach((depType) => {
      if (!packageJson[depType]) return null
      for (const depName in packageJson[depType]) {
        const depVersion = packageJson[depType][depName]
        // Don't bump dep version if it's using the internal git dependency reference
        if (depVersion.match(/HaikuTeam/)) continue
        // Only bump version if referring to a public version of one of our packages
        // For example, we wouldn't want to bump the version of @haiku/zack-myproject
        if (!INTERNAL_YET_PUBLIC_DEP_NAMES[depName]) continue
        packageJson[depType][depName] = inputs.version
      }
    })

    fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  })

  const monoJsonPath = path.join(__dirname, '..', 'package.json')
  const monoJson = fse.readJsonSync(monoJsonPath)

  log.log('setting mono to ' + inputs.version + ' (was ' + monoJson.version + ')')

  monoJson.version = inputs.version
  fse.writeFileSync(monoJsonPath, JSON.stringify(monoJson, null, 2) + '\n')

  log.log('done!')
}
