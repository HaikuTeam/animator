const async = require('async')
const cp = require('child_process')
const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv

const allPackages = require('./helpers/packages')()
const log = require('./helpers/log')

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development'
}

async.each(allPackages, (pack, done) => {
  if (pack.pkg && pack.pkg.scripts && pack.pkg.scripts.compile) {
    const lastCompileFilename = path.join(pack.abspath, '.last-compile')
    let timeFilter = ''
    if (!argv.force && fs.existsSync(lastCompileFilename)) {
      const lastCompile = require(lastCompileFilename)
      if (lastCompile.hasOwnProperty('lastCompileTime')) {
        timeFilter = `-newermt '${lastCompile.lastCompileTime}'`
      }
    }
    const filesChanged = Number(
      cp.execSync(`find ${pack.abspath}/src -type f ${timeFilter} | wc -l | tr -d ' '`).toString().trim()
    )

    if (filesChanged > 0) {
      log.warn(`Detected ${filesChanged} changed file(s) in ${pack.shortname}. Compiling....`)
      cp.execSync('yarn run compile', { cwd: pack.abspath, stdio: 'inherit' })
    } else {
      log.log(`No changes in ${pack.shortname} since last compile. Skipping....`)
    }

    const lastCompileTime = cp.execSync('date').toString().trim()
    fs.writeFileSync(lastCompileFilename, `module.exports = ${JSON.stringify({lastCompileTime})};`)
    done()
  } else {
    done()
  }
})
