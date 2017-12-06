const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const assign = require('lodash.assign')
const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default
const xmlToMana = require('@haiku/player/lib/helpers/xmlToMana').default
const convertManaLayout = require('@haiku/player/lib/layout/convertManaLayout').default
const objectToRO = require('@haiku/player/lib/reflection/objectToRO').default
const reifyRO = require('@haiku/player/lib/reflection/reifyRO').default
const upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default
const ensureManaChildrenArray = require('haiku-bytecode/src/ensureManaChildrenArray')
const mergeTimelineStructure = require('haiku-bytecode/src/mergeTimelineStructure')
const cleanMana = require('haiku-bytecode/src/cleanMana')
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const BytecodeActions = require('haiku-bytecode/src/actions')
const getPropertyValue = require('haiku-bytecode/src/getPropertyValue')
const upsertPropertyValue = require('haiku-bytecode/src/upsertPropertyValue')
const getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
const readMetadata = require('haiku-bytecode/src/readMetadata')
const writeMetadata = require('haiku-bytecode/src/writeMetadata')
const prettier = require('prettier')
const BaseModel = require('./BaseModel')
const getNormalizedComponentModulePath = require('./helpers/getNormalizedComponentModulePath')
const _allSourceNodes = require('./helpers/allSourceNodes')
const _buildHaikuIdSelector = require('./helpers/buildHaikuIdSelector')
const _cleanBytecodeAndTemplate = require('./helpers/cleanBytecodeAndTemplate')
const _ensureRootDisplayAttributes = require('./helpers/ensureRootDisplayAttributes')
const _ensureTitleAndUidifyTree = require('./helpers/ensureTitleAndUidifyTree')
const _ensureTopLevelDisplayAttributes = require('./helpers/ensureTopLevelDisplayAttributes')
const _extractSubstructs = require('./helpers/extractSubstructs')
const _fixFragmentIdentifierReferences = require('./helpers/fixFragmentIdentifierReferences')
const _fixFragmentIdentifierReferenceValue = require('./helpers/fixFragmentIdentifierReferenceValue')
const _fixTreeIdReferences = require('./helpers/fixTreeIdReferences')
const _getAllElementsByHaikuId = require('./helpers/getAllElementsByHaikuId')
const _getInsertionPointHash = require('./helpers/getInsertionPointHash')
const _hoistTreeAttributes = require('./helpers/hoistTreeAttributes')
const _importComponentModuleToMana = require('./helpers/importComponentModuleToMana')
const _isHaikuIdSelector = require('./helpers/isHaikuIdSelector')
const _manaTreeToDepthFirstArray = require('./helpers/manaTreeToDepthFirstArray')
const _mirrorHaikuIds = require('./helpers/mirrorHaikuIds')
const _safeElementName = require('./helpers/safeElementName')
const _synchronizeSubstructAndAST = require('./helpers/synchronizeSubstructAndAST')
const upsertRequire = require('./../ast/upsertRequire')
const removeRequire = require('./../ast/removeRequire')
const formatStandard = require('./../formatter/formatStandard')
const generateCode = require('./../ast/generateCode')
const parseCode = require('./../ast/parseCode')
const getSvgOptimizer = require('../svg/getSvgOptimizer')
const Logger = require('./../utils/Logger')
const walkFiles = require('./../utils/walkFiles')

// This file also depends on '@haiku/player/lib/HaikuComponent'
// in the sense that one of those instances is assigned as .hostInstance here.
// ^^ Leave this message in this file so we can grep for it if necessary

const logger = new Logger()
const differ = require('./../utils/LoggerInstanceDiffs')

const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0
const DEFAULT_ROOT_NODE_NAME = 'div'
const FALLBACK_TEMPLATE = '<' + DEFAULT_ROOT_NODE_NAME + '></' + DEFAULT_ROOT_NODE_NAME + '>'
const SOURCE_ATTRIBUTE = 'source'
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const ROOT_LOCATOR = '0' // e.g. the locator of the root node in a mana tree
const DEFAULT_CONTEXT_SIZE = { width: 550, height: 400 }

const FILE_TYPES = {
  design: 'design',
  code: 'code'
}

class File extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    if (!this.substructs) {
      this.substructs = []
    }

    // Keep track of components that have been removed,
    // so when we mutate the ast we can clean up imports
    this._unrefedModules = []

    this._elementsCache = {}
  }

  updateContents (contents, options, cb) {
    options = assign({}, File.UPDATE_OPTIONS, options)

    if (!contents) {
      logger.warn('[file] (updateContents) falsy contents given in ' + this.relpath)
    }

    return this.updateInMemoryContentState(contents, options, (err) => {
      if (err) return cb(err)
      return this.actualizeContentState(options, contents, cb)
    })
  }

  updateInMemoryContentState (contents, options, cb) {
    logger.info('[file] updating in-memory content state')

    options = assign({}, File.UPDATE_OPTIONS, options)

    this.dtModified = Date.now()

    const previous = this.contents
    this.previous = previous

    if (!contents) {
      logger.warn('[file] (updateInMemoryContentState) falsy contents given in ' + this.relpath)
    }

    this.contents = contents

    if (this.isCode() || path.extname(this.relpath) === '.svg') {
      if (!this.skipDiffLogging) {
        const relpath = this.relpath
        // Diffs of 'snapshots' or bundled code are usually fairly useless to show and too long anyway.
        // These files are written as part of the save process
        if (!_looksLikeMassiveFile(relpath)) {
          differ.difflog(previous, contents, { relpath: relpath })
        }
      }
    }

    if (this.isCode() && options.shouldReloadCodeStructures) {
      return File.loadCodeStructures(this.relpath, contents, (err, ast, substructs) => {
        if (err) return cb(err)

        this.ast = ast
        this.substructs = substructs

        this.emit('in-memory-content-state-updated')
        return cb()
      })
    }

    this.emit('in-memory-content-state-updated')
    return cb()
  }

  actualizeContentState (options, resultOfPreviousOperation, cb) {
    options = assign({}, File.UPDATE_OPTIONS, options)

    logger.info('[file] actualizing content state (' + options.shouldUpdateFileSystem + ')')

    // Allow the user calling this upstream to specify we want to hit the fs or not
    if (options.shouldUpdateFileSystem) {
      return this.write((err) => {
        if (err) return cb(err)
        return cb(null, resultOfPreviousOperation)
      })
    }

    return cb(null, resultOfPreviousOperation)
  }

  write (cb) {
    this.isWriting = true
    this.dtLastWriteStart = Date.now()

    return File.write(this.folder, this.relpath, this.contents, (err) => {
      this.isWriting = false
      this.dtLastWriteEnd = Date.now()

      if (err) return cb(err)
      return cb()
    })
  }

  getAbspath () {
    return path.join(this.folder, this.relpath)
  }

  isCode () {
    return this.type === FILE_TYPES.code
  }

  isDesign () {
    return this.type === FILE_TYPES.design
  }

  performComponentWork (worker, finish) {
    try {
      // We shouldn't need to do these 'ensure X Y Z' steps more than once
      if (!this.substructInitialized) {
        this.substructInitialized = this.reinitializeSubstruct(null, 'performComponentWork')
      }

      return worker(this.substructInitialized.bytecode, this.substructInitialized.bytecode.template, (err, result) => {
        if (err) return finish(err)
        try {
          _cleanBytecodeAndTemplate(this.substructInitialized.bytecode, this.substructInitialized.bytecode.template)

          // The steps after this do heavy things like: clean the tree, update the code, mutate the AST...
          // This flag allows these steps to be skipped in perf-critical scenarios, e.g. 'control'
          if (this.doShallowWorkOnly) {
            return finish(null, result, this)
          }

          if (!this.ast) {
            return finish(new Error('AST missing'))
          }

          return this.commitContentState(this.substructInitialized, this.ast, result, finish)
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
  reinitializeSubstruct (config, via) {
    if (!config) config = {}

    const substruct = this.substructs[0]

    if (!substruct) {
      logger.info('[file] ' + this.relpath + ' does not have a substruct (' + (via || '?') + ')')
      throw new Error('Substruct missing in ' + this.relpath)
    }

    let mana
    if (typeof substruct.bytecode.template === 'string') {
      mana = xmlToMana(substruct.bytecode.template || FALLBACK_TEMPLATE)
    } else if (typeof substruct.bytecode.template === 'object') {
      mana = substruct.bytecode.template || xmlToMana(FALLBACK_TEMPLATE)
    } else {
      logger.info('[file] unexpected template format in ' + this.relpath + ' . bytecode is:', substruct.bytecode)
      throw new Error('Template format unexpected')
    }

    substruct.bytecode.template = mana

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
      relpath: this.relpath
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
    this.ensureTitleAndUidifyTree(mana, path.normalize(this.relpath), '0', {
      title: config.name // If present, this will force a change to the new title
    })

    convertManaLayout(mana)

    let contextHaikuId = mana.attributes[HAIKU_ID_ATTRIBUTE]

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

  writeMetadata (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      writeMetadata(bytecode, metadata)
      done()
    }, cb)
  }

  readMetadata () {
    let bytecode = this.getReifiedBytecode()
    return readMetadata(bytecode)
  }

  ensureTitleAndUidifyTree (mana, source, hash, options) {
    // The same content when instantiated in a different host folder will result in a different absolute path
    // (here called "context"), which in turn will result in the id generation algorithm, SHA256, generating
    // different base identifiers across different projects despite the same actions.
    const context = path.join(path.normalize(this.folder), path.normalize(this.relpath))

    return _ensureTitleAndUidifyTree(mana, source, context, hash, options)
  }

  _mutateComponent (substruct, ast, cb) {
    try {
      _synchronizeSubstructAndAST(substruct)

      // remove unreferenced modules
      this._unrefedModules.forEach((mod) => {
        removeRequire(ast, mod[0], mod[1])
      })
      this._unrefedModules = []

      let updatedCode = generateCode(ast)

      return formatStandard(updatedCode, {}, (err, formatted) => {
        if (err) return cb(err)

        return cb(null, formatted)
      })
    } catch (exception) {
      return cb(exception)
    }
  }

  commitContentState (substruct, ast, resultOfPreviousOperation, cb) {
    logger.info('[file] committing content state')

    // substruct -> { bytecode: {...}, objectExpression: {...} }
    // This also runs formatStandard on the code
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

        this.actualizeContentState({}, resultOfPreviousOperation, cb)
      })
    })
  }

  performComponentTimelinesWork (worker, finish) {
    return this.performComponentWork((bytecode, mana, done) => {
      if (!bytecode) return done(new Error('Missing bytecode'))
      if (!bytecode.timelines) return done(new Error('Missing timelines'))
      return worker(bytecode, mana, bytecode.timelines, done)
    }, finish)
  }

  /** ------------------ */
  /** ------------------ */
  /** ------------------ */

  getHostInstance () {
    return this.hostInstance
  }

  getHostStates () {
    return this.getHostInstance().getStates()
  }

  instantiateComponent (filepath, metadata, cb) {
    // If the file path looks like a path to a Haiku component, assume a component will be instantiated.
    // Otherwise, fallback to default instantiation of a design asset.
    let ourdir = path.join(this.relpath, 'code', 'main')
    let modulepath = getNormalizedComponentModulePath(filepath, ourdir)

    if (modulepath) {
      return this.instantiateComponentFromModule(modulepath, metadata, cb)
    } else {
      return File.read(this.folder, filepath, (err, buffer) => {
        if (err) return cb(err)
        getSvgOptimizer().optimize(buffer.toString(), {path: filepath}).then((contents) => {
          const incoming = xmlToMana(contents.data)

          if (!incoming.attributes) {
            incoming.attributes = {}
          }

          // #QUESTION - why not just overwrite this?
          if (!incoming.attributes[SOURCE_ATTRIBUTE]) {
            incoming.attributes[SOURCE_ATTRIBUTE] = path.normalize(filepath)
          }

          return this.instantiateComponentFromMana(incoming, metadata, cb)
        })
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
  _offsetInstantiateeInTimelineAttributes (componentId, incoming, timelines, metadata) {
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

  instantiateComponentFromModule (modulePath, metadata, cb) {
    let identifierName = File.modulePathToIdentifierName(modulePath)
    let freshComponentNode = _importComponentModuleToMana(modulePath, identifierName)

    // If running in glass or timeline, we probably don't have an AST to mutate
    if (this.ast) {
      upsertRequire(this.ast, identifierName, modulePath)
    }

    return this.instantiateComponentFromMana(freshComponentNode, metadata, cb)
  }

  instantiateComponentFromMana (incoming, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      let insertionPointHash = _getInsertionPointHash(mana, mana.children.length, 0)
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

  deleteComponent (componentIds, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      visitManaTree(ROOT_LOCATOR, mana, (elementName, attributes, children, node, locator, parent, index) => {
        if (attributes && attributes[HAIKU_ID_ATTRIBUTE] && componentIds.indexOf(attributes[HAIKU_ID_ATTRIBUTE]) !== -1) {
          if (parent) {
            let child = parent.children[index]
            if (child.elementName.__module) {
              let mod = child.elementName
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

  mergeDesigns (timelineName, timelineTime, designs, cb) {
    return this.performComponentTimelinesWork((bytecode, existingMana, timelines, done) => {
      return async.eachOf(designs, (truthy, sourceRelpath, next) => {
        return this.mergeDesign(timelineName, timelineTime, sourceRelpath, bytecode, existingMana, timelines, next)
      }, done)
    }, cb)
  }

  // This is normally called in a loop from the above mergeDesigns
  mergeDesign (timelineName, timelineTime, sourceRelpath, bytecode, existingMana, timelines, cb) {
    let didUpdate = false

    logger.info('[file] maybe merging design ' + sourceRelpath + ' in timeline ' + timelineName + ' @ ' + timelineTime)

    return File.read(this.folder, sourceRelpath, (err, sourceBuffer) => {
      if (err) return cb(err)

      const sourceContents = sourceBuffer.toString()

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
        if (!incomingMana.attributes) {
          incomingMana.attributes = {}
        }
        if (!incomingMana.attributes[SOURCE_ATTRIBUTE]) {
          incomingMana.attributes[SOURCE_ATTRIBUTE] = path.normalize(sourceRelpath)
        }

        // This is used to ensure that the merge operation is the same across runs. We can't have randomness here due to multithreading
        let insertionPointHash = _getInsertionPointHash(existingNodeParent, nodeIndexInParent, 0)

        // Each url(#whatever) needs to be unique to avoid styling collisions
        _fixFragmentIdentifierReferences(incomingMana, insertionPointHash)

        // Do this every time since any instance will have different uids
        _mirrorHaikuIds(existingNode, incomingMana)

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
      return cb()
    })
  }

  applyPropertyValue (componentIds, timelineName, timelineTime, propertyName, propertyValue, cb) {
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

  applyPropertyDelta (componentIds, timelineName, timelineTime, propertyName, propertyValue, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      componentIds.forEach((componentId) => {
        let elementNode = this.findElementByComponentId(mana, componentId)
        if (elementNode) TimelineProperty.addPropertyDelta(timelines, timelineName, componentId, _safeElementName(elementNode), propertyName, timelineTime, propertyValue, this.getHostInstance(), this.getHostStates())
        else (problem = `Cannot locate element with id ${componentId}`)
      })
      if (problem) return done(new Error(problem))
      return done()
    }, cb)
  }

  applyPropertyGroupValue (componentIds, timelineName, timelineTime, propertyGroup, cb) {
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

  applyPropertyGroupDelta (componentIds, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      componentIds.forEach((componentId) => {
        let elementNode = this.findElementByComponentId(mana, componentId)
        if (elementNode) {
          TimelineProperty.addPropertyGroupDelta(timelines, timelineName, componentId, _safeElementName(elementNode), propertyGroup, timelineTime, this.getHostInstance(), this.getHostStates())
        } else {
          problem = `Cannot locate element with id ${componentId}`
        }
      })
      if (problem) return done(new Error(problem))
      return done()
    }, cb)
  }

  resizeContext (artboardIds, timelineName, timelineTime, sizeDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      let contextHaikuId = mana.attributes[HAIKU_ID_ATTRIBUTE]
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

  changeKeyframeValue (componentIds, timelineName, propertyName, keyframeMs, newValue, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.changeKeyframeValue(bytecode, componentId, timelineName, propertyName, keyframeMs, newValue)
      })
      done()
    }, cb)
  }

  changePlaybackSpeed (framesPerSecond, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changePlaybackSpeed(bytecode, framesPerSecond)
      done()
    }, cb)
  }

  changeSegmentCurve (componentIds, timelineName, propertyName, keyframeMs, newCurve, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.changeSegmentCurve(bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve)
      })
      done()
    }, cb)
  }

  changeSegmentEndpoints (componentIds, timelineName, propertyName, oldMs, newMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.changeSegmentEndpoints(bytecode, componentId, timelineName, propertyName, oldMs, newMs)
      })
      done()
    }, cb)
  }

  createKeyframe (componentIds, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.createKeyframe(bytecode, componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, this.getHostInstance(), this.getHostStates())
      })
      done()
    }, cb)
  }

  createTimeline (timelineName, timelineDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.createTimeline(bytecode, timelineName, timelineDescriptor)
      done()
    }, cb)
  }

  deleteKeyframe (componentIds, timelineName, propertyName, keyframeMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.deleteKeyframe(bytecode, componentId, timelineName, propertyName, keyframeMs)
      })
      done()
    }, cb)
  }

  deleteTimeline (timelineName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  duplicateTimeline (timelineName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.duplicateTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  joinKeyframes (componentIds, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.joinKeyframes(bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve)
      })
      done()
    }, cb)
  }

  moveSegmentEndpoints (componentIds, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.moveSegmentEndpoints(bytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo)
      })
      done()
    }, cb)
  }

  moveKeyframes (componentIds, timelineName, propertyName, keyframeMoves, frameInfo, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.moveKeyframes(bytecode, componentId, timelineName, propertyName, keyframeMoves, frameInfo)
      })
      done()
    }, cb)
  }

  renameTimeline (timelineNameOld, timelineNameNew, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.renameTimeline(bytecode, timelineNameOld, timelineNameNew)
      done()
    }, cb)
  }

  sliceSegment (componentIds, timelineName, elementName, propertyName, keyframeMs, sliceMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.sliceSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs)
      })
      done()
    }, cb)
  }

  splitSegment (componentIds, timelineName, elementName, propertyName, keyframeMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      componentIds.forEach((componentId) => {
        BytecodeActions.splitSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs)
      })
      done()
    }, cb)
  }

  _normalizeStackingAndReturnInfo (bytecode, mana, timelineName, timelineTime) {
    let stackingInfo = getStackingInfo(bytecode, mana, timelineName, timelineTime)
    stackingInfo.forEach(({ zIndex, haikuId }) => {
      this.upsertProperties(bytecode, [haikuId], timelineName, timelineTime, { 'style.zIndex': zIndex }, 'merge')
    })
    return stackingInfo
  }

  zMoveToFront (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let stackingInfo = this._normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      componentIds.forEach((componentId) => {
        let highestZ = stackingInfo[stackingInfo.length - 1].zIndex
        let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        if (myZ < highestZ) {
          this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': highestZ + 1 }, 'merge')
        }
      })
      done()
    }, cb)
  }

  zMoveForward (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      componentIds.forEach((componentId) => {
        let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': myZ + 1 })
      })
      done()
    }, cb)
  }

  zMoveBackward (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      componentIds.forEach((componentId) => {
        let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': myZ - 1 })
      })
      done()
    }, cb)
  }

  zMoveToBack (componentIds, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let stackingInfo = this._normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      componentIds.forEach((componentId) => {
        let lowestZ = stackingInfo[0].zIndex
        let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
        if (myZ <= lowestZ) return void (0)
        // Shift all the z indices upward to make room for this one
        if (lowestZ < 2) {
          let zOffset = 2 - lowestZ
          stackingInfo.forEach(({ haikuId, zIndex }) => {
            let theirHaikuId = haikuId
            let theirZ = zIndex
            let finalZ = theirZ + zOffset
            this.upsertProperties(bytecode, [theirHaikuId], timelineName, timelineTime, { 'style.zIndex': finalZ }, 'merge')
          })
        }
        this.upsertProperties(bytecode, [componentId], timelineName, timelineTime, { 'style.zIndex': 1 }, 'merge')
      })
      done()
    }, cb)
  }

  reorderElement (componentId, componentIdToInsertBefore, cb) {

  }

  groupElements (componentIdsToGroup, cb) {

  }

  ungroupElements (groupComponentIds, cb) {

  }

  // Metadata could contain info on whether it is a true hide or only hiding during editing
  hideElements (componentIds, metadata, cb) {

  }

  /**
   * @method pasteThing
   * @description Flexibly paste some content into the component. Usually the thing pasted is going to be a
   * component, but this could theoretically handle any kind of 'pasteable' content.
   * @param pasteable {Object} - Content of the thing to paste into the component.
   * @param request {Object} - Optional object containing information about _how_ to paste, e.g. coords
   */
  pasteThing (pasteable, request, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      switch (pasteable.kind) {
        case 'element':
          let reified = reifyRO(pasteable.serializedBytecode, null, false)

          // The caller can optionally pass coordinates at which to instantiate; if not, place at (0,0)
          if (!request.x) request.x = 0
          if (!request.y) request.y = 0

          // We need to give the pasted element its own ids, and then copy over new control attributes
          let base = _findElementByComponentId(pasteable.componentId, reified.template)
          let nodes = _getAllElementsByHaikuId(base) // Keep track of the original ids so we can copy over the applied properties later
          let hash = _getInsertionPointHash(mana, mana.children.length, 0)

          this.ensureTitleAndUidifyTree(base, path.normalize(base.attributes[SOURCE_ATTRIBUTE]), hash, { forceAssignId: true })

          return this.instantiateComponentFromMana(base, request, (err) => {
            if (err) return done(err)

            // Now that the element has been pasted into the new tree, with default attributes, we now have to
            // copy over the *modified* control attributes that were present on the original element.
            // First let's create a mapping of the old haiku-id to the new haiku-id we created above.
            let remapping = {}
            for (let old in nodes) {
              let node = nodes[old]
              // The haiku-id attribute should have been mutated in-place by ensureTitleAndUidifyTree
              let upd = node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]
              remapping[_buildHaikuIdSelector(old)] = _buildHaikuIdSelector(upd)
            }

            // Now loop over all the parts of the bytecode that should be copied over to the new element
            // - Event Handlers
            if (reified.eventHandlers) {
              if (!bytecode.eventHandlers) bytecode.eventHandlers = {}
              for (let oldSelector1 in reified.eventHandlers) {
                if (!_isHaikuIdSelector(oldSelector1)) continue // We only manage haiku ids
                let newSelector1 = remapping[oldSelector1]
                if (!newSelector1) continue

                // Add an event handler for the new element, remembering to update its selector
                logger.info('[file] copying event handler from ' + oldSelector1 + ' to ' + newSelector1)
                let eventHandlerGroup = reified.eventHandlers[oldSelector1]
                bytecode.eventHandlers[newSelector1] = eventHandlerGroup
              }
            }

            // Keep track of the id references that we modify in the properties so we can do the same in the tree, below
            let fixedReferences = {}

            // - Timelines
            if (reified.timelines) {
              if (!bytecode.timelines) bytecode.timelines = {}
              for (let timelineName in reified.timelines) {
                let timelineGroup = reified.timelines[timelineName]
                if (!bytecode.timelines[timelineName]) bytecode.timelines[timelineName] = {}
                for (let oldSelector2 in timelineGroup) {
                  if (!_isHaikuIdSelector(oldSelector2)) continue // We only manage haiku ids

                  let newSelector2 = remapping[oldSelector2]
                  if (!newSelector2) continue
                  let timelineProperties = timelineGroup[oldSelector2]

                  // Create a new property set that points to the new id of the pasted element

                  logger.info('[file] copying control object from ' + oldSelector2 + ' to ' + newSelector2)
                  let newProps = {}
                  for (let propKey in timelineProperties) {
                    let propSpec = timelineProperties[propKey]
                    for (let propMs in propSpec) {
                      let propKeyframe = propSpec[propMs]
                      let propValue = propKeyframe.value

                      // If any kind of internal reference, e.g. xlink:href is detected, this function is going
                      // to replace it with a predictably randomized version so we don't collide with other references
                      // in copies of this tree that may have been instantiated
                      let fixedValueSpec = _fixFragmentIdentifierReferenceValue(propKey, propValue, hash)
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
  deleteThing (deletable, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      // TODO
      done()
    }, cb)
  }

  readAllStateValues (cb) {
    let bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllStateValues(bytecode))
  }

  upsertStateValue (stateName, stateDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertStateValue(bytecode, stateName, stateDescriptor)
      done()
    }, cb)
  }

  deleteStateValue (stateName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteStateValue(bytecode, stateName)
      done()
    }, cb)
  }

  readAllEventHandlers (cb) {
    let bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllEventHandlers(bytecode))
  }

  upsertEventHandler (selectorName, eventName, handlerDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertEventHandler(bytecode, selectorName, eventName, handlerDescriptor)
      done()
    }, cb)
  }

  batchUpsertEventHandlers (selectorName, serializedEvents, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.batchUpsertEventHandlers(bytecode, selectorName, serializedEvents)
      done()
    }, cb)
  }

  deleteEventHandler (selectorName, eventName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteEventHandler(bytecode, selectorName, eventName)
      done()
    }, cb)
  }

  /** ------------- */
  /** ------------- */
  /** ------------- */

  findElementByComponentId (mana, componentId) {
    if (this._elementsCache[componentId]) return this._elementsCache[componentId]
    let nodes = _manaTreeToDepthFirstArray([], mana)
    let found = nodes.filter((node) => node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE] === componentId)[0]
    if (!found) return null
    this._elementsCache[componentId] = found
    return this._elementsCache[componentId]
  }

  upsertDefaultProperties (componentIds, propertiesToMerge, strategy) {
    componentIds.forEach((componentId) => {
      if (!strategy) strategy = 'merge'
      let haikuSelector = `haiku:${componentId}`
      let bytecode = this.getReifiedBytecode()
      if (!bytecode.timelines.Default[haikuSelector]) bytecode.timelines.Default[haikuSelector] = {}
      let defaultTimeline = bytecode.timelines.Default[haikuSelector]
      for (let propName in propertiesToMerge) {
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

  upsertProperties (bytecode, componentIds, timelineName, timelineTime, propertiesToMerge, strategy) {
    componentIds.forEach((componentId) => {
      upsertPropertyValue(bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy)
    })
  }

  getContextSize (timelineName, timelineTime) {
    let bytecode = this.getReifiedBytecode()
    if (!bytecode || !bytecode.template || !bytecode.template.attributes) return null
    let contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]
    if (!contextHaikuId) return null
    let contextElementName = _safeElementName(bytecode.template)
    if (!contextElementName) return null
    let contextWidth = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.x', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, this.getHostInstance(), this.getHostStates())
    let contextHeight = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.y', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, this.getHostInstance(), this.getHostStates())
    return {
      width: contextWidth,
      height: contextHeight
    }
  }

  getDeclaredPropertyValue (componentId, timelineName, timelineTime, propertyName) {
    let bytecode = this.getReifiedBytecode()
    return getPropertyValue(bytecode, componentId, timelineName, timelineTime, propertyName)
  }

  getComputedPropertyValue (template, componentId, timelineName, timelineTime, propertyName, fallbackValue) {
    let bytecode = this.getReifiedBytecode()
    let element = _findElementByComponentId(componentId, template)
    return TimelineProperty.getComputedValue(componentId, _safeElementName(element), propertyName, timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, fallbackValue, bytecode, this.getHostInstance(), this.getHostStates())
  }

  /**
   * @method getReifiedBytecode
   * @description Return the reified form of the bytecode, that is, with actual functions, references,
   * and instances present as they would be if it were being executed in memory.
   */
  getReifiedBytecode () {
    // NOTE: Due to a legacy issue there used to be the assumption that the bytecode file could contain
    // multiple bytecodes, hence the [0]; that is no longer the case and this should be refactored! #FIXME
    return this.substructs[0].bytecode
  }

  /**
   * @method getReifiedDecycledBytecode
   * @description Similar to getReifiedBytecode but removes internal object pointers/annotations which either cause
   * serialization issues or which have the effect of adding too much metadata to the object. For example, the
   * reified bytecode by itself probably has a template that contains .__depth, .__parent, .layout properties, etc.
   */
  getReifiedDecycledBytecode () {
    let reified = this.getReifiedBytecode()
    let decycled = {}
    if (reified.metadata) decycled.metadata = reified.metadata
    if (reified.options) decycled.options = reified.options
    if (reified.config) decycled.config = reified.config
    if (reified.settings) decycled.settings = reified.settings
    if (reified.properties) decycled.properties = reified.properties
    if (reified.states) decycled.states = reified.states

    // At runtime we wrap the original event handler in a wrapper function, and store
    // the original on the 'original' property, so when serializing we need to grab the original
    if (reified.eventHandlers) {
      decycled.eventHandlers = {}
      for (const componentId in reified.eventHandlers) {
        decycled.eventHandlers[componentId] = {}
        for (const eventListenerName in reified.eventHandlers[componentId]) {
          decycled.eventHandlers[componentId][eventListenerName] = {
            handler: reified.eventHandlers[componentId][eventListenerName].original
          }
        }
      }
    }

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
  getSerializedBytecode () {
    let reified = this.getReifiedDecycledBytecode()
    let serialized = objectToRO(reified) // This returns a *new* object
    return serialized
  }

  /**
   * @method read
   * @description Reads a file's filesystem contents into memory. Useful if you have a reference but need its content.
   */
  read (cb) {
    return File.ingestOne(this.folder, this.relpath, (err) => {
      if (err) return cb(err)

      // If this happens to be bytecode, make sure we get the correct things set up right off the bat
      // This might be a race condition #RC
      this.substructInitialized = this.reinitializeSubstruct(null, 'read')

      return cb(null, this)
    })
  }
}

File.DEFAULT_OPTIONS = {
  required: {
    relpath: true,
    folder: true
  }
}

BaseModel.extend(File)

File.TYPES = FILE_TYPES

File.UPDATE_OPTIONS = {
  shouldUpdateFileSystem: true,
  shouldReloadCodeStructures: true
}

File.DEFAULT_CONTEXT_SIZE = DEFAULT_CONTEXT_SIZE

// Dictionary of files currently in the process of being read/written.
// Used as a kind of mutex where reading-while-writing causes a problem.
File.lockees = {}

File.awaitUnlock = function awaitUnlock (abspath, cb) {
  return setTimeout(() => {
    // Continue waiting if the file is still flagged as being written
    if (File.lockees[abspath]) {
      return File.awaitUnlock(abspath, cb)
    }
    return cb()
  }, 0)
}

File.write = function write (folder, relpath, contents, cb) {
  let abspath = path.join(folder, relpath)
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
  let abspath = path.join(folder, relpath)
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
  const foundFile = File.findById(relpath)
  return foundFile
}

File.ingestOne = function ingestOne (folder, relpath, cb) {
  // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
  // Track it here so we get an accurate picture of when the ingestion routine actually began, including before
  // we actually talked to the real filesystem, which can take some time
  let dtLastReadStart = Date.now()

  return File.read(folder, relpath, (err, contents) => {
    if (err) return cb(err)

    // Note: The only properties that should be in the object at this point should be relpath and folder,
    // otherwise the upsert won't work correctly since it uses these props as a comparison
    const fileAttrs = {
      uid: path.join(folder, relpath),
      relpath,
      folder
    }

    logger.info('[file] file was read:', relpath, contents && contents.length)

    const file = File.upsert(fileAttrs)

    // Set this down here because see above ^^
    file.dtLastReadStart = dtLastReadStart

    logger.info('[file] file was upserted:', relpath)

    if (File.isPathCode(relpath)) {
      file.type = FILE_TYPES.code
    } else {
      file.type = 'other'
    }

    return file.updateContents(contents, { shouldUpdateFileSystem: false }, (err) => {
      if (err) return cb(err)

      // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
      // Useful when trying to detect e.g. whether code should reload
      file.dtLastReadEnd = Date.now()

      return cb(null, file)
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
      if (!_looksLikeMassiveFile(relpath) && !isExcluded(relpath)) {
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
 * @description Convert a module path into an identifier name for the module.
 */
File.modulePathToIdentifierName = function modulePathToIdentifierName (modulepath) {
  let parts = modulepath.split(path.sep)
  // We can assume we have a *normalized* module path name at this point, e.g...
  // Haiku builtin format: @haiku/player/components/Path/code/main/code
  if (parts[0] === '@haiku' && parts[1] === 'player') {
    return 'Haiku' + parts[3] // e.g. HaikuPath, HaikuLine, etc.
  }
  // Installed Haiku format: @haiku/MyTeam/MyComponent/code/main/code
  // MyTeam_MyComponent
  return parts[1] + '_' + parts[2]
}

File.astmod = function astmod (abspath, fn) {
  try {
    let str = fse.readFileSync(abspath).toString()
    let ast = parseCode(str)
    fn(ast)
    let code = generateCode(ast)
    let formatted = prettier.format(code)
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
  let ast = parseCode(contents)
  if (ast instanceof Error) return cb(ast)
  else return cb(null, ast)
}

function _writeFile (abspath, contents, cb) {
  return fse.outputFile(abspath, contents, cb)
}

function _findElementByComponentId (componentId, mana) {
  let elementsById = _getAllElementsByHaikuId(mana)
  return elementsById[componentId]
}

function _looksLikeMassiveFile (relpath) {
  return relpath.match(/\.(standalone|bundle|embed)\.(js|html)$/)
}

module.exports = File
