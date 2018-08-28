let cp = require('child_process');

module.exports = function gitStatusInfo (cwd) {
  const info = {};

  info.output = cp.execSync('git status', {cwd}).toString().trim();

  if (info.output.match(/untracked content/ig)) {
    info.submoduleHasUntrackedContent = true;
  }

  if (info.output.match(/modified content/ig)) {
    info.submoduleHasModifiedContent = true;
  }

  if (info.output.match(/unmerged paths/ig)) {
    info.submoduleHasUnmergedPaths = true;
  }

  if (info.output.match(/changes not staged/ig)) {
    info.hasUnstagedChanges = true;
  }

  if (info.output.match(/untracked files/ig)) {
    info.hasUntrackedFiles = true;
  }

  if (info.output.match(/fix conflicts/ig)) {
    info.hasMergeConflicts = true;
  }

  return info;
};
