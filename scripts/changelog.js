const async = require('async');
const cp = require('child_process');
const path = require('path');
const fse = require('fs-extra');
const semverSort = require('semver-sort');
const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();
let ROOT = path.join(__dirname, '..');
let CHANGELOG_JSON = path.join(ROOT, 'changelog/changelog.json');
let CHANGELOG_MD = path.join(ROOT, 'changelog/CHANGELOG.md');

let monoPkg = fse.readJsonSync(path.join(ROOT, 'package.json'));
let monoVersion = monoPkg.version;

let changelog = fse.readJsonSync(CHANGELOG_JSON);
if (!changelog[monoVersion]) {
  changelog[monoVersion] = {};
}

log.hat(`updating changelog with commits in version ${monoVersion}`);

let LABELS = {
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
  fun: true,
};

let MARKDOWN_LABELS = {
  feat: 'Features',
  fix: 'Bug Fixes',
  docs: 'Documentation',
  refactor: 'Refactors',
  perf: 'Performance',
};

// Whitelist of labels we will include in the public changelog
let PUBLIC_CHANGELOG_LABELS = {
  feat: true,
  fix: true,
  docs: true,
};

function isLineAlreadyInChangelog (line) {
  for (const version in changelog) {
    const changeset = changelog[version];
    for (const sha in changeset) {
      if (sha === line.sha) {
        return true;
      }
    }
  }
  return false;
}

async.eachSeries(allPackages, (pack, next) => {
  const chunk = cp.execSync('git log --pretty=oneline', {cwd: pack.abspath}).toString().trim();

  const lines = chunk.split('\n').map((line) => {
    const sha = line.slice(0, 40);
    const msg = line.slice(41);

    const msgParts = msg.split(': ');
    const labelPart = msgParts[0];
    const textPart = msgParts[1]; // TODO: Handle edge case if somebody put "blah: " in their message too

    if (LABELS[labelPart]) {
      return {
        sha,
        label: labelPart,
        message: textPart,
      };
    }

    // Null signals we don't care about this commit
    return null;
  }).filter((line) => {
    // Skip any nulls (lines that didn't have the right format)
    return line;
  });

  const publicLines = lines.filter((line) => {
    return line.message && line.sha && PUBLIC_CHANGELOG_LABELS[line.label];
  });

  // Only worry about the most recent 50 commits per project (speed things up not to go thru them all?)
  publicLines.splice(50);

  const notYetAddedLines = publicLines.filter((line) => {
    return !isLineAlreadyInChangelog(line);
  });

  notYetAddedLines.forEach((line) => {
    log.log(`${pack.name} ${line.sha} (${line.label}) ${line.message.slice(0, 50)}`);
    changelog[monoVersion][line.sha] = {
      project: pack.name,
      label: line.label,
      message: line.message,
    };
  });

  return next();
}, () => {
  fse.writeJsonSync(CHANGELOG_JSON, changelog, {spaces: 2});
  generateMarkdownSync(changelog);
  log.hat(`changelog updated`, 'green');
});

function generateMarkdownSync (changelogSpec) {
  let markdown = '# Changelog\n\n';

  const unsortedVersions = [];
  for (const version in changelogSpec) {
    unsortedVersions.push(version);
  }

  const sortedVersions = semverSort.desc(unsortedVersions);

  sortedVersions.forEach((version) => {
    markdown += '\n## ' + version + '\n';

    const changeset = changelogSpec[version];
    const changesetGroups = {};
    for (const sha in changeset) {
      const change = changeset[sha];

      // only add the labels we care about
      if (MARKDOWN_LABELS[change.label]) {
        changesetGroups[change.label] = changesetGroups[change.label] || [];
        changesetGroups[change.label].push(change.message);
      }
    }

    for (const group in changesetGroups) {
      markdown += '\n### ' + MARKDOWN_LABELS[group] + '\n\n';
      const messages = changesetGroups[group];
      messages.forEach((msg) => {
        markdown += ' * ' + msg + '\n';
      });
    }

    fse.writeFileSync(CHANGELOG_MD, markdown);
  });
}
