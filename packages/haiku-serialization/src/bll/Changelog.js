const fs = require('fs')
const path = require('path')

const semver = require('semver')

const DEFAULT_CHANGELOG_PATH = path.join(__dirname, '..', '..', '..', '..', 'changelog/public')

class Changelog {
  constructor (
    lastViewedChangelog = process.env.HAIKU_RELEASE_VERSION,
    changelogPath = DEFAULT_CHANGELOG_PATH
  ) {
    this.cachedChangelog = null
    this.lastViewedChangelog = lastViewedChangelog
    this.changelogPath = changelogPath
  }

  readSingleChangelog (changelog) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(this.changelogPath, changelog), 'utf8', (err, content) => {
        err ? reject(err) : resolve(JSON.parse(content))
      })
    })
  }

  readChangelogs () {
    const rawChangelogs = fs.readdirSync(this.changelogPath, 'utf8').filter(
      (filename) => {
        return filename === 'latest.json' ||
          semver.gt(path.basename(filename, '.json'), this.lastViewedChangelog || '0.0.0')
      }
    ).sort((a, b) => {
      if (b === 'latest.json') {
        return -1
      }

      if (a === 'latest.json') {
        return 1
      }

      return semver.lt(path.basename(a, '.json'), path.basename(b, '.json')) ? -1 : 1
    })

    return Promise.all(rawChangelogs.map((changelogFilename) => this.readSingleChangelog(changelogFilename)))
  }

  getChangelog () {
    return new Promise((resolve, reject) => {
      if (this.cachedChangelog) {
        resolve(this.cachedChangelog)
      } else {
        this.readChangelogs()
          .then((changelogs) => {
            const latest = changelogs[changelogs.length - 1]
            const outputSections = {}

            for (const changelog of changelogs) {
              for (const section in changelog.sections) {
                outputSections[section] = [
                  ...changelog.sections[section],
                  ...(outputSections[section] ? outputSections[section] : [])
                ]
              }
            }

            latest.sections = outputSections
            this.cachedChangelog = latest
            resolve(latest)
          })
          .catch((error) => {
            reject(error)
          })
      }
    })
  }
}

module.exports = Changelog
