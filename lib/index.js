"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const child_process_1 = require("child_process");
const HAIKU_ALMOST_EMPTY = "https://github.com/HaikuTeam/almost-empty.git";
const FILE_PATHS = {
    AUTH_TOKEN: os.homedir() + "/.haiku/auth"
};
function _ensureHomeFolder() {
    mkdirp.sync(os.homedir() + "/.haiku");
}
var client;
(function (client) {
    function verboselyLog(message, ...args) {
        if (_clientConfig.verbose) {
            console.log(message, ...args);
        }
    }
    client.verboselyLog = verboselyLog;
    function error(err) {
    }
    client.error = error;
    class npm {
        static readPackageJson(path = process.cwd() + "/package.json") {
            return JSON.parse(fs.readFileSync(path, "utf8"));
        }
        static writePackageJson(jsonObject, path = process.cwd() + "/package.json") {
            fs.writeFileSync(path, JSON.stringify(jsonObject, undefined, 2));
        }
    }
    client.npm = npm;
    class git {
        static ensureRemoteIsInitialized(remoteName, remoteUrl, cb) {
            var pwd = path.resolve('.');
            var remotes = child_process_1.execSync(`git remote`).toString().split("\n");
            var ensureRemoteRefs = function () {
                var results = child_process_1.execSync(`git ls-remote ${remoteName}`).toString();
                if (results == "") {
                    child_process_1.execSync(`git remote add haiku-almost-empty ${HAIKU_ALMOST_EMPTY}`);
                    child_process_1.execSync(`git fetch haiku-almost-empty`);
                    child_process_1.execSync(`git push ${remoteName} haiku-almost-empty/master:refs/heads/master`);
                    child_process_1.execSync(`git remote remove haiku-almost-empty`);
                    cb();
                    return;
                }
                else {
                    client.verboselyLog("remote info:", results);
                    cb();
                    return;
                }
            };
            client.verboselyLog('remotes', remotes);
            if (remotes.indexOf(remoteName) == -1) {
                client.verboselyLog('creating remote', remoteName);
                client.verboselyLog(child_process_1.execSync(`git remote add ${remoteName} ${remoteUrl}`).toString());
                ensureRemoteRefs();
            }
            else {
                client.verboselyLog("remote already exists", remoteName);
                ensureRemoteRefs();
            }
        }
        static forciblyCloneSubrepo(remote, path, cb) {
            child_process_1.execSync(`git subrepo clone -f ${remote} ${path}`);
            cb();
        }
        static cloneRepo(remote, path, cb) {
            var err;
            try {
                child_process_1.execSync(`git clone ${remote} ${path}`);
            }
            catch (e) {
                err = e;
                client.verboselyLog("error cloning repository", e);
            }
            cb(err);
        }
    }
    client.git = git;
    var _clientConfig = {
        verbose: false
    };
    function setConfig(newVals) {
        _.extend(_clientConfig, newVals);
    }
    client.setConfig = setConfig;
    class config {
        static getAuthToken() {
            if (fs.existsSync(FILE_PATHS.AUTH_TOKEN)) {
                var token = fs.readFileSync(FILE_PATHS.AUTH_TOKEN).toString();
                return token;
            }
            else {
                return undefined;
            }
        }
        static isAuthenticated() {
            var token = config.getAuthToken();
            return token !== undefined && token !== "";
        }
        static setAuthToken(newToken) {
            _ensureHomeFolder();
            fs.writeFileSync(FILE_PATHS.AUTH_TOKEN, newToken);
        }
    }
    client.config = config;
})(client = exports.client || (exports.client = {}));
//# sourceMappingURL=index.js.map