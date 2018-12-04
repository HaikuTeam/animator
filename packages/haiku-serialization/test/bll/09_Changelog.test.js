const tape = require('tape');
const Changelog = require('./../../src/bll/Changelog');

tape('Changelog.readSingleChangelog reads and parses a single changelog file', async (t) => {
  t.plan(2);

  try {
    const changelogManager = new Changelog('0.0.0', 'test/fixtures/changelog/');
    const changelog = await changelogManager.readSingleChangelog('1.2.3.json');
    t.equal(typeof changelog, 'object');
    t.equal(changelog.version, '1.2.3');
  } catch (e) {
    t.error(e);
  }
});

tape('Changelog.readChangelogs reads and parses changelogs in a directory', async (t) => {
  t.plan(3);

  try {
    const changelogManager = new Changelog('0.0.0', 'test/fixtures/changelog/');
    const changelogs = await changelogManager.readChangelogs();
    t.ok(Array.isArray(changelogs));
    t.equal(changelogs.length, 3);
    t.equal(typeof changelogs[0], 'object');
  } catch (e) {
    t.error(e);
  }
});

tape('Changelog.readChangelogs returns changelogs ordered by version', async (t) => {
  t.plan(3);

  try {
    const changelogManager = new Changelog('0.0.0', 'test/fixtures/changelog/');
    const changelogs = await changelogManager.readChangelogs();
    t.equal(changelogs[0].version, '1.2.3');
    t.equal(changelogs[1].version, '1.2.11');
    t.equal(changelogs[2].version, '4.3.2');
  } catch (e) {
    t.error(e);
  }
});

tape('Changelog.readChangelogs uses the current version by default if no version is provided', async (t) => {
  t.plan(3);

  try {
    const changelogManager = new Changelog(null, 'test/fixtures/changelog/');
    const changelog = await changelogManager.getChangelog();

    t.equal(changelog.version, '4.3.2');
    t.ok(changelog.sections.Fixes);
    t.ok(changelog.sections['What\'s new']);
  } catch (e) {
    t.error(e);
  }
});

tape('Changelog.readChangelogs returns an aggregated changelog with the correct versions if a prior version is provided', async (t) => {
  t.plan(4);

  try {
    const changelogManager = new Changelog('1.2.3', 'test/fixtures/changelog/');
    const changelog = await changelogManager.getChangelog();

    t.equal(changelog.version, '4.3.2');
    t.ok(changelog.sections.Fixes.indexOf('Fix: 1.2.11 fixes') !== -1);
    t.ok(changelog.sections['What\'s new']);
    t.notOk(changelog.sections['1.2.3 Heading']);
  } catch (e) {
    t.error(e);
  }
});
