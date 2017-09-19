var async = require('async')
var cp = require('child_process')
var path = require('path')
var fse = require('fs-extra')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')
var CHANGELOG_JSON = path.join(ROOT, 'changelog/changelog.json')
var CHANGELOG_MD = path.join(ROOT, 'changelog/CHANGELOG.md')

var monoPkg = fse.readJsonSync(path.join(ROOT, 'package.json'))
var monoVersion = monoPkg.version

var changelog = fse.readJsonSync(CHANGELOG_JSON)
if (!changelog[monoVersion]) changelog[monoVersion] = {}

log.hat(`updating changelog with commits in version ${monoVersion}`)

var LABELS = {
  // angularjs recommended
  feat: true,
  fix: true,
  docs: true,
  style: true,
  refactor: true,
  perf: true,
  test: true,
  chore: true,
  // matthew's additions
  auto: true,
  hack: true,
  lint: true,
  wip: true,
  sorry: true,
  fun: true
}

var MARKDOWN_LABELS = {
  feat: "Features",
  fix: "Bug Fixes",
  docs: "Documentation",
  refactor: "Refactors",
  perf: "Performance"
}

// Whitelist of labels we will include in the public changelog
var PUBLIC_CHANGELOG_LABELS = {
  feat: true,
  fix: true,
  docs: true
}

function isLineAlreadyInChangelog (line) {
  for (var version in changelog) {
    var changeset = changelog[version]
    for (var sha in changeset) {
      if (sha === line.sha) return true
    }
  }
  return false
}

async.eachSeries(allPackages, function (pack, next) {
  var chunk = cp.execSync('git log --pretty=oneline', { cwd: pack.abspath }).toString().trim()

  var lines = chunk.split('\n').map(function (line) {
    var sha = line.slice(0, 40)
    var msg = line.slice(41)

    var msgParts = msg.split(': ')
    var labelPart = msgParts[0]
    var textPart = msgParts[1] // TODO: Handle edge case if somebody put "blah: " in their message too

    if (LABELS[labelPart]) {
      return {
        sha: sha,
        label: labelPart,
        message: textPart
      }
    } else {
      // Null signals we don't care about this commit
      return null
    }
  }).filter(function (line) {
    // Skip any nulls (lines that didn't have the right format)
    return line
  })

  var publicLines = lines.filter(function (line) {
    return line.message && line.sha && PUBLIC_CHANGELOG_LABELS[line.label]
  })

  // Only worry about the most recent 50 commits per project (speed things up not to go thru them all?)
  publicLines.splice(50)

  var notYetAddedLines = publicLines.filter(function (line) {
    return !isLineAlreadyInChangelog(line)
  })

  notYetAddedLines.forEach(function (line) {
    log.log(`${pack.name} ${line.sha} (${line.label}) ${line.message.slice(0, 50)}`)
    changelog[monoVersion][line.sha] = {
      project: pack.name,
      label: line.label,
      message: line.message
    }
  })

  return next()
}, () => {
  fse.writeJsonSync(CHANGELOG_JSON, changelog, { spaces: 2 })
  generateMarkdownSync(changelog)
  log.hat(`changelog updated`, 'green')
})

function generateMarkdownSync(changelog) {
  var markdown = '# Changelog\n\n'

  for (var version in changelog) {

    markdown += '\n## ' + version + "\n"
    
    var changeset = changelog[version]
    var changesetGroups = {}
    for (var sha in changeset) {
      var change = changeset[sha]
      
      //only add the labels we care about
      if(MARKDOWN_LABELS[change.label]){
        changesetGroups[change.label] = changesetGroups[change.label] || []
        changesetGroups[change.label].push(change.message)
      }
    }

    for(var group in changesetGroups) {
      markdown += '\n### ' + MARKDOWN_LABELS[group] + "\n\n"
      var messages = changesetGroups[group]
      messages.forEach((msg) => {
        markdown += ' * ' + msg + "\n"
      })
    }
  }

  fse.writeFileSync(CHANGELOG_MD, markdown)
}