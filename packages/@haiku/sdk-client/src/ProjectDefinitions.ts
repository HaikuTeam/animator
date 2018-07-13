import * as dedent from 'dedent';
import * as fse from 'fs-extra';
import {assign} from 'lodash';
// @ts-ignore
import * as pascalcase from 'pascalcase';
import * as path from 'path';

export const WHITESPACE_REGEX = /\s+/;
export const UNDERSCORE = '_';
export const FALLBACK_SEMVER_VERSION = '0.0.0';
export const FALLBACK_ORG_NAME = 'Unknown';
export const FALLBACK_AUTHOR_NAME = 'Haiku User';
export const DEFAULT_BRANCH_NAME = 'master';

export const getHaikuCoreVersion = () => {
  const CORE_PACKAGE_JSON = fse.readJsonSync(
    require.resolve(path.join('@haiku/core', 'package.json')),
    {throws: false},
  );

  if (CORE_PACKAGE_JSON) {
    return CORE_PACKAGE_JSON.version;
  }

  return FALLBACK_SEMVER_VERSION;
};

export const getHaikuComponentInitialVersion = () => {
  return FALLBACK_SEMVER_VERSION;
};

export const getSafeProjectName = (maybePath: string, maybeName: string) => {
  if (maybeName) {
    return maybeName.replace(WHITESPACE_REGEX, UNDERSCORE);
  }
  if (maybePath) {
    return pascalcase(maybePath.split(path.sep).join(UNDERSCORE));
  }
  throw new Error('Unable to infer a project name!');
};

export const getProjectNameSafeShort = (maybePath: string, maybeName: string) => {
  return getSafeProjectName(maybePath, maybeName).slice(0, 20);
};

export const getProjectNameLowerCase = (maybePath: string, maybeName: string) => {
  return getSafeProjectName(maybePath, maybeName).toLowerCase();
};

export const getReactProjectName = (maybePath: string, maybeName: string) => {
  return `React_${getSafeProjectName(maybePath, maybeName)}`;
};

export const getAngularSelectorName = (maybePath: string, maybeName: string) => {
  return getSafeProjectName(maybePath, maybeName)
    .replace(/([A-Z])/g, (char: string) => `-${char.toLowerCase()}`)
    .replace(/^-/, '');
};

export const getStandaloneName = (organizationName: string, projectPath: string, projectName: string) => {
  return `HaikuComponent_${organizationName}_${getProjectNameSafeShort(projectPath, projectName)}`;
};

export const getCopyrightNotice = (organizationName: string) => {
  return dedent`
  ${`Copyright (c) ${(new Date()).getFullYear()} ${organizationName}. All rights reserved.`}
  `;
};

export const getOrganizationNameOrFallback = (organizationName: string) => {
  return organizationName || FALLBACK_ORG_NAME;
};

export const getAuthorNameOrFallback = (authorName: string) => {
  return authorName || FALLBACK_AUTHOR_NAME;
};

export const readPackageJson = (folder: string) => {
  let pkgjson: {haiku?: any, version?: any} = {};
  try {
    pkgjson = fse.readJsonSync(path.join(folder, 'package.json'), {throws: true});
  } catch (e) {
    pkgjson = {};
  }
  if (!pkgjson.haiku) {
    pkgjson.haiku = {};
  }
  if (!pkgjson.version) {
    pkgjson.version = FALLBACK_SEMVER_VERSION;
  }
  return pkgjson;
};

export const fetchProjectConfigInfo = (folder: string, cb: any) => {
  const pkgjson = readPackageJson(folder);
  const config = (pkgjson && pkgjson.haiku) || {};
  return cb(null, assign({
    folder,
    uuid: 'HAIKU_SHARE_UUID', // Replaced on the server
    core: getHaikuCoreVersion(),
  }, config));
};

export const storeConfigValues = (folder: string, incoming: any) => {
  fse.mkdirpSync(folder);
  const pkgjson = readPackageJson(folder);
  assign(pkgjson.haiku, incoming);
  fse.outputJsonSync(path.join(folder, 'package.json'), pkgjson, {spaces: 2});
  return pkgjson.haiku;
};

export const getDefaultIllustratorAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.ai`;
};

export const getDefaultSketchAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.sketch`;
};
