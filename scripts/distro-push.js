const cp = require('child_process');

const openSourcePackages = require('./helpers/openSourcePackages');
const openSourceProjects = require('./helpers/openSourceProjects');
const nowVersion = require('./helpers/nowVersion');

const branch = global.process.env.ghprbSourceBranch;
if (!branch || !branch.startsWith('rc-')) {
  throw new Error('Cannot proceed without rc- branch');
}

const ROOT = global.process.cwd();
const processOptions = {cwd: ROOT, stdio: 'inherit'};

// Stash semver changes.
cp.execSync('git stash', processOptions);
cp.execSync('git fetch', processOptions);

try {
  // Make sure we reset our local branch, but allow this step to fail if we don't have one.
  cp.execSync(`git branch -D ${branch}`, processOptions);
} catch (err) {
  // ...
}

cp.execSync(`git checkout ${branch}`, processOptions);
// Pull standalone remotes.
cp.execSync(`node ./scripts/git-subtree-pull.js --package=all`, processOptions);
// Regenerate changelog and push to remote.
cp.execSync('node ./scripts/changelog.js', processOptions);
cp.execSync('git stash pop', processOptions);
cp.execSync('git add -u', processOptions);
cp.execSync('git commit --allow-empty -m "auto: release"', processOptions);

// Compile packages.
cp.execSync('yarn install --frozen-lockfile', processOptions);
cp.execSync('yarn compile-all --force', processOptions);
openSourcePackages.forEach((pack) => {
  const compileCommand = `node ./scripts/compile-package.js --package=${pack.name}`;
  if (!openSourceProjects.has(pack.name) || pack.name.startsWith('haiku-')) {
    // Uglify pure dependencies.
    cp.execSync(`${compileCommand} --uglify=lib/**/*.js`, processOptions);
  }
});

// @haiku/core needs a special build.
cp.execSync('node ./scripts/build-core.js --skip-compile=1', processOptions);

// Push up before we begin the actual work of publishing. This ensures that unmergeable changes are never published to
// our standalones. If this fails due to a merge to master occurring while the pipeline is running, we'll have to start over.
cp.execSync(`git tag -a ${nowVersion()} -m 'release ${nowVersion()}'`, processOptions);
cp.execSync(`git push -u origin ${branch} --tags`, processOptions);

openSourcePackages.forEach((pack) => {
  // Publish package to NPM as is.
  cp.execSync(`node ./scripts/publish-package.js --package=${pack.name}`, processOptions);
});

// Publish @haiku/core to CDN.
cp.execSync('node ./scripts/upload-cdn-core.js', processOptions);

// Push standalone remotes.
openSourcePackages.forEach((pack) => {
  cp.execSync('node ./scripts/git-subtree-push.js --package=${pack.name}', processOptions);
});
cp.execSync('node ./scripts/git-subtree-push.js --package=changelog', processOptions);
// Pull standalone remotes once more, so that we don't hit conflicts the next time we have to pull.
cp.execSync('node ./scripts/git-subtree-pull.js --package=all', processOptions);
cp.execSync(`git push origin ${branch}`);
