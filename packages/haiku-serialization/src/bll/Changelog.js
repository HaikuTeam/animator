const fs = require('fs')
const path = require('path')

class Changelog {
  constructor(
    lastViewedChangelog = '0.0.0',
    changelogPath = 'changelog/public'
  ) {
    this.cachedChangelog = null
    this.lastViewedChangelog = lastViewedChangelog
    this.changelogPath = changelogPath
  }

  readSingleChangelog(changelog) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(this.changelogPath, changelog), 'utf8', (err, content) => {
        err ? reject(err) : resolve(JSON.parse(content))
      })
    })
  }

  readChangelogs() {
    const dir = fs.readdirSync(this.changelogPath, 'utf8')
    const pos = dir.indexOf(`${this.lastViewedChangelog}.json`)
    const rawChangelogs = pos === -1 ? dir : dir.slice(pos + 1)

    return Promise.all(rawChangelogs.map(this.readSingleChangelog.bind(this)))
  }

  getChangelog() {
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
