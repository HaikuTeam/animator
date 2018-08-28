const getPackages = require('./packages');
const openSourceProjects = require('./openSourceProjects');

// Pull in the set of dependencies recursively.
const openSourcePackages = getPackages(Array.from(openSourceProjects));
const processedDependencies = new Set();
let foundNewDeps;
do {
  foundNewDeps = false;
  openSourcePackages.forEach((pack) => {
    if (processedDependencies.has(pack.name)) {
      return;
    }

    if (pack.deps.size > 0) {
      getPackages(Array.from(pack.deps)).forEach((openSourcePackage) => {
        // Only push a new package onto the stack if it hasn't already been counted. It's possible for multiple packages
        // to depend on the same package which is not explicitly open sourced.
        if (
          openSourcePackages.find((exisitingPackage) => exisitingPackage.name === openSourcePackage.name) === undefined
        ) {
          openSourcePackages.push(openSourcePackage);
          foundNewDeps = true;
        }
      });
    }

    processedDependencies.add(pack.name);
  });
} while (foundNewDeps);

module.exports = openSourcePackages;
