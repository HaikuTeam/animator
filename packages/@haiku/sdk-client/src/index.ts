// tslint:disable:no-namespace class-name
import {inkstone} from '@haiku/sdk-inkstone';
import {execSync} from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as path from 'path';

const HAIKU_HOME = path.join(os.homedir(), '.haiku');

export const FILE_PATHS = {
  HAIKU_HOME,
  AUTH_TOKEN: path.join(HAIKU_HOME, 'auth'),
  DOTENV: path.join(HAIKU_HOME, '.env'),
};

export const ensureFolder = (folder: string) => {
  mkdirp.sync(folder);
};

export const ensureHomeFolder = () => {
  ensureFolder(HAIKU_HOME);
};

export type HaikuDotEnv = {
  [key in string]: string;
};

export namespace client {

  export const verboselyLog =  (message: string, ...args: any[]) => {
    if (clientConfig.verbose) {
      console.log(message, ...args);
    }
  };

  export const error = (err: any) => {
    // TODO: elegantly handle errors
  };

  export class npm {
    static readPackageJson (pathIn: string = global.process.cwd() + '/package.json'): any {
      return JSON.parse(fs.readFileSync(pathIn, 'utf8'));
    }

    static writePackageJson (jsonObject: any, pathIn: string = global.process.cwd() + '/package.json') {
      fs.writeFileSync(pathIn, JSON.stringify(jsonObject, undefined, 2));
    }
  }

  export class git {
    static cloneRepo (remote: string, pathIn: string, cb: (error?: any) => any) {
      let err;
      try {
        execSync(`git clone ${remote} ${pathIn}`);
      } catch (e) {
        err = e;
        client.verboselyLog('error cloning repository', e);
      }
      cb(err);
    }

  }

  export interface ClientConfig {
    verbose?: boolean;
  }

  const clientConfig: ClientConfig = {
    verbose: false,
  };

  export function setConfig (newVals: ClientConfig) {
    _.extend(clientConfig, newVals);
  }

  export class config {

    static getenv (): HaikuDotEnv {
      if (!fs.existsSync(FILE_PATHS.DOTENV)) {
        return {};
      }

      const env = dotenv.parse(fs.readFileSync(FILE_PATHS.DOTENV));
      Object.assign(global.process.env, env);
      if (env.HAIKU_API) {
        inkstone.setConfig({baseUrl: env.HAIKU_API});
      }

      return env;
    }

    static setenv (environmentVariables: HaikuDotEnv): HaikuDotEnv {
      Object.assign(global.process.env, environmentVariables);
      if (environmentVariables.HAIKU_API) {
        inkstone.setConfig({baseUrl: environmentVariables.HAIKU_API});
      }

      const newenv = Object.assign(client.config.getenv(), environmentVariables);
      fs.writeFileSync(
        FILE_PATHS.DOTENV,
        Object.entries(Object.assign(client.config.getenv(), environmentVariables))
          .reduce(
            (accumulator, [key, value]) => accumulator + `${key}="${value}"\n`,
            '',
          ),
      );

      return newenv;
    }

    static getAuthToken (): string {
      if (fs.existsSync(FILE_PATHS.AUTH_TOKEN)) {
        const token = fs.readFileSync(FILE_PATHS.AUTH_TOKEN).toString();
        return token;
      }
      return undefined;
    }

    static setAuthToken (newToken: string) {
      ensureHomeFolder();
      fs.writeFileSync(FILE_PATHS.AUTH_TOKEN, newToken);
    }
  }
}
