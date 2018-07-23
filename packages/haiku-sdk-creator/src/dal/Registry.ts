import {ensureHomeFolderForOrganization} from '@haiku/sdk-client';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const getRegistryPath = (organizationName: string) =>
  path.join(os.homedir(), '.haiku', organizationName, 'registry.json');

const getFileContents = (organizationName: string): any => {
  ensureHomeFolderForOrganization(organizationName);
  const registryPath = getRegistryPath(organizationName);
  if (!fs.existsSync(registryPath)) {
    fs.writeFileSync(registryPath, '{}');
  }

  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
};

const setFileContents = (organizationName: string, contents: {[key in string]: any}) => {
  return fs.writeFileSync(getRegistryPath(organizationName), JSON.stringify(contents));
};

// Purpose:  Set and retrieve locally persisted settings.
//           Intended to supersede (and deprecate) haiku-serialization/*/HaikuHomeDir and most of haiku-sdk-client
// Use-case: Easily store and retrieve whether the user chooses to view their timeline in ms or frames —
//           and specifically, remove friction around UI devs wanting to persist evolving data
export class Registry {
  constructor (private readonly organizationName: string) {}

  // TODO: support config if e.g. REGISTRY_PATH ever needs to change
  // TODO: cache if this ever requires hot reads/writes
  setConfig (key: string, value: string) {
    const config = getFileContents(this.organizationName);
    config[key] = value;
    setFileContents(this.organizationName, config);
  }

  getConfig (key: string): string {
    const config = getFileContents(this.organizationName);
    return config[key];
  }
}
