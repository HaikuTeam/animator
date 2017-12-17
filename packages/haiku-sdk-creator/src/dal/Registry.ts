import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { client as sdkClient } from '@haiku/sdk-client';

const REGISTRY_PATH = path.join(os.homedir(), '.haiku', 'registry.json');

// Purpose:  Set and retrieve locally persisted settings.
//           Intended to supersede (and deprecate) haiku-serialization/*/HaikuHomeDir and most of haiku-sdk-client
// Use-case: Easily store and retrieve whether the user chooses to view their timeline in ms or frames —
//           and specifically, remove friction around UI devs wanting to persist evolving data
export class Registry {

  // TODO: support config if e.g. REGISTRY_PATH ever needs to change
  // TODO: cache if this ever requires hot reads/writes
  // TODO: un-staticify if logic gets much more complex

  static _ensureHomeFolder() {
    mkdirp.sync(os.homedir() + '/.haiku');
  }

  static _getFileContents(): any {
    Registry._ensureHomeFolder();
    if (!fs.existsSync(REGISTRY_PATH)) {
      fs.writeFileSync(REGISTRY_PATH, '{}');
    }
    return JSON.parse(fs.readFileSync(REGISTRY_PATH).toString());
  }

  static _setFileContents(contents: any) {
    Registry._ensureHomeFolder();
    return fs.writeFileSync(REGISTRY_PATH, JSON.stringify(contents));
  }

  static setConfig(key: string, value: string) {
    const config = Registry._getFileContents();
    config[key] = value;
    Registry._setFileContents(config);
  }

  static getConfig(key: string): string {
    const config = Registry._getFileContents();
    return config[key];
  }
}
