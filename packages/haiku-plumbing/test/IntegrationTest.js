import * as assert from 'assert';
import * as path from 'path';
import {Application} from 'spectron';

const PLUMBING_ROOT = path.join(__dirname, '..');
const MONO_ROOT = path.join(PLUMBING_ROOT, '..', '..');
const ELECTRON_BINARY_PATH = path.join(MONO_ROOT, 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron')

export default class IntegrationTest {
  constructor() {
    // See https://github.com/electron/spectron#application-api
    this.spectron = new Application({
      path: ELECTRON_BINARY_PATH,
      args: [MONO_ROOT],
    });
  }
}
