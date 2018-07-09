
// @ts-ignore
import * as fse from 'fs-extra';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import * as path from 'path';

const PLUMBING_DIR = path.join(__dirname, '../../');

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
  return copyAssetFile(projectPath, assetPath, path.join(PLUMBING_DIR, 'bins', 'sketch-42.sketch'));
};

export const copyDefaultIllustratorFile = (projectPath: string, assetPath: string) => {
  return copyAssetFile(projectPath, assetPath, path.join(PLUMBING_DIR, 'bins', 'illustrator-default.ai'));
};

import {
    getDefaultIllustratorAssetPath,
    getDefaultSketchAssetPath,
} from './ProjectDefinitions';

export const copyExternalExampleFilesToProject = (projectPath: string, projectName: string) => {
  const primaryAssetPath = getDefaultSketchAssetPath(projectPath, projectName);
  const defaultIllustratorAssetPath = getDefaultIllustratorAssetPath(projectPath, projectName);

  if (!experimentIsEnabled(Experiment.CleanInitialLibraryState)) {
    // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
    copyDefaultSketchFile(projectPath, primaryAssetPath);

    // If it isn't already a part of the project, add the 'blank' illustrator file to users' projects
    copyDefaultIllustratorFile(projectPath, defaultIllustratorAssetPath);
  }
};
