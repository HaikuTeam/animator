
import * as fse from 'fs-extra';
import * as path from 'path';
import {getResourcesPath} from './getResourcesPath';

const getExternalFilesDirectory = () => {
  if (process.env.NODE_ENV === 'production') {
    return path.join(getResourcesPath(), 'template-design-files');
  }

  return path.join(__dirname, '../../');
};

export const copyAssetFile = (projectPath: string, assetPath: string, bin: string) => {
  try {
    const assetDir = path.join(projectPath, assetPath);

    if (!fse.existsSync(assetDir)) {
      fse.copySync(bin, assetDir);
    }
  } catch (error) {
    return error;
  }
};

export const copyDefaultSketchFile = (projectPath: string, assetPath: string) => {
  return copyAssetFile(projectPath, assetPath, path.join(getExternalFilesDirectory(), 'sketch-42.sketch'));
};

export const copyDefaultIllustratorFile = (projectPath: string, assetPath: string) => {
  return copyAssetFile(projectPath, assetPath, path.join(getExternalFilesDirectory(), 'illustrator-default.ai'));
};
