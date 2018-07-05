
// @ts-ignore
import * as fse from 'fs-extra';
import * as path from 'path';

const PLUMBING_DIR = path.join(__dirname, '../../');

import {
    getDefaultIllustratorAssetPath,
    getDefaultSketchAssetPath,
} from '@haiku/sdk-client/lib/ProjectDefinitions';

export const copyExternalExampleFilesToProject = (projectPath: string, projectName: string) => {
  const primaryAssetPath = getDefaultSketchAssetPath(projectPath, projectName);
  const defaultIllustratorAssetPath = getDefaultIllustratorAssetPath(projectPath, projectName);

  // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
  if (!fse.existsSync(path.join(projectPath, primaryAssetPath))) {
    fse.copySync(path.join(PLUMBING_DIR, 'bins', 'sketch-42.sketch'), path.join(projectPath, primaryAssetPath));
  }

  // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
  if (!fse.existsSync(path.join(projectPath, defaultIllustratorAssetPath))) {
    fse.copySync(path.join(PLUMBING_DIR, 'bins', 'illustrator-default.ai'),
      path.join(projectPath, defaultIllustratorAssetPath));
  }
};
