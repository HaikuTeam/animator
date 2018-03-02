const fs = require('fs')

class Changelog {
  constructor (lastViewedChangelog = '0.0.0', changelogPath = 'changelog/public') {
    this.cachedChangelog = null
    this.lastViewedChangelog = lastViewedChangelog
    this.changelogPath = changelogPath
  }

  readSingleChangelog (changelog) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.changelogPath + changelog, 'utf8', (err, content) => {
        err ? reject(err) : resolve(JSON.parse(content))
      })
    })
  }

  async readChangelogs () {
    const dir = fs.readdirSync(this.changelogPath, 'utf8')
    const pos = dir.indexOf(`${this.lastViewedChangelog}.json`)
    const rawChangelogs = pos === -1 ? dir : dir.slice(pos + 1)

    return Promise.all(rawChangelogs.map(this.readSingleChangelog.bind(this)))
  }

  async getChangelog () {
    if (this.cachedChangelog) {
      return this.cachedChangelog
    } else {
      const changelogs = await this.readChangelogs()
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
      return latest
    }
  }
}

module.exports = Changelog
