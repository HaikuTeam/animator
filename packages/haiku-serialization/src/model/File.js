var fse = require('fs-extra')
var path = require('path')
var async = require('async')
var assign = require('lodash.assign')
var debounce = require('lodash.debounce')
var merge = require('lodash.merge')
var find = require('lodash.find')
var pascalcase = require('pascalcase')

var visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default
var xmlToMana = require('@haiku/player/lib/helpers/xmlToMana').default
var convertManaLayout = require('@haiku/player/lib/layout/convertManaLayout').default
var objectToRO = require('@haiku/player/lib/reflection/objectToRO').default
var reifyRO = require('@haiku/player/lib/reflection/reifyRO').default
var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default

var Aspects = require('haiku-bytecode/src/Aspects')
var ensureManaChildrenArray = require('haiku-bytecode/src/ensureManaChildrenArray')
var getControlAttributes = require('haiku-bytecode/src/getControlAttributes')
var insertAttributesIntoTimelineGroup = require('haiku-bytecode/src/insertAttributesIntoTimelineGroup')
var mergeTimelineStructure = require('haiku-bytecode/src/mergeTimelineStructure')

var cleanMana = require('haiku-bytecode/src/cleanMana')
var extractReferenceIdFromUrlReference = require('haiku-bytecode/src/extractReferenceIdFromUrlReference')
var TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
var BytecodeActions = require('haiku-bytecode/src/actions')
var getPropertyValue = require('haiku-bytecode/src/getPropertyValue')
var upsertPropertyValue = require('haiku-bytecode/src/upsertPropertyValue')
var getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
var readMetadata = require('haiku-bytecode/src/readMetadata')
var writeMetadata = require('haiku-bytecode/src/writeMetadata')
var prettier = require('prettier')

var getHaikuKnownImportMatch = require('./getHaikuKnownImportMatch')
var overrideModulesLoaded = require('./../utils/overrideModulesLoaded')
var upsertRequire = require('./../ast/upsertRequire')
var removeRequire = require('./../ast/removeRequire')
var expressionToOASTComponent = require('./../ast/expressionToOASTComponent')
var formatStandard = require('./../formatter/formatStandard')
var generateCode = require('./../ast/generateCode')
var getObjectPropertyKey = require('./../ast/getObjectPropertyKey')
var parseCode = require('./../ast/parseCode')
var reifyOAST = require('./../ast/reifyOAST')
var traverseAST = require('./../ast/traverseAST')
var CryptoUtils = require('./../utils/CryptoUtils')
var Logger = require('./../utils/Logger')
var walkFiles = require('./../utils/walkFiles')
var define = require('./ModelClassFactory').define
var getNormalizedComponentModulePath = require('./helpers/getNormalizedComponentModulePath')

var { HOMEDIR_LOGS_PATH } = require('./../utils/HaikuHomeDir')

// This file also depends on '@haiku/player/lib/HaikuComponent'
// in the sense that one of those instances is assigned as 'hostInstance' here.
// ^^ Leave this message in this file so we can grep for it if necessary

const logger = new Logger()
const differ = require('./../utils/LoggerInstanceDiffs')

let instances = 0

const TEMPLATE_KEY_NAME = 'template'
const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0
const DEFAULT_ROOT_NODE_NAME = 'div'
const FALLBACK_TEMPLATE = '<' + DEFAULT_ROOT_NODE_NAME + '></' + DEFAULT_ROOT_NODE_NAME + '>'
const SOURCE_ATTRIBUTE = 'source'
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'
const HAIKU_SELECTOR_PREFIX = 'haiku'
const ROOT_LOCATOR = '0' // e.g. the locator of the root node in a mana tree
const DEFAULT_CONTEXT_SIZE = { width: 550, height: 400 }

const FILE_TYPES = {
  design: 'design',
  code: 'code'
}

function FileModel (config) {
  const File = define(`File_${instances++}`, {
    unique: 'relpath'
  })

  function looksLikeMassiveFile (relpath) {
    return relpath.match(/\.(standalone|bundle|embed)\.(js|html)$/)
  }

  File.TYPES = FILE_TYPES

  File.UPDATE_OPTIONS = {
    shouldUpdateFileSystem: true,
    shouldReloadCodeStructures: true
  }

  File.DEFAULT_CONTEXT_SIZE = DEFAULT_CONTEXT_SIZE

  // Dictionary of files currently in the process of being read/written.
  // Used as a kind of mutex where reading-while-writing causes a problem.
  File.lockees = {}

  function noop () {}

  // Constructor hook

  File.prototype.initialize = function initialize () {
    // During debugging, use this to keep track of mutations that occurred on the file
    this._mutations = []

    // keep track of components that have been removed, so when we mutate the ast we can clean up
    // the imports
    this._unrefedModules = []
  }

  // Basic Instance Methods

  File.prototype.updateContents = function updateContents (contents, options, cb) {
    options = assign({}, File.UPDATE_OPTIONS, options)

    if (!contents) {
      logger.warn('[file] (updateContents) falsy contents given in ' + this.get('relpath'))
    }

    return this.updateInMemoryContentState(contents, options, (err) => {
      if (err) return cb(err)
      return this.actualizeContentState(options, cb)
    })
  }

  File.prototype.updateInMemoryContentState = function updateInMemoryContentState (contents, options, cb) {
    logger.info('[file] updating in-memory content state')

    options = assign({}, File.UPDATE_OPTIONS, options)
    this.set('dtModified', Date.now())
    const previous = this.get('contents')
    this.set('previous', previous)

    if (!contents) {
      logger.warn('[file] (updateInMemoryContentState) falsy contents given in ' + this.get('relpath'))
    }

    this.set('contents', contents)
    if (this.isCode() || path.extname(this.get('relpath')) === '.svg') {
      if (!this.get('skipDiffLogging')) {
        var relpath = this.get('relpath')
        // Diffs of 'snapshots' or bundled code are usually fairly useless to show and too long anyway.
        // These files are written as part of the save process
        if (!looksLikeMassiveFile(relpath)) {
          differ.difflog(previous, contents, { relpath: relpath })
        }
      }
    }
    if (this.isCode() && options.shouldReloadCodeStructures) {
      return File.loadCodeStructures(this.get('relpath'), contents, (err, ast, substructs) => {
        if (err) return cb(err)

        this.set('ast', ast)
        this.set('substructs', substructs)

        this.emit('in-memory-content-state-updated')
        return cb()
      })
    }
    this.emit('in-memory-content-state-updated')
    return cb()
  }

  File.prototype.actualizeContentState = function actualizeContentState (options, cb) {
    options = assign({}, File.UPDATE_OPTIONS, options)

    logger.info('[file] actualizing content state (' + options.shouldUpdateFileSystem + ')')

    // Allow the user calling this upstream to specify we want to hit the fs or not
    if (options.shouldUpdateFileSystem) {
      return this.write(cb)
    }
    return cb()
  }

  File.prototype.write = function write (cb) {
    this.set('isWriting', true)
    this.set('dtLastWriteStart', Date.now())
    return File.write(this.get('folder'), this.get('relpath'), this.get('contents'), (err) => {
      this.set('isWriting', false)
      this.set('dtLastWriteEnd', Date.now())
      if (err) return cb(err)
      return cb()
    })
  }

  File.prototype.getAbspath = function getAbspath () {
    return path.join(this.get('folder'), this.get('relpath'))
  }

  File.prototype.isCode = function isCode () {
    return this.get('type') === FILE_TYPES.code
  }

  File.prototype.isDesign = function isDesign () {
    return this.get('type') === FILE_TYPES.design
  }

  // Work Helpers

  File.prototype.performComponentWork = function performComponentWork (worker, finish) {
    try {
      // We shouldn't need to do these 'ensure X Y Z' steps more than once
      if (!this.get('substructInitialized')) {
        this.set('substructInitialized', this.reinitializeSubstruct(null, 'File.prototype.performComponentWork'))
      }

      const substruct = this.get('substructInitialized')
      const mana = substruct.bytecode.template

      return worker(substruct.bytecode, mana, (err, result) => {
        if (err) return finish(err)
        try {
          // Reassign transformed template contents to the template (make object, not string)
          substruct.bytecode.template = mana

          _cleanBytecodeAndTemplate(substruct.bytecode, mana)

          // The steps after this do heavy things like: clean the tree, update the code, mutate the AST...
          // This flag allows these steps to be skipped in perf-critical scenarios, e.g. 'control'
          if (this.get('doShallowWorkOnly')) {
            return finish(null, result, this)
          }

          const ast = this.get('ast')
          if (!ast) return finish(new Error('AST missing'))

          if (this.get('commitImmediate')) {
            return this.commitContentState(substruct, ast, finish)
          } else {
            // By default, early return and do the rest of this heavy stuff in the background
            finish(null, result, this)
            return this.commitContentStateDebounced(substruct, ast, noop)
          }
        } catch (exception) {
          return finish(exception)
        }
      })
    } catch (exception) {
      logger.error('[file] ' + exception)
      return finish(exception)
    }
  }

  /**
   * @method reinitializeSubstruct
   * @description Make sure the in-memory bytecode object has all of the correct settings, attributes, and structure.
   * This ought to get called if the bytecode has just been ingested from somewhere and you need to make sure it is right.
   * The 'via' argument is in place for testing a race condition that is hard to debug via a normal stack trace.
   */
  File.prototype.reinitializeSubstruct = function _reinitializeSubstruct (config, via) {
    if (!config) config = {}

    const substruct = this.get('substructs')[0]

    if (!substruct) {
      logger.info('[file] ' + this.get('relpath') + ' does not have a substruct (' + (via || '?') + ')')
      throw new Error('Substruct missing in ' + this.get('relpath'))
    }

    let mana
    if (typeof substruct.bytecode.template === 'string') {
      mana = xmlToMana(substruct.bytecode.template || FALLBACK_TEMPLATE)
    } else if (typeof substruct.bytecode.template === 'object') {
      mana = substruct.bytecode.template || xmlToMana(FALLBACK_TEMPLATE)
    } else {
      logger.info('[file] unexpected template format in ' + this.get('relpath') + ' . bytecode is:', substruct.bytecode)
      throw new Error('Template format unexpected')
    }

    upgradeBytecodeInPlace(substruct.bytecode)

    // Since we may be appending a child, make sure the children is an array
    if (!Array.isArray(mana.children)) {
      ensureManaChildrenArray(mana)
    }

    // Force a div as the top-level for now...
    if (_safeElementName(mana) === 'svg') {
      if (!mana.attributes) mana.attributes = {}
      _ensureTopLevelDisplayAttributes(mana)

      mana = {
        elementName: 'div',
        attributes: {},
        children: [mana]
      }
    }

    // Hack...but helps avoid issues downstream if the template part of the bytecode was empty
    if (!mana.elementName) mana.elementName = 'div'

    // Ensure the top-level context gets the appropriate display attributes
    _ensureRootDisplayAttributes(mana)

    // Make sure there is at least a baseline metadata objet
    writeMetadata(substruct.bytecode, {
      uuid: 'HAIKU_SHARE_UUID', // This magic string is detected+replaced by our cloud services to produce a full share link
      type: config.type,
      name: config.name,
      relpath: this.get('relpath')
    })

    // Make sure there is an options object (can be used for playback configuration)
    if (!substruct.bytecode.options) {
      substruct.bytecode.options = {}
    }

    // Make sure there is always a timelines object
    if (!substruct.bytecode.timelines) {
      substruct.bytecode.timelines = {}
    }

    // And make sure there is always a default timelines object
    if (!substruct.bytecode.timelines[DEFAULT_TIMELINE_NAME]) {
      substruct.bytecode.timelines[DEFAULT_TIMELINE_NAME] = {}
    }

    // Make sure all elements in the tree have a haiku-id assigned
    // [UIDIFY]
    this.ensureTitleAndUidifyTree(mana, path.normalize(this.get('relpath')), '0', {
      title: config.name // If present, this will force a change to the new title
    })

    convertManaLayout(mana)

    var contextHaikuId = mana.attributes[HAIKU_ID_ATTRIBUTE]

    // Move inline attributes at the top level into the control object
    const timeline = _hoistTreeAttributes(
      mana,
      DEFAULT_TIMELINE_NAME,
      DEFAULT_TIMELINE_TIME
    )

    this.upsertDefaultProperties([contextHaikuId], {
      'style.WebkitTapHighlightColor': 'rgba(0,0,0,0)',
      'style.position': 'relative',
      'style.overflowX': 'hidden',
      'style.overflowY': 'hidden',
      'sizeAbsolute.x': DEFAULT_CONTEXT_SIZE.width,
      'sizeAbsolute.y': DEFAULT_CONTEXT_SIZE.height,
      'sizeMode.x': 1,
      'sizeMode.y': 1,
      'sizeMode.z': 1
    }, 'assign')

    // Inject the hoisted attributes into the actual timelines object
    mergeTimelineStructure(substruct.bytecode, timeline, 'defaults')

    return substruct
  }

  File.prototype.writeMetadata = function (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      writeMetadata(bytecode, metadata)
      done()
    }, cb)
  }

  File.prototype.readMetadata = function () {
    var bytecode = this.getReifiedBytecode()
    return readMetadata(bytecode)
  }

  File.prototype.ensureTitleAndUidifyTree = function (mana, source, hash, options) {
    // The same content when instantiated in a different host folder will result in a different absolute path
    // (here called "context"), which in turn will result in the id generation algorithm, SHA256, generating
    // different base identifiers across different projects despite the same actions.
    const context = path.join(path.normalize(this.get('folder')), path.normalize(this.get('relpath')))

    return _ensureTitleAndUidifyTree(mana, source, context, hash, options)
  }

  // This is only a member of the prototype so we can debug mutations on this specific instance
  File.prototype._mutateComponent = function _mutateComponent (substruct, ast, cb) {
    // Just tracking for debugging purposes
    var mutation = {}
    this._mutations.push(mutation)

    try {
      _synchronizeSubstructAndAST(substruct)

      // remove unreferenced modules
      this._unrefedModules.forEach((mod) => {
        removeRequire(ast, mod[0], mod[1])
      })
      this._unrefedModules = []

      if (process.env.HAIKU_DEBUG_MUTATIONS === '1') {
        fse.outputFileSync(
          path.join(HOMEDIR_LOGS_PATH, 'mutations', `${this.get('relpath').split(/[/.]/).join('_')}-${this._mutations.length}.json`),
          JSON.stringify(ast.program, null, 2)
        )
      }

      let updatedCode = generateCode(ast)

      return formatStandard(updatedCode, {}, (err, formatted) => {
        if (err) return cb(err)

        return cb(null, formatted)
      })
    } catch (exception) {
      mutation.error = exception

      return cb(exception)
    }
  }

  File.prototype.commitContentState = function (substruct, ast, cb) {
    logger.info('[file] committing content state')

    // substruct -> { bytecode: {...}, objectExpression: {...} }
    return this._mutateComponent(substruct, ast, (err, code) => {
      if (err) {
        logger.error('[file] content state commit error', err)
        return cb(err)
      }

      if (!code) {
        logger.warn('[file] commit content state got blank code')
      }

      return this.updateInMemoryContentState(code, { shouldReloadCodeStructures: false }, (err) => {
        if (err) return cb(err)

        if (this.get('skipFileUpdates')) {
          logger.info('[file] commit content state is skipping file updates')
          return cb()
        }

        this.actualizeContentState({}, cb) // debounce?
      })
    })
  }

  File.prototype.commitContentStateDebounced = debounce(File.prototype.commitContentState, 64)

  File.prototype.performComponentTimelinesWork = function performComponentTimelinesWork (worker, finish) {
    return this.performComponentWork((bytecode, mana, done) => {
      if (!bytecode) return done(new Error('Missing bytecode'))
      if (!bytecode.timelines) return done(new Error('Missing timelines'))
      return worker(bytecode, mana, bytecode.timelines, done)
    }, finish)
  }

  /** ------------------ */
  /** ------------------ */
  /** ------------------ */

  File.prototype.instantiateComponent = function instantiateComponent (filepath, metadata, cb) {
    // If the file path looks like a path to a Haiku component, assume a component will be instantiated.
    // Otherwise, fallback to default instantiation of a design asset.
    var ourdir = path.join(this.get('relpath'), 'code', 'main')
    var modulepath = getNormalizedComponentModulePath(filepath, ourdir)

    if (modulepath) {
      return this.instantiateComponentFromModule(modulepath, metadata, cb)
    } else {
      return File.read(this.get('folder'), filepath, (err, buffer) => {
        if (err) return cb(err)
        const contents = buffer.toString()
        const incoming = xmlToMana(contents)

        // #QUESTION - why not just overwrite this?
        if (!incoming.attributes[SOURCE_ATTRIBUTE]) {
          incoming.attributes[SOURCE_ATTRIBUTE] = path.normalize(filepath)
        }

        return this.instantiateComponentFromMana(incoming, metadata, cb)
      })
    }
  }

  /**
   * @method _offsetInstantiateeInTimelineAttributes
   * @description Given an instantiated element, offset its position (translation). Used to instantiate component per the user's placement.
   * Note that the offset is halved by the width of the element so that its apparent instantiation point is the center.
   * @param componentId {String} - Id of component being offset
   * @param incoming {Object} - Mana object being offset
   * @param timelines {Object} - Timelines object
   * @param metadata {Object} - Spec containing offset values like x:0, y:0
   */
  File.prototype._offsetInstantiateeInTimelineAttributes = function _offsetInstantiateeInTimelineAttributes (componentId, incoming, timelines, metadata) {
    const myTimeline = timelines[DEFAULT_TIMELINE_NAME][`haiku:${componentId}`] || {}
    const myWidth = (myTimeline['sizeAbsolute.x'] && myTimeline['sizeAbsolute.x'][DEFAULT_TIMELINE_TIME] && myTimeline['sizeAbsolute.x'][DEFAULT_TIMELINE_TIME].value) || 0
    const myHeight = (myTimeline['sizeAbsolute.y'] && myTimeline['sizeAbsolute.y'][DEFAULT_TIMELINE_TIME] && myTimeline['sizeAbsolute.y'][DEFAULT_TIMELINE_TIME].value) || 0
    if (metadata.x || metadata.y || metadata.minimized) {
      const tx = (metadata.x || 0) - myWidth / 2
      const ty = (metadata.y || 0) - myHeight / 2
      const propertyGroup = { 'translation.x': tx, 'translation.y': ty }
      if (metadata.minimized) {
        // calculate the smallest scale value to make width/height < 1 pixel
        propertyGroup['scale.x'] = 1 / myWidth
        propertyGroup['scale.y'] = 1 / myHeight
      }
      TimelineProperty.addPropertyGroup(timelines, DEFAULT_TIMELINE_NAME, componentId, _safeElementName(incoming), propertyGroup, DEFAULT_TIMELINE_TIME)
    }
  }

  File.prototype.instantiateComponentFromModule = function instantiateComponentFromModule (modulePath, metadata, cb) {
    var identifierName = File.modulePathToIdentifierName(modulePath)
    var freshComponentNode = _importComponentModuleToMana(modulePath, identifierName)

    // If running in glass or timeline, we probably don't have an AST to mutate
    if (this.get('ast')) {
      upsertRequire(this.get('ast'), identifierName, modulePath)
    }

    return this.instantiateComponentFromMana(freshComponentNode, metadata, cb)
  }

  File.prototype.instantiateComponentFromMana = function instantiateComponentFromMana (incoming, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      var insertionPointHash = _getInsertionPointHash(mana, mana.children.length, 0)
      _fixFragmentIdentifierReferences(incoming, insertionPointHash) // Each url(#whatever) needs to be unique to avoid styling collisions
      this.ensureTitleAndUidifyTree(incoming, path.normalize(incoming.attributes[SOURCE_ATTRIBUTE]), insertionPointHash)
      _ensureTopLevelDisplayAttributes(incoming)
      convertManaLayout(incoming)
      mana.children.push(incoming)
      const timelines = _hoistTreeAttributes(incoming, DEFAULT_TIMELINE_NAME, DEFAULT_TIMELINE_TIME)
      const componentId = incoming.attributes[HAIKU_ID_ATTRIBUTE]
      this._offsetInstantiateeInTimelineAttributes(componentId, incoming, timelines, metadata)
      mergeTimelineStructure(bytecode, timelines, 'assign')
      // Move the component to the very front
      return this.zMoveToFront([componentId], DEFAULT_TIMELINE_NAME, DEFAULT_TIMELINE_TIME, (err) => {
        if (err) return done(err)
        return done(null, incoming)
      })
    }, cb)
  }

  File.prototype.deleteComponent = function deleteComponent (componentIds, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      visitManaTree(ROOT_LOCATOR, mana, (elementName, attributes, children, node, locator, parent, index) => {
        if (attributes && attributes[HAIKU_ID_ATTRIBUTE] && componentIds.indexOf(attributes[HAIKU_ID_ATTRIBUTE]) !== -1) {
          if (parent) {
            var child = parent.children[index]
            if (child.elementName.__module) {
              var mod = child.elementName
              this._unrefedModules.push([mod.__reference, mod.__module])
            }

            parent.children.splice(index, 1)
          } else {
            // No parent means we are at the top
            mana.elementName = 'div'
            mana.attributes = {}
            mana.children = []
          }
        }
      })
      done()
    }, cb)
  }

  File.prototype.mergeDesign = function mergeDesign (timelineName, timelineTime, sourceRelpath, cb) {
    let didUpdate = false
    logger.info('[file] maybe merging design ' + sourceRelpath + ' in timeline ' + timelineName + ' @ ' + timelineTime)
    return File.read(this.get('folder'), sourceRelpath, (err, sourceBuffer) => {
      if (err) return cb(err)
      const sourceContents = sourceBuffer.toString()
      return this.performComponentTimelinesWork((bytecode, existingMana, timelines, done) => {
        let oldTimeline = timelines[timelineName]

        // Create this timeline if it doesn't exist yet
        if (!oldTimeline) {
          timelines[timelineName] = {}
          oldTimeline = timelines[timelineName]
        }

        _allSourceNodes(ROOT_LOCATOR, existingMana, (existingNode, nodeSourceRelpath, existingNodeParent, nodeIndexInParent) => {
          // Only replace nodes whose 'source' attribute matches the one we are merging
          if (path.normalize(nodeSourceRelpath) !== path.normalize(sourceRelpath)) return void (0)

          logger.info('[file] found merge root for ' + nodeSourceRelpath)

          let incomingMana = xmlToMana(sourceContents) // Do this here to avoid needing to clone
          if (!incomingMana.attributes[SOURCE_ATTRIBUTE]) {
            incomingMana.attributes[SOURCE_ATTRIBUTE] = path.normalize(sourceRelpath)
          }

          // This is used to ensure that the merge operation is the same across runs. We can't have randomness here due to multithreading
          var insertionPointHash = _getInsertionPointHash(existingNodeParent, nodeIndexInParent, 0)

          // Each url(#whatever) needs to be unique to avoid styling collisions
          _fixFragmentIdentifierReferences(incomingMana, insertionPointHash)

          // Do this every time since any instance will have different uids
          _mirrorHaikuUids(existingNode, incomingMana)

          // Add haiku-ids to any nodes we may have missed due to structural differences
          this.ensureTitleAndUidifyTree(incomingMana, path.normalize(sourceRelpath), insertionPointHash)

          convertManaLayout(incomingMana)

          let newDefaultTimeline = _hoistTreeAttributes(incomingMana, timelineName, timelineTime)[timelineName]

          // Replace the old tree with the new one
          // This ensures we get new structural changes, as well as content changes e.g. strings
          // Note that we have kept any matching haiku-ids from the previous tree so those rules can be retained
          existingNodeParent.children.splice(nodeIndexInParent, 1, incomingMana)

          // Now add any new rules from the new timeline we created, and modify
          // any existing ones that match
          for (let selector in newDefaultTimeline) {
            if (!_isHaikuIdSelector(selector)) continue // We only manage haiku-ids
            if (!oldTimeline[selector]) oldTimeline[selector] = {}
            let newSelectorGroup = newDefaultTimeline[selector]
            for (let newPropertyName in newSelectorGroup) {
              if (!oldTimeline[selector][newPropertyName]) oldTimeline[selector][newPropertyName] = {}
              let newPropertyGroup = newSelectorGroup[newPropertyName]
              let newBasethKeyframe = newPropertyGroup[timelineTime]
              let keyframeWasCreated = false
              if (!oldTimeline[selector][newPropertyName][timelineTime]) {
                // Track whether or not we are creating a value or changing an existing one so we can
                // decide whether to clobber the previous value or leave it alone (see below)
                keyframeWasCreated = true
                oldTimeline[selector][newPropertyName][timelineTime] = {}
              }
              let oldBasethKeyframe = oldTimeline[selector][newPropertyName][timelineTime]
              let newBasethValue = newBasethKeyframe.value
              let oldBasethValue = oldBasethKeyframe.value
              if (newBasethValue !== oldBasethValue) {
                if (keyframeWasCreated) {
                  logger.info('[file] design property created: ' + selector + ' ' + newPropertyName + ' ' + oldBasethValue + ' -> ' + newBasethValue + ' in timeline ' + timelineName + ' @ ' + timelineTime)
                  oldTimeline[selector][newPropertyName][timelineTime].value = newBasethValue
                  didUpdate = true
                } else {
                  if (oldBasethKeyframe.lock || oldBasethKeyframe.edited) {
                    logger.info('[file] skipped design change to edited/locked property ' + newPropertyName + ' in timeline ' + timelineName + ' @ ' + timelineTime)
                  } else {
                    logger.info('[file] design property changed: ' + selector + ' ' + newPropertyName + ' ' + oldBasethValue + ' -> ' + newBasethValue + ' in timeline ' + timelineName + ' @ ' + timelineTime)
                    oldTimeline[selector][newPropertyName][timelineTime].value = newBasethValue
                    didUpdate = true
                  }
                }
              }
            }
          }
        })
        logger.info('[file] did design merge result in updates?: ' + didUpdate)
        return done()
      }, cb)
    })
  }

  File.prototype.applyPropertyValue = function applyPropertyValue (componentIds, timelineName, timelineTime, propertyName, propertyValue, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      componentIds.forEach((componentId) => {
        let elementNode = this.findElementByComponentId(mana, componentId)
        if (elementNode) TimelineProperty.addProperty(timelines, timelineName, componentId, _safeElementName(elementNode), propertyName, timelineTime, propertyValue, null, null, null)
        else (problem = `Cannot locate element with id ${componentId}`)
      })
      if (problem) return done(new Error(problem))
      return done()
    }, cb)
  }

  File.prototype.applyPropertyDelta = function applyPropertyDelta (componentIds, timelineName, timelineTime, propertyName, propertyValue, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      componentIds.forEach((componentId) => {
        let elementNode = this.findElementByComponentId(mana, componentId)
        if (elementNode) TimelineProperty.addPropertyDelta(timelines, timelineName, componentId, _safeElementName(elementNode), propertyName, timelineTime, propertyValue, this.get('hostInstance'), this.get('states'))
        else (problem = `Cannot locate element with id ${componentId}`)
      })
      if (problem) return done(new Error(problem))
      return done()
    }, cb)
  }

  File.prototype.applyPropertyGroupValue = function applyPropertyGroupValue (componentIds, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      componentIds.forEach((componentId) => {
        let elementNode = this.findElementByComponentId(mana, componentId)
        if (elementNode) TimelineProperty.addPropertyGroup(timelines, timelineName, componentId, _safeElementName(elementNode), propertyGroup, timelineTime)
        else (problem = `Cannot locate element with id ${componentId}`)
      })
      if (problem) {
        logger.info(JSON.stringify(mana, null, 2))
        return done(new Error(problem))
      }
      return done()
    }, cb)
  }

  File.prototype.applyPropertyGroupDelta = function applyPropertyGroupDelta (componentIds, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      componentIds.forEach((componentId) => {
        let elementNode = this.findElementByComponentId(mana, componentId)
        if (elementNode) TimelineProperty.addPropertyGroupDelta(timelines, timelineName, componentId, _safeElementName(elementNode), propertyGroup, timelineTime, this.get('hostInstance'), this.get('states'))
        else (problem = `Cannot locate element with id ${componentId}`)
      })
      if (problem) return done(new Error(problem))
      return done()
    }, cb)
  }

  File.prototype.resizeContext = function resizeContext (artboardIds, timelineName, timelineTime, sizeDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      var contextHaikuId = mana.attributes[HAIKU_ID_ATTRIBUTE]
      this.upsertProperties(bytecode, [contextHaikuId], timelineName, timelineTime, {
        'sizeAbsolute.x': sizeDescriptor.width,
        'sizeAbsolute.y': sizeDescriptor.height,
        'sizeMode.x': 1,
        'sizeMode.y': 1,
        'sizeMode.z': 1
      }, 'merge')
      done()
    }, cb)
  }

  File.prototype.changeKeyframeValue = function (componentIds, timelineName, propertyName, keyframeMs, newValue, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.changeKeyframeValue(bytecode, componentId, timelineName, propertyName, keyframeMs, newValue)
      })
      done()
    }, cb)
  }

  File.prototype.changePlaybackSpeed = function (framesPerSecond, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changePlaybackSpeed(bytecode, framesPerSecond)
      done()
    }, cb)
  }

  File.prototype.changeSegmentCurve = function (componentIds, timelineName, propertyName, keyframeMs, newCurve, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.changeSegmentCurve(bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve)
      })
      done()
    }, cb)
  }

  File.prototype.changeSegmentEndpoints = function (componentIds, timelineName, propertyName, oldMs, newMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.changeSegmentEndpoints(bytecode, componentId, timelineName, propertyName, oldMs, newMs)
      })
      done()
    }, cb)
  }

  File.prototype.createKeyframe = function (componentIds, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.createKeyframe(bytecode, componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, this.get('hostInstance'), this.get('states'))
      })
      done()
    }, cb)
  }

  File.prototype.createTimeline = function (timelineName, timelineDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.createTimeline(bytecode, timelineName, timelineDescriptor)
      done()
    }, cb)
  }

  File.prototype.deleteKeyframe = function (componentIds, timelineName, propertyName, keyframeMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.deleteKeyframe(bytecode, componentId, timelineName, propertyName, keyframeMs)
      })
      done()
    }, cb)
  }

  File.prototype.deleteTimeline = function (timelineName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  File.prototype.duplicateTimeline = function (timelineName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.duplicateTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  File.prototype.joinKeyframes = function (componentIds, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.joinKeyframes(bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve)
      })
      done()
    }, cb)
  }

  File.prototype.moveSegmentEndpoints = function (componentIds, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.moveSegmentEndpoints(bytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo)
      })
      done()
    }, cb)
  }

  File.prototype.moveKeyframes = function (componentIds, timelineName, propertyName, keyframeMoves, frameInfo, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.moveKeyframes(bytecode, componentId, timelineName, propertyName, keyframeMoves, frameInfo)
      })
      done()
    }, cb)
  }

  File.prototype.renameTimeline = function (timelineNameOld, timelineNameNew, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.renameTimeline(bytecode, timelineNameOld, timelineNameNew)
      done()
    }, cb)
  }

  File.prototype.sliceSegment = function (componentIds, timelineName, elementName, propertyName, keyframeMs, sliceMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.sliceSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs)
      })
      done()
    }, cb)
  }

  File.prototype.splitSegment = function (componentIds, timelineName, elementName, propertyName, keyframeMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.splitSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs)
      })
      done()
    }, cb)
  }

  File.prototype._normalizeStackingAndReturnInfo = function _normalizeStackingAndReturnInfo (bytecode, mana, timelineName, timelineTime) {
    var stackingInfo = getStackingInfo(bytecode, mana, timelineName, timelineTime)
    stackingInfo.forEach(({ zIndex, haikuId }) => {
      this.upsertProperties(bytecode, [haikuId], timelineName, timelineTime, { 'style.zIndex': zIndex }, 'merge')
    })
    return stackingInfo
  }

  File.prototype.zMoveToFront = function zMoveToFront (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      var stackingInfo = this._normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      componentIds.forEach((componentId) => {
        var highestZ = stackingInfo[stackingInfo.length - 1].zIndex
        var myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        if (myZ < highestZ) {
          this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': highestZ + 1 }, 'merge')
        }
      })
      done()
    }, cb)
  }

  File.prototype.zMoveForward = function zMoveForward (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      componentIds.forEach((componentId) => {
        var myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': myZ + 1 })
      })
      done()
    }, cb)
  }

  File.prototype.zMoveBackward = function zMoveBackward (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      componentIds.forEach((componentId) => {
        var myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': myZ - 1 })
      })
      done()
    }, cb)
  }

  File.prototype.zMoveToBack = function zMoveToBack (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      var stackingInfo = this._normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      componentIds.forEach((componentId) => {
        var lowestZ = stackingInfo[0].zIndex
        var myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        if (myZ <= lowestZ) return void (0)
        // Shift all the z indices upward to make room for this one
        if (lowestZ < 2) {
          var zOffset = 2 - lowestZ
          stackingInfo.forEach(({ haikuId, zIndex }) => {
            var theirHaikuId = haikuId
            var theirZ = zIndex
            var finalZ = theirZ + zOffset
            this.upsertProperties(bytecode, [theirHaikuId], timelineName, timelineTime, { 'style.zIndex': finalZ }, 'merge')
          })
        }
        this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': 1 }, 'merge')
      })
      done()
    }, cb)
  }

  File.prototype.reorderElement = function reorderElement (componentId, componentIdToInsertBefore, cb) {

  }

  File.prototype.groupElements = function groupElements (componentIdsToGroup, cb) {

  }

  File.prototype.ungroupElements = function ungroupElements (groupComponentIds, cb) {

  }

  // Metadata could contain info on whether it is a true hide or only hiding during editing
  File.prototype.hideElements = function hideElements (componentIds, metadata, cb) {

  }

  /**
   * @method pasteThing
   * @description Flexibly paste some content into the component. Usually the thing pasted is going to be a
   * component, but this could theoretically handle any kind of 'pasteable' content.
   * @param pasteable {Object} - Content of the thing to paste into the component.
   * @param request {Object} - Optional object containing information about _how_ to paste, e.g. coords
   */
  File.prototype.pasteThing = function pasteThing (pasteable, request, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      switch (pasteable.kind) {
        case 'element':
          var reified = reifyRO(pasteable.serializedBytecode, null, false)

          // The caller can optionally pass coordinates at which to instantiate; if not, place at (0,0)
          if (!request.x) request.x = 0
          if (!request.y) request.y = 0

          // We need to give the pasted element its own ids, and then copy over new control attributes
          var base = _findElementByComponentId(pasteable.componentId, reified.template)
          var nodes = _getAllElementsByHaikuId(base) // Keep track of the original ids so we can copy over the applied properties later
          var hash = _getInsertionPointHash(mana, mana.children.length, 0)
          this.ensureTitleAndUidifyTree(base, path.normalize(base.attributes[SOURCE_ATTRIBUTE]), hash, { forceAssignId: true })

          return this.instantiateComponentFromMana(base, request, (err) => {
            if (err) return done(err)

            // Now that the element has been pasted into the new tree, with default attributes, we now have to
            // copy over the *modified* control attributes that were present on the original element.
            // First let's create a mapping of the old haiku-id to the new haiku-id we created above.
            var remapping = {}
            for (var old in nodes) {
              var node = nodes[old]
              // The haiku-id attribute should have been mutated in-place by ensureTitleAndUidifyTree
              var upd = node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]
              remapping[_buildHaikuIdSelector(old)] = _buildHaikuIdSelector(upd)
            }

            // Now loop over all the parts of the bytecode that should be copied over to the new element
            // - Event Handlers
            if (reified.eventHandlers) {
              if (!bytecode.eventHandlers) bytecode.eventHandlers = {}
              for (var oldSelector1 in reified.eventHandlers) {
                if (!_isHaikuIdSelector(oldSelector1)) continue // We only manage haiku ids
                var newSelector1 = remapping[oldSelector1]
                if (!newSelector1) continue

                // Add an event handler for the new element, remembering to update its selector
                logger.info('[file] copying event handler from ' + oldSelector1 + ' to ' + newSelector1)
                var eventHandlerGroup = reified.eventHandlers[oldSelector1]
                bytecode.eventHandlers[newSelector1] = eventHandlerGroup
              }
            }

            // Keep track of the id references that we modify in the properties so we can do the same in the tree, below
            var fixedReferences = {}

            // - Timelines
            if (reified.timelines) {
              if (!bytecode.timelines) bytecode.timelines = {}
              for (var timelineName in reified.timelines) {
                var timelineGroup = reified.timelines[timelineName]
                if (!bytecode.timelines[timelineName]) bytecode.timelines[timelineName] = {}
                for (var oldSelector2 in timelineGroup) {
                  if (!_isHaikuIdSelector(oldSelector2)) continue // We only manage haiku ids
                  var newSelector2 = remapping[oldSelector2]
                  if (!newSelector2) continue
                  var timelineProperties = timelineGroup[oldSelector2]

                  // Create a new property set that points to the new id of the pasted element
                  logger.info('[file] copying control object from ' + oldSelector2 + ' to ' + newSelector2)
                  var newProps = {}
                  for (var propKey in timelineProperties) {
                    var propSpec = timelineProperties[propKey]
                    for (var propMs in propSpec) {
                      var propKeyframe = propSpec[propMs]
                      var propValue = propKeyframe.value

                      // If any kind of internal reference, e.g. xlink:href is detected, this function is going
                      // to replace it with a predictably randomized version so we don't collide with other references
                      // in copies of this tree that may have been instantiated
                      var fixedValueSpec = _fixFragmentIdentifierReferenceValue(propKey, propValue, hash)
                      if (fixedValueSpec !== undefined) {
                        fixedReferences[fixedValueSpec.originalId] = fixedValueSpec.updatedId
                        propKeyframe.value = fixedValueSpec.updatedValue
                      }

                      if (!newProps[propKey]) newProps[propKey] = {}
                      if (!newProps[propKey][propMs]) {
                        newProps[propKey][propMs] = propKeyframe
                      }
                    }
                  }

                  bytecode.timelines[timelineName][newSelector2] = newProps
                }
              }
            }

            // Convert all id attributes to the ones we changed in the properties
            _fixTreeIdReferences(base, fixedReferences)

            // Although the instantiateComponentFromMana method already did the offset, we ended up
            // overwriting the translation when we copied the component data over, so we have to re-set
            // the correct offset here again. #FIXME
            let componentId = base.attributes[HAIKU_ID_ATTRIBUTE]
            this._offsetInstantiateeInTimelineAttributes(componentId, base, bytecode.timelines, request)

            return done()
          })
        default:
          logger.warn('[file] cannot paste clipboard contents of kind ' + pasteable.kind)
          return done(new Error('Unable to paste clipboard contents'))
      }
    }, cb)
  }

  /**
   * @method deleteThing
   * @description Flexibly delete some content from the component. Usually the thing deleted is going to be a
   * component, but this could theoretically handle any kind of 'deleteable' content.
   * @param deleteable {Object} - Content of the thing to delete into the component.
   */
  File.prototype.deleteThing = function deleteThing (deletable, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      // TODO
      done()
    }, cb)
  }

  File.prototype.readAllStateValues = function readAllStateValues (cb) {
    var bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllStateValues(bytecode))
  }

  File.prototype.upsertStateValue = function upsertStateValue (stateName, stateDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertStateValue(bytecode, stateName, stateDescriptor)
      done()
    }, cb)
  }

  File.prototype.deleteStateValue = function deleteStateValue (stateName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteStateValue(bytecode, stateName)
      done()
    }, cb)
  }

  File.prototype.readAllEventHandlers = function readAllEventHandlers (cb) {
    var bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllEventHandlers(bytecode))
  }

  File.prototype.upsertEventHandler = function upsertEventHandler (selectorName, eventName, handlerDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertEventHandler(bytecode, selectorName, eventName, handlerDescriptor)
      done()
    }, cb)
  }

  File.prototype.deleteEventHandler = function deleteEventHandler (selectorName, eventName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteEventHandler(bytecode, selectorName, eventName)
      done()
    }, cb)
  }

  /** ------------- */
  /** ------------- */
  /** ------------- */

  File.prototype.findElementByComponentId = function findElementByComponentId (mana, componentId) {
    if (!this._elementsCache) this._elementsCache = {}
    if (this._elementsCache[componentId]) return this._elementsCache[componentId]
    var nodes = _manaTreeToDepthFirstArray([], mana)
    var found = nodes.filter((node) => node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE] === componentId)[0]
    if (!found) return null
    this._elementsCache[componentId] = found
    return this._elementsCache[componentId]
  }

  File.prototype.upsertDefaultProperties = function upsertDefaultProperties (componentIds, propertiesToMerge, strategy) {
    componentIds.forEach((componentId) => {
      if (!strategy) strategy = 'merge'
      var haikuSelector = `haiku:${componentId}`
      var bytecode = this.getReifiedBytecode()
      if (!bytecode.timelines.Default[haikuSelector]) bytecode.timelines.Default[haikuSelector] = {}
      var defaultTimeline = bytecode.timelines.Default[haikuSelector]
      for (var propName in propertiesToMerge) {
        if (!defaultTimeline[propName]) defaultTimeline[propName] = {}
        if (!defaultTimeline[propName][DEFAULT_TIMELINE_TIME]) defaultTimeline[propName][DEFAULT_TIMELINE_TIME] = {}
        switch (strategy) {
          case 'merge':
            defaultTimeline[propName][DEFAULT_TIMELINE_TIME].value = propertiesToMerge[propName]
            break
          case 'assign':
            if (defaultTimeline[propName][DEFAULT_TIMELINE_TIME].value === undefined) defaultTimeline[propName][DEFAULT_TIMELINE_TIME].value = propertiesToMerge[propName]
            break
        }
      }
    })
  }

  File.prototype.upsertProperties = function upsertProperties (bytecode, componentIds, timelineName, timelineTime, propertiesToMerge, strategy) {
    componentIds.forEach((componentId) => {
      upsertPropertyValue(bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy)
    })
  }

  File.prototype.getContextSize = function getContextSize (timelineName, timelineTime) {
    var bytecode = this.getReifiedBytecode()
    if (!bytecode || !bytecode.template || !bytecode.template.attributes) return null
    var contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]
    if (!contextHaikuId) return null
    var contextElementName = _safeElementName(bytecode.template)
    if (!contextElementName) return null
    var contextWidth = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.x', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, this.get('hostInstance'), this.get('states'))
    var contextHeight = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.y', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, this.get('hostInstance'), this.get('states'))
    return {
      width: contextWidth,
      height: contextHeight
    }
  }

  File.prototype.getDeclaredPropertyValue = function getDeclaredPropertyValue (componentId, timelineName, timelineTime, propertyName) {
    var bytecode = this.getReifiedBytecode()
    return getPropertyValue(bytecode, componentId, timelineName, timelineTime, propertyName)
  }

  File.prototype.getComputedPropertyValue = function getComputedPropertyValue (template, componentId, timelineName, timelineTime, propertyName, fallbackValue) {
    var bytecode = this.getReifiedBytecode()
    var element = _findElementByComponentId(componentId, template)
    return TimelineProperty.getComputedValue(componentId, _safeElementName(element), propertyName, timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, fallbackValue, bytecode, this.get('hostInstance'), this.get('states'))
  }

  /**
   * @method getReifiedBytecode
   * @description Return the reified form of the bytecode, that is, with actual functions, references,
   * and instances present as they would be if it were being executed in memory.
   */
  File.prototype.getReifiedBytecode = function getReifiedBytecode () {
    // NOTE: Due to a legacy issue there used to be the assumption that the bytecode file could contain
    // multiple bytecodes, hence the [0]; that is no longer the case and this should be refactored! #FIXME
    return this.get('substructs')[0].bytecode
  }

  /**
   * @method getReifiedDecycledBytecode
   * @description Similar to getReifiedBytecode but removes internal object pointers/annotations which either cause
   * serialization issues or which have the effect of adding too much metadata to the object. For example, the
   * reified bytecode by itself probably has a template that contains .__depth, .__parent, .layout properties, etc.
   */
  File.prototype.getReifiedDecycledBytecode = function getReifiedDecycledBytecode () {
    var reified = this.getReifiedBytecode()
    var decycled = {}
    if (reified.metadata) decycled.metadata = reified.metadata
    if (reified.options) decycled.options = reified.options
    if (reified.config) decycled.config = reified.config
    if (reified.settings) decycled.settings = reified.settings
    if (reified.properties) decycled.properties = reified.properties
    if (reified.states) decycled.states = reified.states
    if (reified.eventHandlers) decycled.eventHandlers = reified.eventHandlers
    if (reified.timelines) decycled.timelines = reified.timelines
    if (reified.template) decycled.template = cleanMana(reified.template)
    return decycled
  }

  /**
   * @method getSerializedBytecode
   * @description Return the serialized form of the bytecode, that is, with all of its contents converted
   * into a form that can be safely transmitted over the wire. Functions get converted to function specifications,
   * identifiers are replaced with identifier descriptors, etc.
   * Note that this returns a new object; it doesn't serialize the bytecode in place. I.e., you can't
   * mutate the returned object and expect that to affect the live in-memory bytecode, nor the file system.
   */
  File.prototype.getSerializedBytecode = function getSerializedBytecode () {
    var reified = this.getReifiedDecycledBytecode()
    var serialized = objectToRO(reified) // This returns a *new* object
    return serialized
  }

  /**
   * @method read
   * @description Reads a file's filesystem contents into memory. Useful if you have a reference but need its content.
   */
  File.prototype.read = function read (cb) {
    return File.ingestOne(this.get('folder'), this.get('relpath'), (err) => {
      if (err) return cb(err)

      // If this happens to be bytecode, make sure we get the correct things set up right off the bat
      // This might be a race condition #RC
      this.set('substructInitialized', this.reinitializeSubstruct(null, 'File.prototype.read'))

      return cb(null, this)
    })
  }

  // Class Methods

  File.awaitUnlock = function awaitUnlock (abspath, cb) {
    return setTimeout(() => {
      // Continue waiting if the file is still flagged as being written
      if (File.lockees[abspath]) {
        return File.awaitUnlock(abspath, cb)
      }
      return cb()
    }, 64)
  }

  File.write = function write (folder, relpath, contents, cb) {
    var abspath = path.join(folder, relpath)
    return File.awaitUnlock(abspath, () => {
      File.lockees[abspath] = true
      return _writeFile(abspath, contents, (err) => {
        File.lockees[abspath] = false
        if (err) return cb(err)
        return cb()
      })
    })
  }

  File.read = function read (folder, relpath, cb) {
    var abspath = path.join(folder, relpath)
    return File.awaitUnlock(abspath, () => {
      File.lockees[abspath] = true
      return _readFile(abspath, (err, buffer) => {
        File.lockees[abspath] = false
        if (err) return cb(err)
        return cb(null, buffer.toString())
      })
    })
  }

  File.isPathCode = function isPathCode (relpath) {
    return _isFileCode(relpath)
  }

  File.loadCodeStructures = function loadCodeStructures (relpath, contents, cb) {
    return _parseFile(relpath, contents, (err, ast) => {
      if (err) return cb(err)
      return _extractSubstructs(ast, relpath, (err, substructs) => {
        if (err) return cb(err)
        return cb(null, ast, substructs)
      })
    })
  }

  File.findFile = function findFile (givenRelpath) {
    const relpath = path.normalize(givenRelpath)
    const foundFile = File.firstSync({ relpath })
    return foundFile
  }

  File.ingestOne = function ingestOne (folder, relpath, cb) {
    // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
    // Track it here so we get an accurate picture of when the ingestion routine actually began, including before
    // we actually talked to the real filesystem, which can take some time
    var dtLastReadStart = Date.now()

    return File.read(folder, relpath, (err, contents) => {
      if (err) return cb(err)

      // Note: The only properties that should be in the object at this point should be relpath and folder,
      // otherwise the upsert won't work correctly since it uses these props as a comparison
      const fileAttrs = { relpath, folder }

      logger.info('[file] file was read:', relpath, contents && contents.length)

      return File.findOrCreate(fileAttrs, (err, file) => {
        if (err) return cb(err)

        // Set this down here because see above ^^
        file.set('dtLastReadStart', dtLastReadStart)

        logger.info('[file] file was upserted:', relpath)

        if (File.isPathCode(relpath)) {
          file.set('type', FILE_TYPES.code)
        } else {
          file.set('type', 'other')
        }

        return file.updateContents(contents, { shouldUpdateFileSystem: false }, (err) => {
          if (err) return cb(err)

          // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
          // Useful when trying to detect e.g. whether code should reload
          file.set('dtLastReadEnd', Date.now())

          return cb(null, file)
        })
      })
    })
  }

  File.expelOne = function expelOne (relpath, cb) {
    return File.destroyWhere({ relpath }, cb)
  }

  File.ingestFromFolder = function ingestFromFolder (folder, options, cb) {
    function isExcluded (relpath) {
      if (!options) return false
      if (!options.exclude) return false
      return options.exclude(relpath)
    }
    return walkFiles(folder, (err, entries) => {
      if (err) return cb(err)
      const picks = []
      entries.forEach((entry) => {
        const relpath = path.relative(folder, entry.path)
        // Don't ingest massive bundle files that have no business being in memory
        // Also skip any files that match any exclude patterns passed in with the options
        if (!looksLikeMassiveFile(relpath) && !isExcluded(relpath)) {
          return picks.push(entry)
        }
      })
      // Load the code first, then designs. This is so we can merge design changes!
      return async.mapSeries(picks, (entry, next) => {
        const relpath = path.relative(folder, entry.path)
        return File.ingestOne(folder, relpath, next)
      }, (err, files) => {
        if (err) return cb(err)
        return cb(null, files)
      })
    })
  }

  /**
   * @function modulePathToIdentifierName
   * @description Convert a module path into an identifier name (variable name) for the module.
   */
  File.modulePathToIdentifierName = function modulePathToIdentifierName (modulepath) {
    var parts = modulepath.split(path.sep)
    // We can assume we have a *normalized* module path name at this point, e.g...
    // Haiku builtin format: @haiku/player/components/Path/code/main/code
    if (parts[0] === '@haiku' && parts[1] === 'player') {
      return 'Haiku' + parts[3] // e.g. HaikuPath, HaikuLine, etc.
    }
    // Installed Haiku format: @haiku/MyTeam/MyComponent/code/main/code
    // MyTeam_MyComponent
    return parts[1] + '_' + parts[2]
  }

  return File
}

FileModel.astmod = function astmod (abspath, fn) {
  try {
    var str = fse.readFileSync(abspath).toString()
    var ast = parseCode(str)
    fn(ast)
    var code = generateCode(ast)
    var formatted = prettier.format(code)
    fse.outputFileSync(abspath, formatted)
    return void (0)
  } catch (exception) {
    console.warn('[file] Could not provide AST for ' + abspath + '; ' + exception)
    return void (0)
  }
}

function _isFileCode (relpath) {
  return path.extname(relpath) === '.js'
}

function _readFile (abspath, cb) {
  return fse.readFile(abspath, cb)
}

function _parseFile (abspath, contents, cb) {
  var ast = parseCode(contents)
  if (ast instanceof Error) return cb(ast)
  else return cb(null, ast)
}

function _writeFile (abspath, contents, cb) {
  return fse.outputFile(abspath, contents, cb)
}

function _extractSubstructs (ast, relpath, cb) {
  let substructs
  try {
    substructs = _findSubstructs(ast, relpath)
  } catch (exception) {
    return cb(exception)
  }
  return cb(null, substructs)
}

function _makeSubstruct (objectExpression) {
  return {
    objectExpression,
    aspects: {},
    template: null,
    bytecode: {}
  }
}

function _findSubstructs (ast, relpath) {
  var builtSubstructs = []
  var imports = {}

  traverseAST(ast, function _visitor (node) {
    var foundSubstruct

    if (node.type === 'AssignmentExpression') {
      // module.exports = {BYTECODE}
      if (node.left && node.left.type === 'MemberExpression') {
        if (node.left.object.name === 'module' && node.left.property.name === 'exports') {
          if (node.right && node.right.type === 'ObjectExpression') {
            foundSubstruct = _makeSubstruct(node.right)
          }
        }
      } else if (node.left && node.left.type === 'Identifier') {
        // exports = {BYTECODE}
        if (node.left.name === 'exports') {
          if (node.right && node.right.type === 'ObjectExpression') {
            foundSubstruct = _makeSubstruct(node.right)
          }
        }
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      // export default {BYTECODE}
      if (node.declaration.type === 'ObjectExpression') {
        foundSubstruct = _makeSubstruct(node.declaration)
      }
    } else if (node.type === 'VariableDeclaration') {
      // var Ident = require('module')
      if (node.declarations.length === 1) {
        var decl = node.declarations[0]
        if (decl.id.type === 'Identifier' && decl.init &&
            decl.init.type === 'CallExpression' && decl.init.callee.name === 'require') {
          var filepath = decl.init.arguments[0].value
          var modulepath = getNormalizedComponentModulePath(filepath, relpath)
          if (modulepath) {
            imports[decl.id.name] = modulepath
          }
        }
      }
    }

    // TODO: JSON/YAML/XML files?

    if (foundSubstruct) {
      builtSubstructs.push(foundSubstruct)

      for (var i = 0; i < foundSubstruct.objectExpression.properties.length; i++) {
        var property = foundSubstruct.objectExpression.properties[i]
        var key = getObjectPropertyKey(property)
        if ((key in Aspects)) {
          foundSubstruct.aspects[key] = property.value
        } else if (key === TEMPLATE_KEY_NAME) {
          foundSubstruct.template = property.value
        }
      }
    }
  })

  // The 'substruct' should constitute the equivalent of what the bytecode would look
  // like when loaded by the player, so we need to make sure functions get reified too
  var skipFunctionReification = false
  var refEvaluator = (identifierName) => {
    if (identifierName in imports) {
      return _importComponentModuleToMana(imports[identifierName], identifierName).elementName
    }
  }

  for (var k = 0; k < builtSubstructs.length; k++) {
    var builtNode = builtSubstructs[k]
    for (var aspectName in builtNode.aspects) {
      var aspectNode = builtNode.aspects[aspectName]
      builtNode.bytecode[aspectName] = reifyOAST(aspectNode, refEvaluator, skipFunctionReification)
    }
    if (builtNode.template) {
      builtNode.bytecode.template = reifyOAST(builtNode.template, refEvaluator, skipFunctionReification)
    }
  }

  return builtSubstructs
}

function _allSourceNodes (rootLocator, mana, iteratee) {
  visitManaTree(rootLocator, mana, (elementName, attributes, children, node, locator, parent, index) => {
    if (attributes && attributes[SOURCE_ATTRIBUTE]) {
      iteratee(node, attributes[SOURCE_ATTRIBUTE], parent, index)
    }
  })
}

function _synchronizeSubstructAndAST (substruct) {
  for (var aspectName in substruct.bytecode) {
    var aspectValue = substruct.bytecode[aspectName]
    var didInsert = false
    for (var i = 0; i < substruct.objectExpression.properties.length; i++) {
      if (didInsert) continue
      var propertyASTNode = substruct.objectExpression.properties[i]
      var propertyASTNodeKey = getObjectPropertyKey(propertyASTNode)
      if (propertyASTNodeKey === aspectName) {
        didInsert = true
        propertyASTNode.value = expressionToOASTComponent(aspectValue, aspectName)
      }
    }
    // If a property with the desired name wasn't there, add it
    // I have no idea why this logic is written in this way...
    if (!didInsert) {
      substruct.objectExpression.properties.unshift({
        type: 'ObjectProperty',
        key: expressionToOASTComponent(aspectName),
        value: expressionToOASTComponent(aspectValue)
      })
    }
  }
}

/**
 * @function _ensureTitleAndUidifyTree
 * @param mana {Object} - A mana tree
 * @param source {String} - Relpath to the source file of this tree (usually an SVG file)
 * @param context {String} - Flexible context string for collision avoidance (usually folder + relpath)
 * @param hash {String} - Digest of previous content, used as a seed for number generation
 * @param options {Object}
 */
function _ensureTitleAndUidifyTree (mana, source, context, hash, options) {
  if (!options) options = {}

  // First ensure the element has a title (this is used to display a human-friendly name in the ui)
  if (!mana.attributes) mana.attributes = {}
  if (options.title) {
    mana.attributes[HAIKU_TITLE_ATTRIBUTE] = options.title
  }
  if (!mana.attributes[HAIKU_TITLE_ATTRIBUTE]) {
    let title
    if (mana.attributes.source) {
      // The file name usually works as a good baseline, e.g. 'FooBar.svg'
      title = path.basename(mana.attributes.source, path.extname(mana.attributes.source))
    }
    if (!title) {
      if (mana.children) {
        // Sketch-sourced trees always have a title matching that artboard/slice's name
        const el = find(mana.children, { elementName: 'title' })
        if (el && el.children && typeof el.children[0] === 'string') {
          title = el.children[0]
        }
      }
    }
    if (!title) {
      if (source && source.length > 1) {
        // The passed in source relpath should work ok
        title = path.basename(source, path.extname(source))
        title = title.replace('Bytecode', '') // Clean up the name if this is a bytecode-source doc
      }
    }
    if (!title) {
      // Otherwise, fall back to the element name
      title = pascalcase(_safeElementName(mana) || 'node')
    }
    mana.attributes[HAIKU_TITLE_ATTRIBUTE] = title
  }

  // Now make sure all elements in the tree get a preditable identifier assigned. It is critical that
  // the UID generation be based on the existing tree's contents so that this same logic can run
  // in different processes and still give us an identical result, otherwise they will get out of sync
  _visitManaTreeSpecial('*', hash, mana, (node, fqa) => {
    if (typeof node !== 'object') return void (0)
    if (!node.attributes) node.attributes = {}

    // For cases like pasting a component, the caller might want to assign a fresh id even though
    // we may already have one assigned to the node, hence the forceAssignId option
    if (!node.attributes[HAIKU_ID_ATTRIBUTE] || options.forceAssignId) {
      let haikuId = _createHaikuId(fqa, source, context)
      logger.info('[file] fqa: ' + fqa + ' -> ' + haikuId)
      node.attributes[HAIKU_ID_ATTRIBUTE] = haikuId
    }

    if (node.attributes.id && options.idRandomizer) {
      node.attributes.id += ('-' + options.idRandomizer)
    }
  })
}

function _manaWithOnlyStandardProps (mana) {
  if (mana && typeof mana === 'object') {
    var out = {}
    out.elementName = mana.elementName
    if (typeof mana.elementName === 'object') {
      out.elementName = {
        __module: mana.attributes.source
      }
    }

    if (mana.attributes) {
      out.attributes = {}
      out.attributes.source = mana.attributes.source
      out.attributes[HAIKU_ID_ATTRIBUTE] = mana.attributes[HAIKU_ID_ATTRIBUTE]
      out.attributes[HAIKU_TITLE_ATTRIBUTE] = mana.attributes[HAIKU_TITLE_ATTRIBUTE]
    }
    out.children = mana.children && mana.children.map(_manaWithOnlyStandardProps)
    return out
  } else if (typeof mana === 'string') {
    return mana
  }
}

function _getInsertionPointHash (mana, index, depth) {
  var str = JSON.stringify(_manaWithOnlyStandardProps(mana)) + '-' + index + '-' + depth
  var hash = CryptoUtils.sha256(str).slice(0, 6)
  return hash
}

function _visitManaTreeSpecial (address, hash, mana, iteratee) {
  address += `:[${hash}]${_safeElementName(mana)}(${(mana.attributes && mana.attributes.id) ? '#' + mana.attributes.id : ''})`
  iteratee(mana, address)
  if (!mana.children || mana.children.length < 1) return void (0)
  for (let i = 0; i < mana.children.length; i++) {
    let child = mana.children[i]
    if (child && typeof child === 'object') {
      _visitManaTreeSpecial(address, hash + '-' + i, child, iteratee)
    }
  }
}

function _manaTreeToDepthFirstArray (arr, mana) {
  if (!mana || typeof mana === 'string') return arr
  arr.push(mana)
  for (var i = 0; i < mana.children.length; i++) {
    var child = mana.children[i]
    _manaTreeToDepthFirstArray(arr, child)
  }
  return arr
}

// function _manaTreeToBreadthFirstArray (arr, kids) {
//   if (kids.length < 1) return arr
//   var queue = []
//   for (var i = 0; i < kids.length; i++) {
//     var kid = kids[i]
//     if (!kid || typeof kid === 'string') continue
//     arr.push(kid)
//     if (kid.children) {
//       for (var j = 0; j < kid.children.length; j++) {
//         queue.push(kid.children[j])
//       }
//     }
//   }
//   return _manaTreeToBreadthFirstArray(arr, queue)
// }

function _createHaikuId (fqa, source, context) {
  const baseString = `${context}|${source}|${fqa}`
  const haikuId = CryptoUtils.sha256(baseString).slice(0, 12)
  return haikuId
}

function _hoistNodeAttributes (manaNode, haikuId, timelineObj, timelineName, timelineTime, mergeStrategy) {
  var controlAttributes = getControlAttributes(manaNode.attributes)

  // TODO: Use this to populate any default attributes we want to be written into
  // the file explicitly
  var defaultAttributes = {}

  // Don't create any empty groups
  if (Object.keys(defaultAttributes).length > 0 || Object.keys(controlAttributes).length > 0) {
    var haikuIdSelector = _buildHaikuIdSelector(haikuId)
    if (!timelineObj[haikuIdSelector]) timelineObj[haikuIdSelector] = {}
    var timelineGroup = timelineObj[haikuIdSelector]

    insertAttributesIntoTimelineGroup(timelineGroup, timelineTime, defaultAttributes, mergeStrategy)
    insertAttributesIntoTimelineGroup(timelineGroup, timelineTime, controlAttributes, mergeStrategy)
  }

  // Clear off attributes that have been 'hoisted' into the control objects
  for (var attrKey in manaNode.attributes) {
    if (attrKey in controlAttributes) delete manaNode.attributes[attrKey]
  }
}

/**
 * @function _hoistTreeAttributes
 * @description Given a mana tree, move all of its control attributes (that is, things that affect its
 * behavior that the user can control) into a timeline object.
 */
function _hoistTreeAttributes (mana, timelineName, timelineTime) {
  var elementsByHaikuId = _getAllElementsByHaikuId(mana)
  var timelineStructure = {}

  // We set this on the 'Default' timeline always because an element's properties
  // are interpreted to mean whatever the defaults are supposed to be at time 0.
  timelineStructure[timelineName] = {}
  var theTimelineObj = timelineStructure[timelineName]

  for (let haikuId in elementsByHaikuId) {
    let node = elementsByHaikuId[haikuId]
    _hoistNodeAttributes(node, haikuId, theTimelineObj, timelineName, timelineTime, 'assign')
  }

  return timelineStructure
}

function _findElementByComponentId (componentId, mana) {
  var elementsById = _getAllElementsByHaikuId(mana)
  return elementsById[componentId]
}

function _getAllElementsByHaikuId (mana) {
  var elements = {}
  visitManaTree(ROOT_LOCATOR, mana, function (elementName, attributes, children, node) {
    if (attributes && attributes[HAIKU_ID_ATTRIBUTE]) {
      elements[attributes[HAIKU_ID_ATTRIBUTE]] = node
    }
  })
  return elements
}

function _buildHaikuIdSelector (haikuId) {
  return `${HAIKU_SELECTOR_PREFIX}:${haikuId}`
}

function _isHaikuIdSelector (selector) {
  return selector && selector.slice(0, 5) === HAIKU_SELECTOR_PREFIX && selector[5] === ':'
}

function _haikuSelectorToHaikuId (selector) {
  return selector.split(':')[1]
}

function _cleanBytecodeAndTemplate (bytecode, mana) {
  const elementsByHaikuId = {}

  visitManaTree(ROOT_LOCATOR, mana, function (elementName, attributes, children, node) {
    if (attributes && attributes[HAIKU_ID_ATTRIBUTE]) {
      elementsByHaikuId[attributes[HAIKU_ID_ATTRIBUTE]] = node
    }

    // Clean these in-memory only properties that get added (don't want to write these to the file)
    delete node.__depth
    delete node.__index
  })

  for (var timelineName in bytecode.timelines) {
    var timelineObject = bytecode.timelines[timelineName]
    for (var timelineSelector in timelineObject) {
      if (_isHaikuIdSelector(timelineSelector)) {
        let hid = _haikuSelectorToHaikuId(timelineSelector)
        if (!elementsByHaikuId[hid]) delete timelineObject[timelineSelector]
      }
    }
  }

  if (bytecode.eventHandlers) {
    for (var eventSelector in bytecode.eventHandlers) {
      if (_isHaikuIdSelector(eventSelector)) {
        let hid = _haikuSelectorToHaikuId(eventSelector)
        if (!elementsByHaikuId[hid]) {
          delete bytecode.eventHandlers[eventSelector]
        }
      }
    }
  }
}

/**
 * @function _fixFragmentIdentifierReferenceValue
 * @description Given a key, value, and some randomization, determine whether the given key/value attribute pair
 * warrants replacing with a randomized value, and if so, return a specification object of what to change
 * @param key {String} - The name of the attribute
 * @param value {String} - The value of the attribute
 * @param randomizer {String} - Seeded randomization string to use to modify the ids
 * @returns {Object|undefined}
 */
function _fixFragmentIdentifierReferenceValue (key, value, randomizer) {
  if (typeof value !== 'string') return undefined

  var trimmed = value.trim()

  // Probably nothing to do if we got an empty string
  if (trimmed.length < 1) return undefined

  // If this is a URL reference like `url(...)`, try to parse it and return a fix payload if so
  var urlId = extractReferenceIdFromUrlReference(trimmed)
  if (urlId && urlId.length > 0) {
    return {
      originalId: urlId,
      updatedId: urlId + '-' + randomizer,
      updatedValue: 'url(#' + urlId + '-' + randomizer + ')'
    }
  }

  // xlink:hrefs are references to elements in the tree that can affect our style
  if (key === 'xlink:href') {
    if (trimmed[0] === '#') {
      var xlinkId = trimmed.slice(1)
      return {
        originalId: xlinkId,
        updatedId: xlinkId + '-' + randomizer,
        updatedValue: '#' + xlinkId + '-' + randomizer
      }
    }
  }

  // If we go this far, we haven't detected anything we need to fix
  return undefined
}

/**
 * @function _fixTreeIdReferences
 * @description Fixes all id attributes in the tree that have an entry in the given references table.
 * This is used to predictably convert all ids in a tree into a known set of randomized ids
 * @param mana {Object} - Mana tree object
 * @param references {Object} - Dict that maps old ids to new ids
 * @return {Object} The mutated mana object
 */
function _fixTreeIdReferences (mana, references) {
  if (Object.keys(references).length < 1) return mana
  visitManaTree(ROOT_LOCATOR, mana, function _visitor2 (elementName, attributes, children, node) {
    if (!attributes) return void (0)
    for (var id in references) {
      var fixed = references[id]
      if (attributes.id === id) {
        attributes.id = fixed
      }
    }
  })
  return mana
}

// TODO - This only works on attributes whose form is url(#...), e.g. Sketch outputs.
//        But SVG fragment identifiers can be a lot more complex than that.
//
function _fixFragmentIdentifierReferences (mana, randomizer) {
  var references = {}
  visitManaTree(ROOT_LOCATOR, mana, function _visitor1 (elementName, attributes, children, node) {
    if (!attributes) return void (0)
    for (var key in attributes) {
      var value = attributes[key]

      // Add randomization to any url() or xlink:href etc to avoid collisions
      // If this function returns undefined it means there's nothing to change
      var fix = _fixFragmentIdentifierReferenceValue(key, value, randomizer)
      if (fix === undefined) continue

      references[fix.originalId] = fix.updatedId
      attributes[key] = fix.updatedValue
    }
  })
  _fixTreeIdReferences(mana, references)
  return mana
}

function _ensureRootDisplayAttributes (mana) {
  merge(mana.attributes, {
    style: {
      position: 'relative',
      width: '550px', // default artboard size, see haiku-creator
      height: '400px', // default artboard size, see haiku-creator
      margin: '0',
      padding: '0',
      border: '0'
    }
  })

  // If our context is SVG, ensure it has appropriate SVG attributes
  if (_safeElementName(mana) === 'svg') {
    merge(mana.attributes, {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    })
  }
}

function _ensureTopLevelDisplayAttributes (mana) {
  merge(mana.attributes, {
    style: {
      position: 'absolute',
      margin: '0',
      padding: '0',
      border: '0'
    }
  })

  // If our context is SVG, ensure it has appropriate SVG attributes
  if (_safeElementName(mana) === 'svg') {
    merge(mana.attributes, {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    })
  }
}

// function _mergeBytecodeInPlace (prev, incoming) {
//   // TODO: For now, just update the timelines object fully
//   prev.timelines = incoming.timelines
// }

// function _replaceArrayInPlace (old, young) {
//   old.splice.apply(old, [0, young.length].concat(young))
// }

function _mirrorHaikuUids (fromNode, toNode) {
  if (!toNode.attributes) toNode.attributes = {}
  // Create (or overwrite) a haiku-id matching the existing tree's node
  toNode.attributes[HAIKU_ID_ATTRIBUTE] = fromNode.attributes[HAIKU_ID_ATTRIBUTE]
  if (!fromNode.children || fromNode.children.length < 1) return void (0)
  if (!toNode.children || toNode.children.length < 1) return void (0)
  // Different number of kids indicates structural change; impossible to do a consistent mirror
  if (fromNode.children.length !== toNode.children.length) return void (0)
  for (var i = 0; i < fromNode.children.length; i++) {
    var fromNodeChild = fromNode.children[i]
    var toNodeChild = toNode.children[i]
    // String children don't have attributes
    if (typeof fromNodeChild === 'string') continue
    // Different element name indicates structural change; impossible to do a consistent mirror
    if (fromNodeChild.elementName !== toNodeChild.elementName) continue
    _mirrorHaikuUids(fromNodeChild, toNodeChild) // Recursive
  }
}

// If elementName is bytecode (i.e. a nested component) return a fallback name
// used for a bunch of lookups, otherwise return the given string element name
function _safeElementName (mana) {
  // If bytecode, the fallback name is div
  if (mana.elementName && typeof mana.elementName === 'object') {
    return 'div' // TODO: How will this byte us?
  }
  return mana.elementName
}

function _importComponentModuleToMana (modulePath, identifierName) {
  return overrideModulesLoaded((stop) => {
    var componentModule
    try {
      componentModule = require(modulePath)
      stop()
    } catch (exception) {
      console.warn('[file] Module ' + modulePath + ' could not be loaded (' + exception + ')')
      return null // What should we do if we can't load the module?
    }

    componentModule.__module = modulePath
    componentModule.__reference = identifierName

    return {
      elementName: componentModule,
      attributes: { source: modulePath, 'haiku-title': identifierName },
      children: []
    }
  }, getHaikuKnownImportMatch)
}

module.exports = FileModel
