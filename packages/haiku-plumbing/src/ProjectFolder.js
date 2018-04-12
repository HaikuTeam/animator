import path from 'path'
import fse from 'haiku-fs-extra'
import async from 'async'
import dedent from 'dedent'
import { escapeRegExp } from 'lodash'
import semver from 'semver'
import moment from 'moment'
import Bundler from './Bundler'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import * as HaikuHomeDir from 'haiku-serialization/src/utils/HaikuHomeDir'
import Project from 'haiku-serialization/src/bll/Project'

const PLUMBING_DIR = path.join(__dirname, '..')

const CORE_PACKAGE_JSON = fse.readJsonSync(
  require.resolve(path.join('@haiku/core', 'package.json')),
  { throws: false }
)
if (!CORE_PACKAGE_JSON) {
  throw new Error('Plumbing needs its dependencies to be installed')
}

const DEFAULT_PROJECT_TYPE = 'haiku'
const HAIKU_CONFIG_FILE = 'haiku.js'
const WHITESPACE_REGEX = /\s+/
const UNDERSCORE = '_'
const FALLBACK_ORG_NAME = 'Unknown'
const FALLBACK_AUTHOR_NAME = 'Haiku User'
const FALLBACK_SEMVER_VERSION = '0.0.0'

export function getSafeOrgName (maybeOrgName) {
  if (!maybeOrgName || typeof maybeOrgName !== 'string') maybeOrgName = FALLBACK_ORG_NAME
  return maybeOrgName.replace(WHITESPACE_REGEX, UNDERSCORE)
}

/**
 * @function ensureProject
 * @description Flexible way to ensure a project is ready. Use this if you aren't sure you have
 * all the params but want to get going, and/or if you want the system to infer where to put stuff.
 * NOTE: Any of the input object properties may be null/undefined!
 */
export function ensureProject (projectOptions, cb) {
  logger.info('[project folder] ensure project options:', JSON.stringify(projectOptions))

  let { projectsHome, projectPath, organizationName, projectName } = projectOptions

  // If no specified projects home folder, use the default Haiku projects home folder
  if (!projectsHome) {
    projectsHome = HaikuHomeDir.HOMEDIR_PROJECTS_PATH
  }

  // Note: The project folder is created with mkdirp, so we don't need to verify that home dir exists

  const safeProjectName = Project.getSafeProjectName(projectsHome, projectName)
  const safeOrgName = getSafeOrgName(organizationName)

  if (!projectPath) {
    projectPath = path.join(projectsHome, safeOrgName, safeProjectName)
  }

  const doesFolderAlreadyExist = fse.existsSync(projectPath)

  return ensureSpecificProject(projectPath, safeProjectName, 'haiku', projectOptions, (err, projectPath) => {
    if (err) return cb(err)

    // Downstream wants to know if the folder existed initially so it knows whether it should
    // clone down content for the first time, i.e. during multi-workstation editing
    return cb(null, projectPath, doesFolderAlreadyExist)
  })
}

/**
 * @function ensureSpecificProject
 * @description Less flexible than its sibling, this method assumes you have a specific folder in which
 * you want to boot up the project.
 */
export function ensureSpecificProject (projectPath, projectName, projectType = DEFAULT_PROJECT_TYPE, projectOptions, cb) {
  logger.info('[project folder] ensuring specific project', projectPath)

  if (!projectOptions) projectOptions = {}

  return fse.mkdirp(projectPath, (err) => {
    if (err) return cb(err)

    // This check is needed since Creator may wish to specify that we do/don't automatically create content.
    // This is very important because if we create content then pull from the remote, we'll get a weird initial state.
    if (projectOptions.skipContentCreation) {
      logger.info('[project folder] skipping content creation (I)')
      return cb(null, projectPath)
    }

    return buildProjectContent(null, projectPath, projectName, projectType, projectOptions, (err) => {
      if (err) return cb(err)
      return cb(null, projectPath)
    })
  })
}

function dir () {
  var args = []
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]
  var location = path.join.apply(path, args)
  return location
}

const writeHaikuConfigFile = (projectPath, projectName, projectType = DEFAULT_PROJECT_TYPE) => {
  fse.outputFileSync(dir(projectPath, HAIKU_CONFIG_FILE), dedent`
    module.exports = {
      type: '${projectType}',
      name: '${Project.getSafeProjectName(projectPath, projectName)}'
    }
  `)
}

export function buildProjectContent (_ignoredLegacyArg, projectPath, projectName, projectType = DEFAULT_PROJECT_TYPE, projectOptions, finish) {
  let looksLikeBrandNewProject = false

  try {
    logger.info('[project folder] building project content', projectPath)

    if (!fse.existsSync(dir(projectPath, HAIKU_CONFIG_FILE))) {
      logger.info('[project folder] creating haiku config')
      looksLikeBrandNewProject = true
    }

    writeHaikuConfigFile(projectPath, projectName, projectType)

    // Reload from the user's config in case they overrode ours
    const projectHaikuConfig = Project.getProjectHaikuConfig(projectPath)

    const projectSemverVersion = projectHaikuConfig.version || FALLBACK_SEMVER_VERSION

    const {
      projectNameSafe,
      projectNameLowerCase,
      reactProjectName,
      primaryAssetPath
    } = Project.getProjectNameVariations(projectPath)

    const organizationName = projectOptions.organizationName || FALLBACK_ORG_NAME
    const organizationNameLowerCase = organizationName.toLowerCase()

    const authorName = projectOptions.authorName || FALLBACK_AUTHOR_NAME

    const haikuCoreVersion = CORE_PACKAGE_JSON.version // This json object should be loaded at the top
    const npmPackageName = `@haiku/${organizationNameLowerCase}-${projectNameLowerCase}`
    const humanTimestamp = moment().format('YYYYMMDDHHmmss')
    const autoGeneratedNotice = `This file was autogenerated by Haiku at ${humanTimestamp}.`
    const copyrightNotice = `Copyright (c) ${(new Date()).getFullYear()} ${organizationName}. All rights reserved.`

    let packageJson
    const packageJsonPath = dir(projectPath, 'package.json')
    if (fse.existsSync(packageJsonPath)) {
      packageJson = fse.readJsonSync(dir(projectPath, 'package.json'), { throws: false })
    }
    if (!packageJson) {
      fse.outputFileSync(dir(projectPath, 'package.json'), dedent`
        {
          "name": "${npmPackageName}",
          "version": "${projectSemverVersion}",
          "haiku": {
            "organization": "${organizationName}",
            "project": "${projectNameSafe}"
          },
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
      `)
    } else {
      // Fix up the contents of the package.json if they happen to be wrong, e.g., organization name not set correctly
      if (organizationName && organizationName !== FALLBACK_ORG_NAME) {
        packageJson.haiku = {
          organization: organizationName,
          project: projectNameSafe
        }
      }

      packageJson.name = npmPackageName

      if (!packageJson.dependencies) {
        packageJson.dependencies = {}
      }

      if (packageJson.dependencies['@haiku/player']) {
        delete packageJson.dependencies['@haiku/player']
      }

      // TODO: Handle this step more gracefully when we are increasing by a major version.
      packageJson.dependencies['@haiku/core'] = `^${haikuCoreVersion}`

      // #LEGACY: some old Haiku in the wild have an engines entry, which causes issues with yarn.
      delete packageJson.engines

      // Write the file assuming we may have made a change in any of the conditions above
      fse.writeJsonSync(dir(projectPath, 'package.json'), packageJson, { spaces: 2 })
    }

    // This option is used when we initially set up a project before we've attempted to clone content that
    // may or may not exist on the remote. Since this case involves copying into a temp folder and then back
    // on top of the cloned content, we don't want to create anything that might inadvertently overwrite stuff.
    if (projectOptions.skipContentCreation) {
      logger.info('[project folder] skipping content creation (II)')
      return finish()
    }

    logger.info('[project folder] creating folders')

    fse.mkdirpSync(dir(projectPath, '.haiku'))
    fse.mkdirpSync(dir(projectPath, 'designs'))
    fse.mkdirpSync(dir(projectPath, 'code/main'))
    fse.mkdirpSync(dir(projectPath, 'public'))

    logger.info('[project folder] moving/updating legacy files')

    // Do a bunch of fix-ups that modify the folder content from legacy naming and folder structure.
    // We need to change this subroutine any time we make a change to the project content structure
    let filesToMove = {
      // Core code files
      'bytecode.js': 'code/main/code.js'

      // --
      // TODO: Switch the bundle code files to these paths, once we're ready to make the equivalent
      // switch inside sumi-e, inkstone, share-page, and wherever else.
      // ALSO SEE BELOW, where paths need to be changed as well
      // 'index.embed.js': 'public/dom-embed.bundle.js',
      // 'index.standalone.js': 'public/dom-standalone.bundle.js'
      // --
    }
    for (let formerFilePath in filesToMove) {
      let nextFilePath = filesToMove[formerFilePath]
      if (fse.existsSync(dir(projectPath, formerFilePath))) {
        // I guess there is no 'moveSync', and 'copySync' acts weird, so here it is imperatively:
        let contentsToCopy = fse.readFileSync(dir(projectPath, formerFilePath)).toString()
        fse.outputFileSync(dir(projectPath, nextFilePath), contentsToCopy)
        fse.removeSync(dir(projectPath, formerFilePath))
      }
    }

    logger.info('[project folder] removing unneeded files')

    let filesToRemove = [
      'index.embed.html',
      'index.standalone.html',
      'interpreter.js',
      'embed.js',
      'react-dom.js',
      'vue-dom.js'
    ]
    filesToRemove.forEach((fileToRemove) => {
      fse.removeSync(dir(projectPath, fileToRemove))
    })

    logger.info('[project folder] creating files')

    // Other user data may have been written these, so don't overwrite if they're already present
    if (!fse.existsSync(dir(projectPath, '.haiku/comments.json'))) {
      fse.outputFileSync(dir(projectPath, '.haiku/comments.json'), dedent`
        []
      `)
    }

    // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
    if (looksLikeBrandNewProject) {
      if (!fse.existsSync(dir(projectPath, primaryAssetPath))) {
        fse.copySync(path.join(PLUMBING_DIR, 'bins', 'sketch-42.sketch'), dir(projectPath, primaryAssetPath))
      }
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
    `)

    // If it isn't already a part of the project, add a default license
    if (looksLikeBrandNewProject) {
      fse.outputFileSync(dir(projectPath, 'LICENSE.txt'), dedent`
        ${copyrightNotice}
      `)
    }

    let embedName = `HaikuComponentEmbed_${organizationName}_${projectNameSafe}`
    let standaloneName = `HaikuComponent_${organizationName}_${projectNameSafe}`

    // But a bunch of ancillary files we take full control of and overwrite despite what the user did
    fse.outputFileSync(dir(projectPath, 'index.js'), dedent`
      // By default, a DOM module is exported; see code/main/* for other options
      module.exports = require('./code/main/dom')
    `)
    fse.outputFileSync(dir(projectPath, 'react.js'), dedent`
      // By default, a react-dom module is exported; see code/main/* for other options
      module.exports = require('./code/main/react-dom')
    `)
    fse.outputFileSync(dir(projectPath, 'vue.js'), dedent`
      // By default, a vue-dom module is exported; see code/main/* for other options
      module.exports = require('./code/main/vue-dom')
    `)
    fse.outputFileSync(dir(projectPath, 'react-bare.js'), dedent`
      // This only exports a React module into which a Haiku Core must be passed
      var React = require('react') // Installed as a peer dependency of '@haiku/core'
      var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
      var HaikuReactAdapter = require('@haiku/core/dom/react')
      var ${reactProjectName}_Bare = HaikuReactAdapter(null, require('./code/main/code'))
      if (${reactProjectName}_Bare.default) ${reactProjectName}_Bare = ${reactProjectName}_Bare.default
      module.exports = ${reactProjectName}_Bare
    `)

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
    `)

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
    `)
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
    `)
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
    `)
    fse.outputFileSync(dir(projectPath, '.npmrc'), dedent`
      registry=https://registry.npmjs.org/
      @haiku:registry=https://reservoir.haiku.ai:8910/
    `)
    fse.outputFileSync(dir(projectPath, '.yarnrc'), dedent`
      registry "https://registry.npmjs.org/"
      "@haiku:registry" "https://reservoir.haiku.ai:8910/"
    `)

    // Let the user skip this heavy step optionally, e.g. when just initializing the project the first time
    if (projectOptions.skipCDNBundles) {
      logger.info('[project folder] skipping cdn bundles')
      return finish()
    }

    logger.info('[project folder] creating cdn bundles')
    return async.parallel([
      function (cb) {
        logger.info('[project folder] bundling code/main/dom-embed.js')
        return Bundler.createBundle(
          dir(projectPath, 'code/main'),
          dir(projectPath, 'code/main/dom-embed.js'),
          embedName,
          (err, bundledContents) => {
            if (err) return cb(err)
            logger.info('[project folder] bundling succeeded for', embedName)
            let finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${bundledContents}`
            fse.outputFileSync(dir(projectPath, 'index.embed.js'), finalContent)
            return cb()
          }
        )
      },
      function (cb) {
        logger.info('[project folder] bundling code/main/dom-standalone.js')
        return Bundler.createBundle(
          dir(projectPath, 'code/main'),
          dir(projectPath, 'code/main/dom-standalone.js'),
          standaloneName,
          (err, bundledContents) => {
            if (err) return cb(err)
            logger.info('[project folder] bundling succeeded for', standaloneName)
            let finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${bundledContents}`
            fse.outputFileSync(dir(projectPath, 'index.standalone.js'), finalContent)
            return cb()
          }
        )
      }
    ], (err, results) => {
      if (err) return finish(err)
      return finish(null, results[results.length - 1])
    })
  } catch (exception) {
    logger.error('[project folder] ' + exception)
    return finish(exception)
  }
}

export function semverBumpPackageJson (projectPath, maybeVersionToBumpTo, cb) {
  try {
    var jsonPath = path.join(projectPath, 'package.json')

    logger.info(`[project folder] semver bump: checking ${jsonPath}`)

    const pkg = fse.readJsonSync(jsonPath)

    let newVersion

    // Allow a version to be specified explicitly. This turns out to be useful in plumbing/master
    // where we might find a previously-used tag and need to explicitly bump from it, instead of using
    // what might be defined in the package.json.
    if (maybeVersionToBumpTo) {
      logger.info(`[project folder] semver bump: got explicit version ${maybeVersionToBumpTo}`)
      newVersion = maybeVersionToBumpTo
    } else {
      const prevVersion = pkg.version || FALLBACK_SEMVER_VERSION
      logger.info(`[project folder] semver bump: found previous version ${prevVersion}`)
      newVersion = semver.inc(prevVersion, 'patch')
    }

    logger.info(`[project folder] semver bump: assigning version ${newVersion}`)

    pkg.version = newVersion
    const newJson = JSON.stringify(pkg, null, 2) + '\n'
    fse.writeFileSync(jsonPath, newJson)

    return cb(null, newVersion)
  } catch (exception) {
    return cb(exception)
  }
}

export function duplicateProject (destinationProject, sourceProject, cb) {
  try {
    // Create a haiku config file.
    fse.mkdirpSync(destinationProject.projectPath)
    writeHaikuConfigFile(destinationProject.projectPath, destinationProject.projectName)

    const sourceVariations = Project.getProjectNameVariations(sourceProject.projectPath)
    const sourceAssetBasename = path.basename(sourceVariations.primaryAssetPath)
    const sourceAssetPathPattern = new RegExp(escapeRegExp(sourceAssetBasename), 'g')

    const destinationVariations = Project.getProjectNameVariations(destinationProject.projectPath)
    const destinationAssetBasename = path.basename(destinationVariations.primaryAssetPath)
    logger.info(`using ${sourceAssetBasename}, ${destinationAssetBasename}, ${sourceAssetPathPattern}`)

    const scenes = fse.readdirSync(path.join(sourceProject.projectPath, 'code'))
    scenes.forEach((sceneName) => {
      const destinationScenePath = path.join(destinationProject.projectPath, 'code', sceneName)
      fse.mkdirpSync(destinationScenePath)

      const bytecode = fse.readFileSync(path.join(sourceProject.projectPath, 'code', sceneName, 'code.js'))
        .toString()
        .replace(sourceAssetPathPattern, destinationAssetBasename)
      fse.outputFileSync(path.join(destinationScenePath, 'code.js'), bytecode)
    })

    const designAssets = fse.readdirSync(path.join(sourceProject.projectPath, 'designs'))
    designAssets.forEach((designAssetName) => {
      const destinationDesignAsset = designAssetName.startsWith(sourceAssetBasename)
        ? designAssetName.replace(sourceAssetBasename, destinationAssetBasename)
        : designAssetName
      fse.copySync(
        path.join(sourceProject.projectPath, 'designs', designAssetName),
        path.join(destinationProject.projectPath, 'designs', destinationDesignAsset)
      )
    })

    cb()
  } catch (err) {
    return cb(err)
  }
}
