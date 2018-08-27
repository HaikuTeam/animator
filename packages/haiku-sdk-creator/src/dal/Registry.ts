import {ensureFolder} from '@haiku/sdk-client';
import * as fs from 'fs';
import * as path from 'path';

interface Config {
  [key: string]: any;
}

const getRegistryPath = (container: string) => path.join(container, 'registry.json');

const getRegistry = (container: string): any => {
  ensureFolder(container);
  const registryPath = getRegistryPath(container);
  if (!fs.existsSync(registryPath)) {
    fs.writeFileSync(registryPath, '{}');
  }

  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
};

const setRegistry = (container: string, contents: Config) => {
  return fs.writeFileSync(getRegistryPath(container), JSON.stringify(contents));
};

// Purpose:  Set and retrieve locally persisted settings.
//           Intended to supersede (and deprecate) haiku-serialization/*/HaikuHomeDir and most of haiku-sdk-client
// Use-case: Easily store and retrieve whether the user chooses to view their timeline in ms or frames —
//           and specifically, remove friction around UI devs wanting to persist evolving data
export class Registry {
  private config: Config;
  constructor (private readonly container: string) {
    // Instead of constantly reading from disk, keep a local pointer to the registry container.
    // Intentional side effects:
    //   - registry is only loaded from disk when the app boots up
    //   - registry can be opaquely held in memory while the app is running
    // These features make it harder, though of course not impossible, to test what happens when tampering with the
    // registry.
    try {
      this.config = getRegistry(this.container);
    } catch (error) {
      // Invalid/tampered with config.
      this.config = {};
    }
  }

  private flushConfig () {
    setRegistry(this.container, this.config);
  }

  getConfig<T> (key: string): T {
    return this.config[key];
  }

  setConfig<T> (key: string, value: T) {
    this.config[key] = value;
    // TODO: should we debounce or delay writing to disk?
    this.flushConfig();
  }

  deleteConfig (key: string) {
    delete this.config[key];
    // TODO: should we debounce or delay writing to disk?
    this.flushConfig();
  }
}
