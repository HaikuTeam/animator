import * as tape from 'tape';
import * as async from 'async';
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import TestHelpers from '../TestHelpers';

tape('ProjectFolder.fixProjectName', (t) => {
  t.plan(3);
  TestHelpers.setup(function (folder, creator, glass, timeline, metadata, teardown) {
    fse.writeFileSync(path.join(folder, 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>');
    return async.series([
      function (cb) {
        return creator.request('bootstrapProject', ['test', {projectPath: folder}, 'matthew+test@haiku.ai', 'quitesecure'], cb);
      },

      function (cb) {
        const pkg = fse.readJsonSync(path.join(folder, 'package.json'));
        // Make sure the setting is correct at the outset
        t.equal(pkg.name, `@haiku/${metadata.organizationName.toLowerCase()}-test`, 'package name was set correctly');
        // Set to an incorrect name to check that we fix it correctly later
        pkg.name = '@haiku/unknown-test';
        fse.writeJsonSync(path.join(folder, 'package.json'), pkg, {spaces: 2});
        return cb();
      },

      // Re-run the same initialization step, which should fix the name
      function (cb) {
        return creator.request('bootstrapProject', ['test', {projectPath: folder}, 'matthew+test@haiku.ai', 'quitesecure'], cb);
      },

      function (cb) {
        const pkg = fse.readJsonSync(path.join(folder, 'package.json'));
        t.equal(pkg.name, `@haiku/${metadata.organizationName.toLowerCase()}-test`, 'package name was set correctly');
        return cb();
      },
    ], (err) => {
      t.error(err, 'no error');
      teardown();
    });
  });
});
