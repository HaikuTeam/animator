const test = require('tape');
const sketchUtils = require('../../src/utils/sketchUtils');

const validDump = `
  path:          /Applications/__MACOSX/Sketch.app
  path:          /Applications/Sketch.app
`;

test('sketchUtils.dumpToPaths', (t) => {
  t.plan(5);

  const resultWithValidDump = sketchUtils.dumpToPaths(validDump);
  t.ok(Array.isArray(resultWithValidDump), 'returns an array of paths');
  t.equal(resultWithValidDump.length, 2, 'returns the correct number of paths');
  t.equal(resultWithValidDump[0], '/Applications/__MACOSX/Sketch.app', 'returns the correct content');

  const resultWithInvalidDump = sketchUtils.dumpToPaths('asdfwer');
  t.ok(Array.isArray(resultWithInvalidDump), 'returns an array of paths even with invalid data');
  t.equal(resultWithInvalidDump.length, 0);

  t.end();
});

test('sketchUtils.pathsToInstallationInfo', async (t) => {
  t.plan(1);

  const paths = ['/Some/Weird/Path/Sketch.app'];
  const installInfo = await sketchUtils.pathsToInstallationInfo(paths);
  t.equal(installInfo[0], null);

  t.end();
});

test('sketchUtils.findBestPath', (t) => {
  t.plan();

  const installInfo = [
    null,
    {sketchPath: '/Applications/Sketch2.app', sketchtoolBuildNumber: 51147},
    null,
    {sketchPath: '/Applications/Sketch.app', sketchtoolBuildNumber: 51167},
    null,
  ];
  const bestPath = sketchUtils.findBestPath(installInfo);

  t.equal(bestPath, '/Applications/Sketch.app', 'finds the best path based on the build number');

  t.end();
});
