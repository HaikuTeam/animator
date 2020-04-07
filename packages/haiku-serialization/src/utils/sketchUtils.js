const path = require('path');
const {exec} = require('child_process');
const logger = require('./LoggerInstance');
const {isMac} = require('haiku-common/lib/environments/os');

const SKETCH_PATH_FINDER = `mdfind "kMDItemKind == 'Application'" | grep Sketch.app`
const PARSER_CLI_PATH = '/Contents/Resources/sketchtool/bin/sketchtool';
let sketchInstalledCache = null;

module.exports = {
  dumpToPaths (rawDump) {
    logger.info('[sketch utils] about to parse Sketch paths', rawDump);

    return rawDump
        .trim()
        .split('\n')
        .map((pathWithExtras) => {
          try {
            return pathWithExtras.split(':')[1].trim();
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean);
  },

  pathsToInstallationInfo (sketchPaths) {
    const resolvingSketchPaths = sketchPaths.map((sketchPath) => {
      return new Promise((resolve, reject) => {
        const sketchtoolPath = path.join(sketchPath, PARSER_CLI_PATH);

        exec(`${sketchtoolPath} --version`, (error, stdout, stderr) => {
          if (error || !stdout || stdout.trim().length === 0 || stderr) {
            return resolve(null);
          }

          const rawBuildNumber = stdout.match(/\((.*?)\)/)[1];
          const sketchtoolBuildNumber = Number(rawBuildNumber);
          return resolve({sketchPath, sketchtoolBuildNumber});
        });
      });
    });

    return Promise.all(resolvingSketchPaths);
  },

  getDumpInfo () {
    return new Promise((resolve, reject) => {
      exec(SKETCH_PATH_FINDER, (error, stdout, stderr) => {
        if (error || !stdout || stdout.trim().length === 0 || stderr) {
          reject(error);
        }

        return resolve(stdout, stderr);
      });
    });
  },

  findBestPath (sketchPaths) {
    const sortedPaths = sketchPaths
      .filter(Boolean)
      .sort((a, b) => b.sketchtoolBuildNumber - a.sketchtoolBuildNumber);

    return sortedPaths[0] && sortedPaths[0].sketchPath;
  },

  unsetSketchInstalledCache () {
    sketchInstalledCache = null;
  },

  checkIfInstalled () {
    // Only Mac has sketch support
    if (isMac()) {
      return new Promise((resolve, reject) => {
        if (sketchInstalledCache !== null) {
          return resolve(sketchInstalledCache);
        }

        this.getDumpInfo()
          .then(this.dumpToPaths)
          .then(this.pathsToInstallationInfo)
          .then((path) => {
            sketchInstalledCache = Boolean(path);
            resolve(path);
          })
          .catch((error) => {
            logger.info('[sketch utils] error finding Sketch: ', error);
            sketchInstalledCache = false;
            resolve(false);
          });
      });
    }

    logger.info('[sketch utils] Platform does not support Sketch');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  },
};
