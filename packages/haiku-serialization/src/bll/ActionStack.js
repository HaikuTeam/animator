const lodash = require('lodash')

const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')

const BaseModel = require('./BaseModel')
const Lock = require('./Lock')
const logger = require('./../utils/LoggerInstance')

// No-op callback for arbitrary fire-and-forget actions
const TIMER_TIMEOUT = 64
const PROPERTY_GROUP_ACCUMULATION_TIME = 500
const MAX_UNDOABLES_LEN = 50

// Undoables that always require a full bytecode snapshot to be undone.
const SNAPSHOTTED_UNDOABLES = {
  groupElements: true,
  ungroupElements: true,
  popBytecodeSnapshot: true,
  updateKeyframesAndTypes: true
}

const ACCUMULATORS = {
  updateKeyframes: (params, match) => {
    const updates1 = match.params[2]
    const updates2 = params[2]

    for (const timelineName in updates2) {
      if (!updates1[timelineName]) updates1[timelineName] = {}
      for (const componentId in updates2[timelineName]) {
        if (!updates1[timelineName][componentId]) updates1[timelineName][componentId] = {}
        for (const propertyName in updates2[timelineName][componentId]) {
          if (!updates1[timelineName][componentId][propertyName]) updates1[timelineName][componentId][propertyName] = {}
          for (const keyframeMs in updates2[timelineName][componentId][propertyName]) {
            updates1[timelineName][componentId][propertyName][keyframeMs] = updates2[timelineName][componentId][propertyName][keyframeMs]
          }
        }
      }
    }
  }
}

const INVERTER_ACCUMULATORS = {
  updateKeyframes: (baseInverter, newInverter) => {
    const basis1 = baseInverter.params[1]
    const basis2 = newInverter.params[1]

    for (const timelineName in basis2) {
      if (!basis1[timelineName]) basis1[timelineName] = {}
      for (const componentId in basis2[timelineName]) {
        if (!basis1[timelineName][componentId]) basis1[timelineName][componentId] = {}
        for (const propertyName in basis2[timelineName][componentId]) {
          if (!basis1[timelineName][componentId][propertyName]) basis1[timelineName][componentId][propertyName] = {}
          for (const keyframeMs in basis2[timelineName][componentId][propertyName]) {
            if (basis1[timelineName][componentId][propertyName][keyframeMs] !== undefined) {
              continue
            }
            basis1[timelineName][componentId][propertyName][keyframeMs] = basis2[timelineName][componentId][propertyName][keyframeMs]
          }
        }
      }
    }
  }
}

const shouldAccumulate = (method, params) => ACCUMULATORS[method] && !params[params.length - 2].cursor

/**
 * @class ActionStack
 * @description
 *   Manages queue of actions for a host Project object.
 *   Encapsulates...:
 *     - enqueuing actions and preserving order
 *     - batching together rapid requests
 *     - handling undo/redo
 *
 *   Use caution when changing this.
 *
 *   If you change anything here, keep in mind the following constraints:
 *     - rapid actions on stage (like dragging) need to be instantaneous
 *     - snapshotting data (e.g. for undo) should not cause perceptible lag or jank
 *     - actions should be equivalent across processes (or we'll get crashes)
 */
class ActionStack extends BaseModel {
  constructor (props, opts) {
    super(props, opts)
    this.resetData()
    this.processActions()
  }

  /**
   * @method reset
   * @description Because Creator and Master are long-lived, there needs to be
   * a mechanism to explicitly clear the in-memory content when the project is
   * closed and then reopened again, otherwise it will have stale data from
   * the previous project editing session.
   */
  resetData () {
    this.stopped = false
    this.undoables = []
    this.redoables = []
    this.actions = []
    this.accumulatorTimeouts = {}
    this.accumulatedInverters = {}
    // A hashmap from aliases to action stack indices, used to implement remote request ordering. Remote updates may be
    // received out of order, so Project#updateHook attaches an action stack index to each request sent out to other
    // processes. This ensures that even if requests per remote process are received out of order, we process them in
    // order.
    this.actionStackIndices = {
      glass: 0,
      timeline: 0,
      creator: 0,
      master: 0
    }
  }

  stop () {
    this.stopped = true
  }

  processActions () {
    const action = this.actions[0]

    if (!action) {
      return (this.stopped)
        ? null
        : setTimeout(() => this.processActions(), TIMER_TIMEOUT)
    }

    // Psuedo-debounce fast actions to avoid stuttering on stage
    delete this.accumulatorTimeouts[action.method]
    if (shouldAccumulate(action.method, action.params)) {
      // We may want to wait longer for more updates to accumulate
      if (
        action.timestamp &&
        (Date.now() - action.timestamp) < PROPERTY_GROUP_ACCUMULATION_TIME
      ) {
        // Early return is important here so we don't transmit the action yet.
        this.accumulatorTimeouts[action.method] = setTimeout(() => this.processActions(), TIMER_TIMEOUT)
        return
      }
    }

    // Since we're going to process now, we can remove from the queue
    this.shiftAndProcessLatestAction()
  }

  forceAccumulation () {
    for (const method in this.accumulatorTimeouts) {
      clearTimeout(this.accumulatorTimeouts[method])
      delete this.accumulatorTimeouts[method]
      this.shiftAndProcessLatestAction()
    }
  }

  shiftAndProcessLatestAction () {
    const action = this.actions.shift()

    if (action) {
      this.processAction(action)
    } else {
      this.processActions()
    }
  }

  processAction (action) {
    const {
      method,
      params,
      before
    } = action

    // If requested, notify the caller right before we resolve the action
    if (before) {
      before()
    }

    // Resume the queue after we've finished handling the action.
    return this.emit('next', method, params, () => this.processActions())
  }

  enqueueAction (method, params, before) {
    if (shouldAccumulate(method, params)) {
      for (let i = this.actions.length - 1; i >= 0; i--) {
        // Find the most recent action that meets our criteria, and merge our payload with it
        const action = this.actions[i]

        if (
          action.method === method &&
          action.params[0] === params[0] && // folder
          action.params[1] === params[1] // relpath
        ) {
          ACCUMULATORS[method](params, action)
          action.timestamp = Date.now()
          return
        }
      }
    }

    // If we got here, we shouldn't have merged action contents, and need a new queue entry
    this.actions.push({
      timestamp: Date.now(),
      method,
      params,
      before
    })

    // If not an accumulator method, invoke it immediately
    if (
      this.actions.length < 2 &&
      !shouldAccumulate(method, params)) {
      this.shiftAndProcessLatestAction()
    }
  }

  addDoable (doable, stack) {
    stack.push(doable)

    if (stack.length > MAX_UNDOABLES_LEN) {
      stack.shift()
    }
  }

  addUndoable (undoable, ac) {
    // TODO: reimplement this.undoables as a Map<ActiveComponent, Undoable[]>
    this.addDoable(Object.assign(undoable, {ac}), this.undoables)
  }

  addRedoable (redoable, ac) {
    // TODO: reimplement this.redoables as a Map<ActiveComponent, Undoable[]>
    this.addDoable(Object.assign(redoable, {ac}), this.redoables)
  }

  popDoable (stack, ac) {
    // If no active component context, just use the top of the stack.
    if (!ac) {
      return stack.pop()
    }

    // If the top item on the stack has no active component context,
    // pop it. We assume that it represents a project-level change.
    const last = stack[stack.length - 1]
    if (last && !last.ac) {
      return stack.pop()
    }

    // Pop the stack entry that belongs to the active component context.
    // (Like a text editor, our undo/redo is context-specific to the file.)
    for (let i = stack.length - 1; i >= 0; i--) {
      const entry = stack[i]

      if (entry.ac === ac) {
        return stack.splice(i, 1)[0]
      }
    }

    // If we have an active component, but haven't found any entries in
    // the stack to match it, then we should do nothing since the top of
    // the stack may contain a doable for another component, which would
    // be a surprising change for the user given the current context.
    return null
  }

  popUndoable (ac) {
    return this.popDoable(this.undoables, ac)
  }

  popRedoable (ac) {
    return this.popDoable(this.redoables, ac)
  }

  getUndoables () {
    return this.undoables
  }

  getRedoables () {
    return this.redoables
  }

  buildMethodInverterAction (ac, method, params, metadata, when, output) {
    if (
      ActionStack.METHOD_INVERTERS[method] &&
      ActionStack.METHOD_INVERTERS[method][when]
    ) {
      const inversion = ActionStack.METHOD_INVERTERS[method][when].call(
        this,
        ac,
        params.slice(1), // Exclude the ActiveComponent 'relpath'
        output // If we're running 'after' the method has run
      )

      if (inversion) {
        const [relpath] = params
        inversion.params.unshift(relpath)
        inversion.params.push(metadata)

        if (when === 'before' && INVERTER_ACCUMULATORS[method]) {
          if (this.accumulatedInverters[method]) {
            INVERTER_ACCUMULATORS[method](this.accumulatedInverters[method], inversion)
          } else {
            this.accumulatedInverters[method] = inversion
          }
        }
      }

      return inversion
    }

    return null
  }

  shouldOrderRemoteUpdate (metadata) {
    return experimentIsEnabled(Experiment.OrderedActionStack) &&
      metadata.hasOwnProperty('actionStackIndex') &&
      this.project.isRemoteRequest(metadata)
  }

  advanceActionStackIndexForMetadata (metadata) {
    this.actionStackIndices[metadata.from]++
  }

  orderedAction (method, metadata, cb) {
    if (this.shouldOrderRemoteUpdate(metadata)) {
      if (this.actionStackIndices[metadata.from] !== metadata.actionStackIndex) {
        logger.info(`[action stack] received out-of-order ${method}; deferring until other actions complete`)
        logger.info(`[action stack] requested index: ${metadata.actionStackIndex}`)
        logger.info(`[action stack] current index: ${this.actionStackIndices[metadata.from]}`)
        return setTimeout(() => {
          this.orderedAction(method, metadata, cb)
        }, TIMER_TIMEOUT)
      }
      this.advanceActionStackIndexForMetadata(metadata)
      return cb()
    }

    return cb()
  }

  handleActionInitiation (method, params, metadata, continuation) {
    if (this.project.isRemoteRequest(metadata)) {
      // If we're receiving an action whose originator (not us) modified its
      // undo/redo stack, we need to make sure we do that action as well
      if (metadata.cursor === ActionStack.CURSOR_MODES.redo) {
        this.popUndoable(this.project.getCurrentActiveComponent())
      } else if (metadata.cursor === ActionStack.CURSOR_MODES.undo) {
        this.popRedoable(this.project.getCurrentActiveComponent())
      }
    }

    // No component needed nor available if the method called is in the Project scope
    const ac = (typeof params[0] === 'string')
      ? this.project.findActiveComponentBySourceIfPresent(params[0]) // relpath
      : null

    // The callback will fire immediately before the action is transmitted
    // This callback is named handleActionResolution
    const finish = (inverter) => this.orderedAction(method, metadata, () => continuation((err, out) => {
      if (err) {
        return
      }

      if (!inverter) {
        inverter = this.buildMethodInverterAction(ac, method, params, metadata, 'after', out)
      } else {
        delete this.accumulatedInverters[method]
      }

      let did = false

      if (inverter) {
        // Note that we use the cursor mode we snapshotted when the method was initiated
        if (
          // No cursor mode is equivalent to the default cursor mode
          !metadata.cursor
        ) {
          did = true
          this.addUndoable(inverter, ac)
          // Reset the redo stack.
          this.redoables.length = 0
        } else if (metadata.cursor === ActionStack.CURSOR_MODES.undo) {
          did = true
          this.addUndoable(inverter, ac)
        } else if (metadata.cursor === ActionStack.CURSOR_MODES.redo) {
          did = true
          this.addRedoable(inverter, ac)
        }

        if (did) {
          logger.info(
            `[action stack] inversion :::`,
            metadata.cursor,
            inverter.method,
            // inverter.params, // Big/circular objects cause total process lockup
            this.getUndoables().length, '<~u|r~>', this.getRedoables().length
          )
        }
      }
    }))

    if (SNAPSHOTTED_UNDOABLES[method]) {
      return ac.pushBytecodeSnapshot(() => finish({
        method: ac.popBytecodeSnapshot.name,
        params: [
          params[0], // relpath
          metadata
        ]
      }))
    }

    return finish(this.buildMethodInverterAction(ac, method, params, metadata, 'before'))
  }

  undo (options, metadata, cb) {
    this.forceAccumulation()

    if (this.getUndoables().length < 1) {
      return cb()
    }

    logger.info(`[action stack] undo (us=${this.getUndoables().length})`)

    return Lock.request(Lock.LOCKS.ActionStackUndoRedo, false, (release) => {
      const undoable = this.popUndoable(this.project.getCurrentActiveComponent())

      if (!undoable) {
        release()
        return cb()
      }

      const { method, params, ac } = undoable

      if (!ac) {
        release()
        return cb()
      }

      const metadata = lodash.assign({}, params.pop(), {cursor: 'redo', from: this.project.getAlias()})
      params.push(metadata)

      // We need to slice off the 'relpath' parameter (sorry)
      return ac[method](...params.slice(1), (err, out) => {
        release()
        return cb(err, out)
      })
    })
  }

  redo (options, metadata, cb) {
    this.forceAccumulation()

    if (this.getRedoables().length < 1) {
      return cb()
    }

    logger.info(`[action stack] redo (rs=${this.getRedoables().length})`)

    return Lock.request(Lock.LOCKS.ActionStackUndoRedo, false, (release) => {
      const redoable = this.popRedoable(this.project.getCurrentActiveComponent())

      if (!redoable) {
        release()
        return cb()
      }

      const { method, params, ac } = redoable

      if (!ac) {
        release()
        return cb()
      }

      const metadata = lodash.assign({}, params.pop(), {cursor: 'undo', from: this.project.getAlias()})
      params.push(metadata)

      // We need to slice off the 'relpath' parameter (sorry)
      return ac[method](...params.slice(1), (err, out) => {
        release()
        return cb(err, out)
      })
    })
  }
}

ActionStack.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    project: true
  }
}

BaseModel.extend(ActionStack)

/**
 * Translate the parameters of a method into the method signature of
 * a command that would perfectly invert the method.
 * These functions are called with the Project object as the this-binding.
 * Returning falsy indicates that the method cannot be inverted (undone).
 * These are called _before_ the method is invoked, so you can access the data
 * in the ActiveComponent object prior to the data mutation.
 */
ActionStack.METHOD_INVERTERS = {
  conglomerateComponent: {
    before: (ac, [componentIds, name, size, translation, coords, propertiesSerial, options]) => ({
      method: ac.unconglomerateComponent.name,
      params: [componentIds, name, size, translation, coords, propertiesSerial, options]
    })
  },

  unconglomerateComponent: {
    before: (ac, [componentIds, name, size, translation, coords, propertiesSerial, options]) => ({
      method: ac.conglomerateComponent.name,
      params: [componentIds, name, size, translation, coords, propertiesSerial, options]
    })
  },

  updateKeyframes: {
    before: (ac, [keyframeUpdates]) => {
      const previousUpdates = ac.snapshotKeyframeUpdates(keyframeUpdates)
      return {
        method: ac.updateKeyframes.name,
        params: [previousUpdates, {}]
      }
    }
  },

  moveKeyframes: {
    before: (ac, [keyframeMoves]) => {
      const previousMoves = ac.snapshotKeyframeMoves(keyframeMoves)
      return {
        method: ac.moveKeyframes.name,
        params: [previousMoves]
      }
    }
  },

  instantiateComponent: {
    after: (ac, [modpath, coords], output) => {
      if (output) {
        return {
          method: ac.deleteComponents.name,
          params: [[output.attributes['haiku-id']]]
        }
      }
    }
  },

  deleteComponents: {
    before: (ac, [haikuIds]) => ({
      method: ac.pasteThings.name,
      params: [
        haikuIds.map((haikuId) => ac.findElementByComponentId(haikuId)).filter((element) => !!element).map((element) => element.clip()),
        // Paste the content-as is; don't pad ids or our previous undoable references won't match the new content
        {skipHashPadding: true}
      ]
    })
  },

  pasteThings: {
    after: (ac, _, {haikuIds}) => {
      return {
        method: ac.deleteComponents.name,
        params: [haikuIds]
      }
    }
  },

  changeKeyframeValue: {
    before: (ac, [componentId, timelineName, propertyName, keyframeMs, newValue]) => {
      const oldValue = ac.getKeyframeValue(componentId, timelineName, keyframeMs, propertyName)
      return {
        method: ac.changeKeyframeValue.name,
        params: [componentId, timelineName, propertyName, keyframeMs, oldValue]
      }
    }
  },

  changeSegmentCurve: {
    before: (ac, [componentId, timelineName, propertyName, keyframeMs, newCurve]) => {
      const oldCurve = ac.getKeyframeCurve(componentId, timelineName, keyframeMs, propertyName)
      return {
        method: ac.changeSegmentCurve.name,
        params: [componentId, timelineName, propertyName, keyframeMs, oldCurve]
      }
    }
  },

  createKeyframe: {
    before: (ac, [componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue]) => {
      const oldValue = ac.getKeyframeValue(componentId, timelineName, keyframeStartMs, propertyName)
      const oldCurve = ac.getKeyframeCurve(componentId, timelineName, keyframeStartMs, propertyName)
      if (oldValue !== undefined) {
        return {
          method: ac.createKeyframe.name,
          params: [componentId, timelineName, elementName, propertyName, keyframeStartMs, oldValue, oldCurve, null, null, null]
        }
      } else {
        return {
          method: ac.deleteKeyframe.name,
          params: [componentId, timelineName, propertyName, keyframeStartMs]
        }
      }
    }
  },

  deleteKeyframe: {
    before: (ac, [componentId, timelineName, propertyName, keyframeMs]) => {
      const elementName = ac.getElementNameOfComponentId(componentId)
      const oldValue = ac.getKeyframeValue(componentId, timelineName, keyframeMs, propertyName)
      const oldCurve = ac.getKeyframeCurve(componentId, timelineName, keyframeMs, propertyName)
      return {
        method: ac.createKeyframe.name,
        params: [componentId, timelineName, elementName, propertyName, keyframeMs, oldValue, oldCurve, null, null, null]
      }
    }
  },

  joinKeyframes: {
    before: (ac, [componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve]) => {
      return {
        method: ac.splitSegment.name,
        params: [componentId, timelineName, elementName, propertyName, keyframeMsLeft]
      }
    }
  },

  splitSegment: {
    before: (ac, [componentId, timelineName, elementName, propertyName, keyframeMs]) => {
      const oldCurve = ac.getKeyframeCurve(componentId, timelineName, keyframeMs, propertyName)
      return {
        method: ac.joinKeyframes.name,
        params: [componentId, timelineName, elementName, propertyName, keyframeMs, null, oldCurve]
      }
    }
  },

  upsertStateValue: {
    before: (ac, [stateName, stateDescriptor]) => {
      const previousDescriptor = lodash.clone(ac.getStateDescriptor(stateName))
      if (!previousDescriptor) {
        return {
          method: ac.deleteStateValue.name,
          params: [stateName]
        }
      } else {
        return {
          method: ac.upsertStateValue.name,
          params: [stateName, previousDescriptor]
        }
      }
    }
  },

  deleteStateValue: {
    before: (ac, [stateName]) => {
      const previousDescriptor = lodash.clone(ac.getStateDescriptor(stateName))
      return {
        method: ac.upsertStateValue.name,
        params: [stateName, previousDescriptor]
      }
    }
  },

  zMoveToFront: {
    before: (ac, [componentId, timelineName, timelineTime]) => {
      const moves = ac.gatherZIndexKeyframeMoves(timelineName)
      return {
        method: ac.moveKeyframes.name,
        params: [moves]
      }
    }
  },

  zMoveForward: {
    before: (ac, [componentId, timelineName, timelineTime]) => {
      const moves = ac.gatherZIndexKeyframeMoves(timelineName)
      return {
        method: ac.moveKeyframes.name,
        params: [moves]
      }
    }
  },

  zMoveBackward: {
    before: (ac, [componentId, timelineName, timelineTime]) => {
      const moves = ac.gatherZIndexKeyframeMoves(timelineName)
      return {
        method: ac.moveKeyframes.name,
        params: [moves]
      }
    }
  },

  zMoveToBack: {
    before: (ac, [componentId, timelineName, timelineTime]) => {
      const moves = ac.gatherZIndexKeyframeMoves(timelineName)
      return {
        method: ac.moveKeyframes.name,
        params: [moves]
      }
    }
  },

  zShiftIndices: {
    before: (ac, [componentId, timelineName, timelineTime, newIndex]) => {
      const moves = ac.gatherZIndexKeyframeMoves(timelineName)
      return {
        method: ac.moveKeyframes.name,
        params: [moves]
      }
    }
  },

  setTitleForComponent: {
    after: (ac, [componentId], oldTitle) => ({
      method: ac.setTitleForComponent.name,
      params: [componentId, oldTitle]
    })
  }

  // mergeDesigns: {
  //   before: (ac, [designs]) => {
  //     // Not yet implemented; user should undo within their design tool
  //   }
  // },

  // upsertEventHandler: {
  //   before: (ac, [selectorName, eventName, handlerDescriptor]) => {
  //     // Not yet implemented
  //   }
  // },

  // batchUpsertEventHandlers: {
  //   before: (ac, [selectorName, serializedEvents]) => {
  //     // Not yet implemented
  //   }
  // },

  // deleteEventHandler: {
  //   before: (ac, [selectorName, eventName]) => {
  //     // Not yet implemented
  //   }
  // },
}

ActionStack.CURSOR_MODES = {
  undo: 'undo',
  redo: 'redo'
}

ActionStack.toPOJO = (instance) => {
  return {
    uid: instance.uid,
    stopped: instance.stopped,
    undoables: instance.undoables,
    redoables: instance.redoables,
    actions: instance.actions
  }
}

ActionStack.fromPOJO = (pojo) => {
  return ActionStack.upsert(pojo, {})
}

module.exports = ActionStack
