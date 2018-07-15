const cp = require('child_process');
const lodash = require('lodash');
const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();
const argv = require('yargs').argv;

let groups = lodash.keyBy(allPackages, 'name');

let pkg = argv.package;
if (!pkg) {
  throw new Error('a --package argument is required');
}

let PACKAGE_PATH = groups[pkg] && groups[pkg].abspath;
if (!PACKAGE_PATH) {
  throw new Error(`cannot find package ${pkg}`);
}

log.hat(`publishing ${pkg} to the npm registry`);

// Have to set this because when we run via yarn, yarn sets this var and we want npm's registry.
process.env.npm_config_registry = 'https://registry.npmjs.org';

cp.execSync(`npm publish --verbose --access public`, {cwd: PACKAGE_PATH, stdio: 'inherit'});
