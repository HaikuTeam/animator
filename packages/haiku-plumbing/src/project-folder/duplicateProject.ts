// @ts-ignore
import * as fse from 'fs-extra';
import {escapeRegExp} from 'lodash';
import * as path from 'path';

const logger = console;

export function duplicateProject (destinationProject: any, sourceProject: any, cb: any) {
  try {
    // Create a haiku config file.
    fse.mkdirpSync(destinationProject.projectPath);

    // Use the project name as the folder basename
    const sourceBaseName = sourceProject.projectName;
    const sourcePathPattern = new RegExp(escapeRegExp(sourceBaseName), 'g');
    const destinationBasename = destinationProject.projectName;
    logger.info(`using ${sourceBaseName}, ${destinationBasename}, ${sourcePathPattern}`);

    // Replace paths in each scene bytecode
    const scenes = fse.readdirSync(path.join(sourceProject.projectPath, 'code'));
    scenes.forEach((sceneName: string) => {
      const destinationScenePath = path.join(destinationProject.projectPath, 'code', sceneName);
      fse.mkdirpSync(destinationScenePath);

      const bytecode = fse.readFileSync(path.join(sourceProject.projectPath, 'code', sceneName, 'code.js'))
        .toString()
        .replace(sourcePathPattern, destinationBasename);
      fse.outputFileSync(path.join(destinationScenePath, 'code.js'), bytecode);
    });

    // Move design assets, if the asset starts with `sourceProject.projectName`, rename
    // it to `destinationProject.projectName`
    const designAssets = fse.readdirSync(path.join(sourceProject.projectPath, 'designs'));
    designAssets.forEach((designAssetName: string) => {
      const destinationDesignAsset = designAssetName.startsWith(sourceBaseName)
        ? designAssetName.replace(sourceBaseName, destinationBasename)
        : designAssetName;
      fse.copySync(
        path.join(sourceProject.projectPath, 'designs', designAssetName),
        path.join(destinationProject.projectPath, 'designs', destinationDesignAsset),
      );
    });

    cb();
  } catch (err) {
    return cb(err);
  }
}
