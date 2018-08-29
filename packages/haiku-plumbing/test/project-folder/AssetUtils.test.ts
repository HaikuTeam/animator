import {dumpBase64Images} from '@plumbing/project-folder/AssetUtils';
import Watcher from '@plumbing/Watcher';
import * as dedent from 'dedent';
import {existsSync, mkdirpSync, readFileSync, writeFileSync} from 'fs-extra';
import {getStub} from 'haiku-testing/lib/mock';
import {join} from 'path';
import * as tape from 'tape';
import TestHelpers from '../TestHelpers';

tape('AssetUtils', (suite) => {
  suite.test('dumpBase64Images', (test) => {
    const watcher = {blacklistKey: getStub(), unblacklistKey: getStub()};
    TestHelpers.tmpdir((folder, teardown) => {
      mkdirpSync(join(folder, 'designs'));
      const relpath = join('designs', 'foo.svg');
      const abspath = join(folder, relpath);
      const pngImageData = Buffer.from('<some PNG image stuff>').toString('base64');
      const gifImageData = Buffer.from('<some GIF image stuff>').toString('base64');

      // Note how we test both single and double quoted base64 entity strings of two different data types.
      writeFileSync(
        abspath,
        dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <svg>
            <!-- Generator: sketchtool 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
            <g id="Page-1">
              <image href="data:image/png;base64,${pngImageData}"></image>
              <image href='data:image/gif;base64,${gifImageData}'></image>
            </g>
          </svg>
        `,
      );
      dumpBase64Images(abspath, relpath, folder, watcher as Watcher);
      test.true(existsSync(`${abspath}.processed`), '.processed file was written');
      test.is(
        readFileSync(abspath).toString(),
        dedent`
          <?xml version="1.0" encoding="UTF-8"?>
          <svg>
            <!-- Generator: sketchtool 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
            <g id="Page-1">
              <image href="web+haikuroot://assets/designs/foo_image_1.png"></image>
              <image href='web+haikuroot://assets/designs/foo_image_2.gif'></image>
            </g>
          </svg>
        `,
        'original SVG content was rewritten',
      );
      test.is(
        readFileSync(join(folder, 'assets', 'designs', 'foo_image_1.png')).toString(),
        '<some PNG image stuff>',
        'image data was written correctly (1 of 2)',
      );
      test.is(
        readFileSync(join(folder, 'assets', 'designs', 'foo_image_2.gif')).toString(),
        '<some GIF image stuff>',
        'image data was written correctly (2 of 2)',
      );
      test.true(
        watcher.blacklistKey.calledWith(`FileReadWrite:${abspath}`),
        'watcher blacklist was called',
      );
      test.true(
        watcher.unblacklistKey.calledWith(`FileReadWrite:${abspath}`),
        'watcher unblacklist was called',
      );
      teardown();
      test.end();
    });
  });

  suite.end();
});
