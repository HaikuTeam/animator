import * as fse from 'fs-extra';
import * as path from 'path';

export function assimilateProjectSources (
  destProjectAbspath: string,
  sourceProjectAbspath: string,
  assimilateePrefix: string, // For converting `code/main/code.js` -> `code/{prefix}-main/code.js`
  cb: any,
) {
  const prefixifyName = (name: string): string => {
    return `${assimilateePrefix}-${name}`;
  };

  const DESIGNS_SOURCE_FOLDER_PATH = path.join(sourceProjectAbspath, 'designs');
  const ASSETS_SOURCE_FOLDER_PATH = path.join(sourceProjectAbspath, 'assets');
  const CODE_SOURCE_FOLDER_PATH = path.join(sourceProjectAbspath, 'code');

  const DESIGNS_DEST_FOLDER_PATH = path.join(destProjectAbspath, 'designs');
  const ASSETS_DEST_FOLDER_PATH = path.join(destProjectAbspath, 'assets');
  const CODE_DEST_FOLDER_PATH = path.join(destProjectAbspath, 'code');

  try {
    const replacementsToMake: {[previousString: string]: string} = {};

    // We copy designs so the user can modify them and see changes reflect in the new project.
    if (fse.existsSync(DESIGNS_SOURCE_FOLDER_PATH)) {
      const designSources = fse.readdirSync(DESIGNS_SOURCE_FOLDER_PATH);
      designSources.forEach((designName: string) => {
        const destDesignName = prefixifyName(designName);
        replacementsToMake[path.join('designs', designName)] = path.join('designs', destDesignName);
        fse.copySync(
          path.join(DESIGNS_SOURCE_FOLDER_PATH, designName),
          path.join(DESIGNS_DEST_FOLDER_PATH, destDesignName),
        );
      });
    }

    // We have to copy assets in case the bytecode references them (e.g. <Image> or font).
    if (fse.existsSync(ASSETS_SOURCE_FOLDER_PATH)) {
      const assetSources = fse.readdirSync(ASSETS_SOURCE_FOLDER_PATH);
      assetSources.forEach((assetName: string) => {
        const destAssetName = prefixifyName(assetName);
        replacementsToMake[path.join('assets', assetName)] = path.join('assets', destAssetName);
        fse.copySync(
          path.join(ASSETS_SOURCE_FOLDER_PATH, assetName),
          path.join(ASSETS_DEST_FOLDER_PATH, destAssetName),
        );
      });
    }

    if (fse.existsSync(CODE_SOURCE_FOLDER_PATH)) {
      const componentSources = fse.readdirSync(CODE_SOURCE_FOLDER_PATH);
      componentSources.forEach((componentName: string) => {
        const destComponentName = prefixifyName(componentName);
        replacementsToMake[path.join(path.sep + componentName, 'code.js')] =
          path.join(path.sep + destComponentName, 'code.js');
      });
      componentSources.forEach((componentName: string) => {
        const bytecodeFilePath = path.join(CODE_SOURCE_FOLDER_PATH, componentName, 'code.js');
        if (!fse.existsSync(bytecodeFilePath)) {
          return;
        }

        const destComponentName = prefixifyName(componentName);
        const destinationScenePath = path.join(CODE_DEST_FOLDER_PATH, destComponentName);
        fse.mkdirpSync(destinationScenePath);

        let bytecodeStringFixed = fse.readFileSync(bytecodeFilePath).toString();
        for (const previousString in replacementsToMake) {
          const updatedString = replacementsToMake[previousString];
          bytecodeStringFixed = bytecodeStringFixed.split(previousString).join(updatedString);
        }

        fse.outputFileSync(path.join(destinationScenePath, 'code.js'), bytecodeStringFixed);
      });
    }

    cb();
  } catch (exception) {
    cb(exception);
  }
}
