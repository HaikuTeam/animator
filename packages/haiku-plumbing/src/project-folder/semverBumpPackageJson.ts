// @ts-ignore
import * as fse from 'fs-extra';
import * as path from 'path';
import * as semver from 'semver';

const logger = console;

export function semverBumpPackageJson (projectPath: string, maybeVersionToBumpTo: string, cb: any) {
  try {
    const jsonPath = path.join(projectPath, 'package.json');

    logger.info(`[project folder] semver bump: checking ${jsonPath}`);

    const pkg = fse.readJsonSync(jsonPath);

    let newVersion;

    // Allow a version to be specified explicitly. This turns out to be useful in plumbing/master
    // where we might find a previously-used tag and need to explicitly bump from it, instead of using
    // what might be defined in the package.json.
    if (maybeVersionToBumpTo) {
      logger.info(`[project folder] semver bump: got explicit version ${maybeVersionToBumpTo}`);
      newVersion = maybeVersionToBumpTo;
    } else {
      const prevVersion = pkg.version;
      logger.info(`[project folder] semver bump: found previous version ${prevVersion}`);
      newVersion = semver.inc(prevVersion, 'patch');
    }

    logger.info(`[project folder] semver bump: assigning version ${newVersion}`);

    pkg.version = newVersion;
    const newJson = JSON.stringify(pkg, null, 2) + '\n';
    fse.writeFileSync(jsonPath, newJson);

    return cb(null, newVersion);
  } catch (exception) {
    return cb(exception);
  }
}
