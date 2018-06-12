import * as path from 'path';
import * as fse from 'haiku-fs-extra';
import * as async from 'async';
import * as dedent from 'dedent';
import {escapeRegExp} from 'lodash';
import * as semver from 'semver';
import * as moment from 'moment';
import {createBundle} from './Bundler';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import * as Project from 'haiku-serialization/src/bll/Project';

const PLUMBING_DIR = path.join(__dirname, '..');

const CORE_PACKAGE_JSON = fse.readJsonSync(
  require.resolve(path.join('@haiku/core', 'package.json')),
  {throws: false},
);
if (!CORE_PACKAGE_JSON) {
  throw new Error('Plumbing needs its dependencies to be installed');
}

const DEFAULT_PROJECT_TYPE = 'haiku';
const FALLBACK_ORG_NAME = 'Unknown';
const FALLBACK_AUTHOR_NAME = 'Haiku User';

/* tslint:disable:max-line-length */
const MIT_LICENSE = `
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  `;
/* tslint:disable:max-line-length */

function dir () {
  const args = [];
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  return path.join.apply(path, args);
}

export function buildProjectContent (
  ignoredLegacyArg,
  projectPath,
  projectName,
  projectType = DEFAULT_PROJECT_TYPE,
  projectOptions,
  finish,
) {
  try {
    logger.info('[project folder] building project content', projectPath);

    const {
      projectNameSafe,
      projectNameLowerCase,
      reactProjectName,
      primaryAssetPath,
      defaultIllustratorAssetPath,
    } = Project.getProjectNameVariations(projectPath);

    const organizationName = projectOptions.organizationName || FALLBACK_ORG_NAME;
    const organizationNameLowerCase = organizationName.toLowerCase();

    const authorName = projectOptions.authorName || FALLBACK_AUTHOR_NAME;

    const haikuCoreVersion = CORE_PACKAGE_JSON.version; // This json object should be loaded at the top
    const npmPackageName = `@haiku/${organizationNameLowerCase}-${projectNameLowerCase}`;
    const humanTimestamp = moment().format('YYYYMMDDHHmmss');
    const autoGeneratedNotice = `This file was autogenerated by Haiku at ${humanTimestamp}.`;
    const copyrightNotice = dedent`
      ${`Copyright (c) ${(new Date()).getFullYear()} ${organizationName}. All rights reserved.`}
      ${projectOptions.isPublic ? MIT_LICENSE : ''}
    `;

    let packageJson;
    const packageJsonPath = dir(projectPath, 'package.json');
    if (fse.existsSync(packageJsonPath)) {
      packageJson = fse.readJsonSync(dir(projectPath, 'package.json'), {throws: false});
    }

    return Project.fetchProjectConfigInfo(projectPath, (err, userconfig) => {
      if (err) {
        throw err;
      }

      if (!packageJson) {
        fse.outputFileSync(dir(projectPath, 'package.json'), dedent`
          {
            "name": "${npmPackageName}",
            "version": "${userconfig.version}",
            "haiku": ${JSON.stringify(userconfig, null, 2)},
            "authors": [
              "${authorName}",
              "Haiku <contact@haiku.ai>"
            ],
            "license": "LicenseRef-LICENSE",
            "main": "index.js",
            "dependencies": {
              "@haiku/core": "$^{haikuCoreVersion}"
            }
          }
        `);
      } else {
        packageJson.haiku = userconfig;

        packageJson.name = npmPackageName;

        if (!packageJson.dependencies) {
          packageJson.dependencies = {};
        }

        if (packageJson.dependencies['@haiku/player']) {
          delete packageJson.dependencies['@haiku/player'];
        }

        // TODO: Handle this step more gracefully when we are increasing by a major version.
        packageJson.dependencies['@haiku/core'] = `^${haikuCoreVersion}`;

        // #LEGACY: some old Haiku in the wild have an engines entry, which causes issues with yarn.
        delete packageJson.engines;

        // Write the file assuming we may have made a change in any of the conditions above
        fse.writeJsonSync(dir(projectPath, 'package.json'), packageJson, {spaces: 2});
      }

      // This option is used when we initially set up a project before we've attempted to clone content that
      // may or may not exist on the remote. Since this case involves copying into a temp folder and then back
      // on top of the cloned content, we don't want to create anything that might inadvertently overwrite stuff.
      if (projectOptions.skipContentCreation) {
        logger.info('[project folder] skipping content creation (II)');
        return finish();
      }

      logger.info('[project folder] creating folders');

      fse.mkdirpSync(dir(projectPath, '.haiku'));
      fse.mkdirpSync(dir(projectPath, 'designs'));
      fse.mkdirpSync(dir(projectPath, 'code/main'));
      fse.mkdirpSync(dir(projectPath, 'public'));

      logger.info('[project folder] moving/updating legacy files');

      // Do a bunch of fix-ups that modify the folder content from legacy naming and folder structure.
      // We need to change this subroutine any time we make a change to the project content structure
      const filesToMove = {
        // Core code files
        'bytecode.js': 'code/main/code.js',

        // --
        // TODO: Switch the bundle code files to these paths, once we're ready to make the equivalent
        // switch inside sumi-e, inkstone, share-page, and wherever else.
        // ALSO SEE BELOW, where paths need to be changed as well
        // 'index.embed.js': 'public/dom-embed.bundle.js',
        // 'index.standalone.js': 'public/dom-standalone.bundle.js'
        // --
      };
      for (const formerFilePath in filesToMove) {
        const nextFilePath = filesToMove[formerFilePath];
        if (fse.existsSync(dir(projectPath, formerFilePath))) {
          // I guess there is no 'moveSync', and 'copySync' acts weird, so here it is imperatively:
          const contentsToCopy = fse.readFileSync(dir(projectPath, formerFilePath)).toString();
          fse.outputFileSync(dir(projectPath, nextFilePath), contentsToCopy);
          fse.removeSync(dir(projectPath, formerFilePath));
        }
      }

      logger.info('[project folder] removing unneeded files');

      const filesToRemove = [
        'index.embed.html',
        'index.standalone.html',
        'interpreter.js',
        'embed.js',
        'react-dom.js',
        'vue-dom.js',
      ];
      filesToRemove.forEach((fileToRemove) => {
        fse.removeSync(dir(projectPath, fileToRemove));
      });

      logger.info('[project folder] creating files');

      // Other user data may have been written these, so don't overwrite if they're already present
      if (!fse.existsSync(dir(projectPath, '.haiku/comments.json'))) {
        fse.outputFileSync(dir(projectPath, '.haiku/comments.json'), dedent`
          []
        `);
      }

      // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
      if (!fse.existsSync(dir(projectPath, primaryAssetPath))) {
        fse.copySync(path.join(PLUMBING_DIR, 'bins', 'sketch-42.sketch'), dir(projectPath, primaryAssetPath));
      }

      // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
      if (!fse.existsSync(dir(projectPath, defaultIllustratorAssetPath))) {
        fse.copySync(path.join(PLUMBING_DIR, 'bins', 'illustrator-default.ai'), dir(projectPath, defaultIllustratorAssetPath));
      }

      fse.outputFileSync(dir(projectPath, 'README.md'), dedent`
        # ${projectNameSafe}

        This project was created with [Haiku](https://haiku.ai).

        ## Install

        \`\`\`
        $ haiku install ${projectNameSafe}
        \`\`\`

        ## Usage

        \`\`\`
        var ${projectNameSafe} = require('${npmPackageName}')
        \`\`\`

        ## Copyright

        Please refer to LICENSE.txt.
      `);

      fse.outputFileSync(dir(projectPath, 'LICENSE.txt'), dedent`
        ${copyrightNotice}
      `);

      const embedName = `HaikuComponentEmbed_${organizationName}_${projectNameSafe}`;
      const standaloneName = `HaikuComponent_${organizationName}_${projectNameSafe}`;

      // But a bunch of ancillary files we take full control of and overwrite despite what the user did
      fse.outputFileSync(dir(projectPath, 'index.js'), dedent`
        // By default, a DOM module is exported; see code/main/* for other options
        module.exports = require('./code/main/dom')
      `);
      fse.outputFileSync(dir(projectPath, 'react.js'), dedent`
        // By default, a react-dom module is exported; see code/main/* for other options
        module.exports = require('./code/main/react-dom')
      `);
      fse.outputFileSync(dir(projectPath, 'angular-module.js'), dedent`
        // By default, a Angular module is exported; see code/main/* for other options
        module.exports = {
          default: require('./code/main/angular-dom')
        }
      `);
      fse.outputFileSync(dir(projectPath, 'vue.js'), dedent`
        // By default, a vue-dom module is exported; see code/main/* for other options
        module.exports = require('./code/main/vue-dom')
      `);
      fse.outputFileSync(dir(projectPath, 'react-bare.js'), dedent`
        // This only exports a React module into which a Haiku Core must be passed
        var React = require('react') // Installed as a peer dependency of '@haiku/core'
        var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
        var HaikuReactAdapter = require('@haiku/core/dom/react')
        var ${reactProjectName}_Bare = HaikuReactAdapter(null, require('./code/main/code'))
        if (${reactProjectName}_Bare.default) ${reactProjectName}_Bare = ${reactProjectName}_Bare.default
        module.exports = ${reactProjectName}_Bare
      `);

      fse.outputFileSync(dir(projectPath, 'preview.html'), dedent`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${projectNameSafe} | Preview | Haiku</title>
          <style>
            .container { margin: 0 auto; width: 100%; }
            #mount { width: 100%; margin: 0 auto; }
            body { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div id="mount"></div>
          </div>
          <script src="./index.standalone.js"></script>
          <script>
            ${standaloneName}(document.getElementById('mount'), {
              sizing: 'contain',
              loop: true
            })
          </script>
        </body>
        </html>
      `);

      // Should we try to merge these if the user made any changes?
      fse.outputFileSync(dir(projectPath, '.gitignore'), dedent`
        .DS_Store
        *.log
        *.*.log
        node_modules
        bower_components
        jspm_modules
        coverage
        build
        dist
        .env
      `);
      fse.outputFileSync(dir(projectPath, '.npmignore'), dedent`
        .DS_Store
        .git
        .svn
        *.log
        *.*.log
        *.ai
        *.sketch
        *.svg
        .env
        .haiku
      `);
      fse.outputFileSync(dir(projectPath, '.yarnignore'), dedent`
        .DS_Store
        .git
        .svn
        *.log
        *.*.log
        *.ai
        *.sketch
        *.svg
        .env
        .haiku
      `);
      fse.outputFileSync(dir(projectPath, '.npmrc'), dedent`
        registry=https://registry.npmjs.org/
        @haiku:registry=https://reservoir.haiku.ai:8910/
      `);
      fse.outputFileSync(dir(projectPath, '.yarnrc'), dedent`
        registry "https://registry.npmjs.org/"
        "@haiku:registry" "https://reservoir.haiku.ai:8910/"
      `);

      // Let the user skip this heavy step optionally, e.g. when just initializing the project the first time
      if (projectOptions.skipCDNBundles) {
        logger.info('[project folder] skipping cdn bundles');
        return finish();
      }

      logger.info('[project folder] creating cdn bundles');
      return async.parallel([
        (cb) => {
          logger.info('[project folder] bundling code/main/dom-embed.js');
          return createBundle(
            dir(projectPath, 'code/main'),
            dir(projectPath, 'code/main/dom-embed.js'),
            embedName,
            (bundleErr, bundledContents) => {
              if (bundleErr) {
                return cb(bundleErr);
              }
              logger.info('[project folder] bundling succeeded for', embedName);
              const finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${bundledContents}`;
              fse.outputFileSync(dir(projectPath, 'index.embed.js'), finalContent);
              return cb();
            },
          );
        },
        (cb) => {
          logger.info('[project folder] bundling code/main/dom-standalone.js');
          return createBundle(
            dir(projectPath, 'code/main'),
            dir(projectPath, 'code/main/dom-standalone.js'),
            standaloneName,
            (bundleErr, bundledContents) => {
              if (bundleErr) {
                return cb(bundleErr);
              }
              logger.info('[project folder] bundling succeeded for', standaloneName);
              const finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${bundledContents}`;
              fse.outputFileSync(dir(projectPath, 'index.standalone.js'), finalContent);
              return cb();
            },
          );
        },
      ], (asyncErr, results) => {
        if (asyncErr) {
          return finish(asyncErr);
        }
        return finish(null, results[results.length - 1]);
      });
    });
  } catch (exception) {
    logger.error('[project folder] ' + exception);
    return finish(exception);
  }
}

export function semverBumpPackageJson (projectPath, maybeVersionToBumpTo, cb) {
  try {
    const jsonPath = path.join(projectPath, 'package.json');

    logger.info(`[project folder] semver bump: checking ${jsonPath}`);

    const pkg = fse.readJsonSync(jsonPath);

    let newVersion;

    // Allow a version to be specified explicitly. This turns out to be useful in plumbing/master
    // where we might find a previously-used tag and need to explicitly bump from it, instead of using
    // what might be defined in the package.json.
    if (maybeVersionToBumpTo) {
      logger.info(`[project folder] semver bump: got explicit version ${maybeVersionToBumpTo}`);
      newVersion = maybeVersionToBumpTo;
    } else {
      const prevVersion = pkg.version;
      logger.info(`[project folder] semver bump: found previous version ${prevVersion}`);
      newVersion = semver.inc(prevVersion, 'patch');
    }

    logger.info(`[project folder] semver bump: assigning version ${newVersion}`);

    pkg.version = newVersion;
    const newJson = JSON.stringify(pkg, null, 2) + '\n';
    fse.writeFileSync(jsonPath, newJson);

    return cb(null, newVersion);
  } catch (exception) {
    return cb(exception);
  }
}

export function duplicateProject (destinationProject, sourceProject, cb) {
  try {
    // Create a haiku config file.
    fse.mkdirpSync(destinationProject.projectPath);

    const sourcePrimaryAssetPath = Project.getPrimaryAssetPath(sourceProject.projectName);
    const sourceAssetBasename = path.basename(sourcePrimaryAssetPath);
    const sourceAssetPathPattern = new RegExp(escapeRegExp(sourceAssetBasename), 'g');

    const destinationPrimaryAssetPath = Project.getPrimaryAssetPath(destinationProject.projectName);
    const destinationAssetBasename = path.basename(destinationPrimaryAssetPath);
    logger.info(`using ${sourceAssetBasename}, ${destinationAssetBasename}, ${sourceAssetPathPattern}`);

    const scenes = fse.readdirSync(path.join(sourceProject.projectPath, 'code'));
    scenes.forEach((sceneName) => {
      const destinationScenePath = path.join(destinationProject.projectPath, 'code', sceneName);
      fse.mkdirpSync(destinationScenePath);

      const bytecode = fse.readFileSync(path.join(sourceProject.projectPath, 'code', sceneName, 'code.js'))
        .toString()
        .replace(sourceAssetPathPattern, destinationAssetBasename);
      fse.outputFileSync(path.join(destinationScenePath, 'code.js'), bytecode);
    });

    const designAssets = fse.readdirSync(path.join(sourceProject.projectPath, 'designs'));
    designAssets.forEach((designAssetName) => {
      const destinationDesignAsset = designAssetName.startsWith(sourceAssetBasename)
        ? designAssetName.replace(sourceAssetBasename, destinationAssetBasename)
        : designAssetName;
      fse.copySync(
        path.join(sourceProject.projectPath, 'designs', designAssetName),
        path.join(destinationProject.projectPath, 'designs', destinationDesignAsset),
      );
    });

    cb();
  } catch (err) {
    return cb(err);
  }
}
