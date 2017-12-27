const fs = require('fs');
const glob = require('glob');
const path = require('path');

const depTypes = require('./depTypes');

const PACKAGE_ROOT = path.join(global.process.cwd(), 'packages/');
const allPackages = {};

['haiku-*', '@haiku/*'].forEach((pattern) => {
  const packages = glob.sync(path.join(PACKAGE_ROOT, pattern));
  packages.forEach((packageDir) => {
    const pkgJsonPath = path.join(packageDir, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
    const shortname = pkgJson.name.replace('haiku-', '').replace('@haiku/', '');
    const pkg = {
      shortname,
      name: pkgJson.name,
      abspath: packageDir,
      pkg: pkgJson,
      version: pkgJson.version,
      remote: `git@github.com:HaikuTeam/${shortname}.git`,
      deps: new Set(),
    };
    depTypes.forEach((depType) => {
      if (pkgJson[depType]) {
        for (const dep in pkgJson[depType]) {
          if (!dep.startsWith('haiku-') && !dep.startsWith('@haiku/')) {
            continue;
          }
          pkg.deps.add(dep);
        }
      }
    });
    allPackages[pkgJson.name] = pkg;
  });
});

module.exports = function packages(names) {
  const packages = Object.values(allPackages).sort(
    (pkg1, pkg2) => pkg1.deps.has(pkg2.name) ? 1 : (pkg2.deps.has(pkg1.name) ? -1 : 0),
  );
  if (names) {
    if (!Array.isArray(names)) {
      return packages.find((val) => val.name === names);
    }

    return packages.filter((val) => names.includes(val));
  }
  return packages;
};
