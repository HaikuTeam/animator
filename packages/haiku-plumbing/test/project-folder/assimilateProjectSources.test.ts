import {assimilateProjectSources} from '@plumbing/project-folder/assimilateProjectSources';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as tape from 'tape';
import TestHelpers from '../TestHelpers';

const SOURCE_DIR = path.join(__dirname, '..', 'fixtures', 'projects', 'assimilate-source-1');
const ORIG_DEST_DIR = path.join(__dirname, '..', 'fixtures', 'projects', 'assimilate-dest-1');

tape('assimilateProjectSources', (test) => {
  TestHelpers.tmpdir((folder, teardown) => {
    const DEST_DIR = path.join(folder, 'assimilate-dest-1');
    fse.copySync(ORIG_DEST_DIR, DEST_DIR);
    assimilateProjectSources(
      DEST_DIR,
      SOURCE_DIR,
      'other-Project_2',
      (err) => {
        test.error(err, 'no error');

        // Pre-existing content check
        test.ok(fse.existsSync(path.join(DEST_DIR, 'code', 'main', 'code.js')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'code', 'child', 'code.js')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'designs', 'blank-project.sketch')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'designs', 'blank-project.sketch.contents')));
        const mainCode = fse.readFileSync(path.join(DEST_DIR, 'code', 'main', 'code.js')).toString();
        test.equal(mainCode.split(`require("./../child/code.js")`).length, 2);

        // Assimilated content check
        test.ok(fse.existsSync(path.join(DEST_DIR, 'assets', 'other-Project_2-mow.jpg')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'assets', 'other-Project_2-designs')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'code', 'other-Project_2-child', 'code.js')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'code', 'other-Project_2-grandchild', 'code.js')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'code', 'other-Project_2-main', 'code.js')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'designs', 'other-Project_2-blank-project.sketch')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'designs', 'other-Project_2-blank-project.sketch.contents')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'designs', 'other-Project_2-Foo-bar.Baz.sketch')));
        test.ok(fse.existsSync(path.join(DEST_DIR, 'designs', 'other-Project_2-Foo-bar.Baz.sketch.contents')));
        const otherMainCode = fse.readFileSync(
          path.join(DEST_DIR, 'code', 'other-Project_2-main', 'code.js'),
        ).toString();
        test.equal(otherMainCode.split(`require("./../other-Project_2-grandchild/code.js");`).length, 2);
        test.equal(otherMainCode.split(`require("./../other-Project_2-child/code.js");`).length, 2);
        test.equal(otherMainCode.split(`web+haikuroot://assets/other-Project_2-designs`).length, 2);
        test.equal(otherMainCode.split(`"web+haikuroot://assets/other-Project_2-mow.jpg"`).length, 2);
        test.equal(
          otherMainCode.split(
            `"designs/other-Project_2-blank-project.sketch.contents/slices/Getting your design.svg`,
          ).length,
          2,
        );

        teardown();
        test.end();
      },
    );
  });
});
