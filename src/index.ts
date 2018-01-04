import * as requestLib from 'request';
import * as fs from 'fs';
import * as os from 'os';
import * as _ from 'lodash';
import * as mkdirp from 'mkdirp';
import {execSync} from 'child_process';

const HAIKU_ALMOST_EMPTY = 'https://github.com/HaikuTeam/almost-empty.git';

const FILE_PATHS = {
  AUTH_TOKEN: os.homedir() + '/.haiku/auth',
  USER_ID: os.homedir() + '/.haiku/userid',
};

function ensureHomeFolder() {
  mkdirp.sync(os.homedir() + '/.haiku');
}

export namespace client {

  export function verboselyLog(message: string, ...args) {
    if (clientConfig.verbose) {
      console.log(message, ...args);
    }
  }

  export function error(err: any) {
    // TODO: elegantly handle errors
  }

  export class npm {
    static readPackageJson(path: string = global.process.cwd() + '/package.json'): any {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    static writePackageJson(jsonObject: any, path: string = global.process.cwd() + '/package.json') {
      fs.writeFileSync(path, JSON.stringify(jsonObject, undefined, 2));
    }
  }

  export class git {
    // 1. adds the git remote + name if it doesn't exist
    // 2. ensures that there are remote refs, pushing them if needed
    static ensureRemoteIsInitialized(remoteName: string, remoteUrl: string, cb: Function) {
      // remoteName = "haiku/" + remoteName

      // check registered remotes
      const remotes: string[] = execSync(`git remote`).toString().split('\n');

      // TODO: solve this better than just shelling out.
      // (nodegit is an option, if we can work out native packaging/bundling)
      const ensureRemoteRefs = function () {
        const results = execSync(`git ls-remote ${remoteName}`).toString();
        if (results === '') {
          // no remote refs, i.e. bare remote repo.
          // quasi-hacky fix for now is to push from a public (github-hosted) repo
          // over to this new one, then we'll have remote refs.
          execSync(`git remote add haiku-almost-empty ${HAIKU_ALMOST_EMPTY}`);
          execSync(`git fetch haiku-almost-empty`);
          execSync(`git push ${remoteName} haiku-almost-empty/master:refs/heads/master`);
          execSync(`git remote remove haiku-almost-empty`);
          cb();
          return;
        }

        // we're good, remote already has refs
        client.verboselyLog('remote info:', results);
        cb();
        return;
      };

      // if remote doesn't exist, create it
      client.verboselyLog('remotes', remotes);
      if (remotes.indexOf(remoteName) === -1) {
        client.verboselyLog('creating remote', remoteName);
        client.verboselyLog(execSync(`git remote add ${remoteName} ${remoteUrl}`).toString());
        ensureRemoteRefs();
      } else {
        client.verboselyLog('remote already exists', remoteName);
        ensureRemoteRefs();
      }

    }

    // TODO: assumes git-subrepo is installed on user's machine.
    //       https://github.com/ingydotnet/git-subrepo
    //       we can do better than this:
    //       let's fork it (credit in the code, but MIT license)
    //       and create our own API wrapper around it
    //       (so it doesn't need to be installed on user's command line)
    //       and 'rebrand' the exterior, e.g. update the commit message
    //       to say "Imported Haiku Component" instead of "git subrepo blargh"
    static forciblyCloneSubrepo(remote: string, path: string, cb: Function) {
      // remote = "haiku/" + remote
      execSync(`git subrepo clone -f ${remote} ${path}`);
      cb();
    }

    static cloneRepo(remote: string, path: string, cb: (error?: any) => any) {
      let err;
      try {
        execSync(`git clone ${remote} ${path}`);
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

  export function setConfig(newVals: ClientConfig) {
    _.extend(clientConfig, newVals);
  }


  export class config {

    static getAuthToken(): string {
      if (fs.existsSync(FILE_PATHS.AUTH_TOKEN)) {
        const token = fs.readFileSync(FILE_PATHS.AUTH_TOKEN).toString();
        return token;
      }
      return undefined;
    }

    static getUserId(): string {
      if (fs.existsSync(FILE_PATHS.USER_ID)) {
        return fs.readFileSync(FILE_PATHS.USER_ID).toString();
      }
      return undefined;
    }

    static isAuthenticated(): boolean {
      const token = config.getAuthToken();
      const userId = config.getUserId();
      // TODO: can check for token expiration here
      //       may also want to add a check with server at some point
      //       for whether a token is valid
      return token !== undefined && token !== '' && userId !== undefined && userId !== '';
    }

    static setAuthToken(newToken: string) {
      ensureHomeFolder();
      fs.writeFileSync(FILE_PATHS.AUTH_TOKEN, newToken);
    }

    static setUserId(newUserId: string) {
      ensureHomeFolder();
      fs.writeFileSync(FILE_PATHS.USER_ID, newUserId);
    }
  }
}
