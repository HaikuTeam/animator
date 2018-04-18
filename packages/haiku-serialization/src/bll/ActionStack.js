const lodash = require('lodash')
const BaseModel = require('./BaseModel')
const Lock = require('./Lock')
const logger = require('./../utils/LoggerInstance')

// No-op callback for arbitrary fire-and-forget actions
const NOOP_CB = () => {}
const TIMER_TIMEOUT = 64
const PROPERTY_GROUP_ACCUMULATION_TIME = 500
const MAX_UNDOABLES_LEN = 50

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

const shouldAccumulate = (method, params) => ACCUMULATORS[method] && !params[3].cursor

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
        // Early return is important here so we don't transmit the action yet
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
      callback,
      before
    } = action

    // If requested, notify the caller right before we resolve the action
    if (before) {
      before()
    }

    return this.emit('next', method, params, (err, out) => {
      callback(err, out)

      // Now that we've finished handling the action, resume the queue
      return this.processActions()
    })
  }

  fireAction (method, params, callback, before) {
    this.enqueueAction(
      method,
      params,
      callback || NOOP_CB,
      before
    )
  }

  enqueueAction (method, params, callback, before) {
    if (shouldAccumulate(method, params)) {
      // Find the most recent action that meets our criteria, and merge our payload with it
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
      callback,
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

  popDoable (stack) {
    return stack.pop()
  }

  addUndoable (undoable) {
    this.addDoable(undoable, this.undoables)
  }

  popUndoable () {
    return this.popDoable(this.undoables)
  }

  addRedoable (redoable) {
    this.addDoable(redoable, this.redoables)
  }

  popRedoable () {
    return this.popDoable(this.redoables)
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

  handleActionInitiation (method, params, metadata, continuation) {
    if (this.project.isRemoteRequest(metadata)) {
      // If we're receiving an action whose originator (not us) modified its
      // undo/redo stack, we need to make sure we do that action as well
      if (metadata.cursor === ActionStack.CURSOR_MODES.redo) {
        this.popUndoable()
      } else if (metadata.cursor === ActionStack.CURSOR_MODES.undo) {
        this.popRedoable()
      }
    }

    // This may be null if the method called is in the Project scope
    const [relpath] = params
    const ac = this.project.findActiveComponentBySource(relpath)

    let inverter = this.buildMethodInverterAction(ac, method, params, metadata, 'before')

    // The callback will fire immediately before the action is transmitted
    // This callback is named handleActionResolution
    return continuation((err, out) => {
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
          !metadata.cursor ||
          metadata.cursor === ActionStack.CURSOR_MODES.undo
        ) {
          did = true
          this.addUndoable(inverter)
        } else if (metadata.cursor === ActionStack.CURSOR_MODES.redo) {
          did = true
          this.addRedoable(inverter)
        }

        if (did) {
          logger.info(
            `[action stack] inversion :::`,
            metadata.cursor,
            inverter.method,
            inverter.params,
            this.getUndoables().length, '<~u|r~>', this.getRedoables().length
          )
        }
      }
    })
  }

  undo (options, metadata, cb) {
    this.forceAccumulation()
    if (this.getUndoables().length < 1) {
      return cb()
    }

    logger.info(`[action stack] undo (us=${this.getUndoables().length})`)

    return Lock.request(Lock.LOCKS.ActionStackUndoRedo, false, (release) => {
      const { method, params } = this.popUndoable()
      const ac = this.project.findActiveComponentBySource(params[0])

      if (!ac) {
        release()
        return cb()
      }

      const metadata = lodash.assign({}, params.pop(), {cursor: 'redo', from: this.project.getAlias()})
      params.push(metadata)

      // We need to slice off the 'relpath' parameter (sorry)
      return ac[method].apply(ac, params.slice(1).concat((err, out) => {
        release()
        return cb(err, out)
      }))
    })
  }

  redo (options, metadata, cb) {
    this.forceAccumulation()
    if (this.getRedoables().length < 1) {
      return cb()
    }

    logger.info(`[action stack] redo (rs=${this.getRedoables().length})`)

    return Lock.request(Lock.LOCKS.ActionStackUndoRedo, false, (release) => {
      const { method, params } = this.popRedoable()
      const ac = this.project.findActiveComponentBySource(params[0])

      if (!ac) {
        release()
        return cb()
      }

      const metadata = lodash.assign({}, params.pop(), {cursor: 'undo', from: this.project.getAlias()})
      params.push(metadata)

      // We need to slice off the 'relpath' parameter (sorry)
      return ac[method].apply(ac, params.slice(1).concat((err, out) => {
        release()
        return cb(err, out)
      }))
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
  updateKeyframes: {
    before: (ac, [keyframeUpdates]) => {
      const previousUpdates = ac.snapshotKeyframeUpdates(keyframeUpdates)
      return {
        method: ac.updateKeyframes.name,
        params: [previousUpdates]
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
          method: ac.deleteComponent.name,
          params: [output.attributes['haiku-id']]
        }
      }
    }
  },

  deleteComponent: {
    before: (ac, [haikuId]) => {
      const element = ac.findElementByComponentId(haikuId)
      if (element) {
        return {
          method: ac.pasteThing.name,
          params: [
            element.clip(),
            // Paste the content-as is; don't pad ids or our previous undoable
            // references won't match the new content
            {skipHashPadding: true}
          ]
        }
      }
    }
  },

  pasteThing: {
    after: (ac, [pasteable, request], {haikuId}) => {
      return {
        method: ac.deleteComponent.name,
        params: [haikuId]
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
          params: [componentId, timelineName, elementName, propertyName, keyframeStartMs, oldValue, oldCurve, null, null]
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
        params: [componentId, timelineName, elementName, propertyName, keyframeMs, oldValue, oldCurve, null, null]
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

  groupElements: {
    after: (ac, [componentIds], groupComponentId) => {
      return {
        method: ac.ungroupElements.name,
        params: [groupComponentId]
      }
    }
  },

  ungroupElements: {
    after: (ac, [componentId], ungroupedComponentIds) => {
      return {
        method: ac.groupElements.name,
        params: [ungroupedComponentIds]
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
