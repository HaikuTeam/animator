import * as os from 'os';
import * as path from 'path';
import {Application} from 'spectron';

const PLUMBING_ROOT = path.resolve(path.join(__dirname, '..'));
const MONO_ROOT = path.resolve(path.join(PLUMBING_ROOT, '..', '..'));
const BLANK_PROJECT_ROOT = path.join(PLUMBING_ROOT, 'test/fixtures/projects/blank-project');
const ELECTRON_BINARY_PATH = path.join(MONO_ROOT, 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron');

export const INTEGRATION_TESTS_ENABLED = os.platform() === 'darwin';

export default class IntegrationTest {
  private application: Application;

  async start (browser = false): Promise<Application> {
    if (this.application) {
      throw new Error('Already started');
    }

    // See https://github.com/electron/spectron#application-api
    this.application = new Application({
      cwd: MONO_ROOT,
      path: ELECTRON_BINARY_PATH,
      args: ['.', '--enable-logging'],
      env: {
        NODE_ENV: 'development',
        HAIKU_SKIP_AUTOUPDATE: 1,
        HAIKU_PLUMBING_PORT: 1024,
        HAIKU_RELEASE_ENVIRONMENT: 'test',
        HAIKU_RELEASE_BRANCH: 'master',
        HAIKU_RELEASE_PLATFORM: 'mac',
        HAIKU_RELEASE_ARCHITECTURE: 'x64',
        HAIKU_RELEASE_VERSION: '0.0.0',
        HAIKU_AUTOUPDATE_SERVER: 'http://localhost:3002',
        HAIKU_PLUMBING_URL: 'http://0.0.0.0:1024',
        HAIKU_PROJECT_FOLDER: browser ? '' : BLANK_PROJECT_ROOT,
      },
    });

    return this.application.start();
  }

  async teardown (): Promise<Application> {
    if (!this.application) {
      throw new Error('Not started');
    }

    return this.application.stop();
  }
}
