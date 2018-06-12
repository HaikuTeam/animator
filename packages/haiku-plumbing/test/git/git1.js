/* tslint:disable */
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import {commitProject, init} from '@plumbing/Git';
const FOLDER = process.env.GIT_PKILL_DIR;

function bigBuffer () {
  let largeBuffer;
  const large = new Buffer('');
  const other = new Buffer('a');
  for (let i = 0; i <= (500 * 1000); i++) {
    largeBuffer = Buffer.concat([large, other]);
  }
  return large;
}

function handleError (err) {
  console.error(err);
  throw err;
}

init(FOLDER, (err) => {
  if (err) {
    return handleError(err);
  }
  fse.outputFileSync(path.join(FOLDER, 'README.md'), '# README');
  commitProject(FOLDER, null, false, {}, '.', (err, cid1) => {
    if (err) {
      return handleError(err);
    }
    fse.outputFileSync(path.join(FOLDER, 'big'), bigBuffer());
    console.warn(5, Date.now());
    commitProject(FOLDER, null, true, {}, ['big'], (err, cid2) => {
      if (err) {
        return handleError(err);
      }
      console.warn(6, Date.now());
    });
  });
});
