import * as dedent from 'dedent';
// @ts-ignore
import * as fse from 'fs-extra';
import {assign} from 'lodash';
import * as moment from 'moment';
// @ts-ignore
import * as pascalcase from 'pascalcase';
import * as path from 'path';

const WHITESPACE_REGEX = /\s+/;
const UNDERSCORE = '_';
const FALLBACK_SEMVER_VERSION = '0.0.0';
const FALLBACK_ORG_NAME = 'Unknown';
const FALLBACK_AUTHOR_NAME = 'Haiku User';
const DEFAULT_BRANCH_NAME = 'master';

const getHaikuCoreVersion = () => {
  const CORE_PACKAGE_JSON = fse.readJsonSync(
    require.resolve(path.join('@haiku/core', 'package.json')),
    {throws: false},
  );

  if (CORE_PACKAGE_JSON) {
    return CORE_PACKAGE_JSON.version;
  }

  return FALLBACK_SEMVER_VERSION;
};

const getSafeProjectName = (maybePath: string, maybeName: string) => {
  if (maybeName) {
    return maybeName.replace(WHITESPACE_REGEX, UNDERSCORE);
  }
  if (maybePath) {
    return pascalcase(maybePath.split(path.sep).join(UNDERSCORE));
  }
  throw new Error('Unable to infer a project name!');
};

const getProjectNameSafeShort = (maybePath: string, maybeName: string) => {
  return getSafeProjectName(maybePath, maybeName).slice(0, 20);
};

const getProjectNameLowerCase = (maybePath: string, maybeName: string) => {
  return getSafeProjectName(maybePath, maybeName).toLowerCase();
};

const getReactProjectName = (maybePath: string, maybeName: string) => {
  return `React_${getSafeProjectName(maybePath, maybeName)}`;
};

const getPrimaryAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.sketch`;
};

const getAngularSelectorName = (maybePath: string, maybeName: string) => {
  return getSafeProjectName(maybePath, maybeName)
    .replace(/([A-Z])/g, (char: string) => `-${char.toLowerCase()}`)
    .replace(/^-/, '');
};

const getDefaultIllustratorAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.ai`;
};

const getEmbedName = (organizationName: string, projectPath: string, projectName: string) => {
  return `HaikuComponentEmbed_${organizationName}_${getProjectNameSafeShort(projectPath, projectName)}`;
};

const getStandaloneName = (organizationName: string, projectPath: string, projectName: string) => {
  return `HaikuComponent_${organizationName}_${getProjectNameSafeShort(projectPath, projectName)}`;
};

const getCopyrightNotice = (organizationName: string) => {
  return dedent`
  ${`Copyright (c) ${(new Date()).getFullYear()} ${organizationName}. All rights reserved.`}
  `;
};

const getOrganizationNameOrFallback = (organizationName: string) => {
  return organizationName || FALLBACK_ORG_NAME;
};

const getAuthorNameOrFallback = (authorName: string) => {
  return authorName || FALLBACK_AUTHOR_NAME;
};

const getCurrentHumanTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};

const readPackageJson = (folder: string) => {
  console.log('Reading package from folder', folder);
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

const fetchProjectConfigInfo = (folder: string, cb: any) => {
  const pkgjson = readPackageJson(folder);
  const config = (pkgjson && pkgjson.haiku) || {};
  return cb(null, assign({
    folder,
    uuid: 'HAIKU_SHARE_UUID', // Replaced on the server
    core: getHaikuCoreVersion(),
    player: getHaikuCoreVersion(), // legacy alias for 'core'
      // config: name, project, username, organization, branch, version, commit
  }, config));
};

const getSafeOrganizationName = (maybeOrgName: string) => {
  let orgName = maybeOrgName;
  if (!maybeOrgName || typeof maybeOrgName !== 'string') {
    orgName = FALLBACK_ORG_NAME;
  }
  return orgName.replace(WHITESPACE_REGEX, UNDERSCORE);
};

const storeConfigValues = (folder: string, incoming: any) => {
  fse.mkdirpSync(folder);
  const pkgjson = readPackageJson(folder);
  assign(pkgjson.haiku, incoming);
  fse.outputJsonSync(path.join(folder, 'package.json'), pkgjson, {spaces: 2});
  return pkgjson.haiku;
};

const getDefaultBranchName = () => {
  return DEFAULT_BRANCH_NAME;
};

export {
    getSafeProjectName,
    getProjectNameSafeShort,
    getProjectNameLowerCase,
    getReactProjectName,
    getPrimaryAssetPath,
    getAngularSelectorName,
    getDefaultIllustratorAssetPath,
    getCurrentHumanTimestamp,
    getHaikuCoreVersion,
    fetchProjectConfigInfo,
    getSafeOrganizationName,
    storeConfigValues,
    readPackageJson,
    getDefaultBranchName,
    getEmbedName,
    getStandaloneName,
    getCopyrightNotice,
    getOrganizationNameOrFallback,
    getAuthorNameOrFallback,
};
