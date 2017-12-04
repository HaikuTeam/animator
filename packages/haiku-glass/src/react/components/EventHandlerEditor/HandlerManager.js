import prettier from 'prettier'
import functionToRFO from '@haiku/player/lib/reflection/functionToRFO'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/*
 * The purpose of this clas is to abstract all the logic related to
 * event manipulation in an element.
 */
class HandlerManager {
  constructor (element) {
    this.element = element
    this.applicableEventHandlers = element.getApplicableEventHandlerOptionsList()
    this.appliedEventHandlers = this._getParsedAppliedHandlers(element)
    this.applicableEventHandlersList = this._applicableEventHandlersToList()
  }

  /*
   * Returns a serialized object which represents the new state of event
   * listeners in a element. This object can be used direcly by bytecode methods
   * to save in disk.
   *
   * @returns {Object} { [event]: serializedHandler }
   */
  serialize () {
    const result = {}

    /* eslint-disable no-unused-vars */
    for (let [event, {id, handler}] of this.appliedEventHandlers) {
      // Only save events with a handler length, in this way we support
      // deletion of events by empty body funcitons
      if (handler.body.length) {
        result[event] = {handler: {__function: handler}}
      }

      this.element.setEventHandlerSaveStatus(event, true)
    }
    /* eslint-enable no-unused-vars */

    return result
  }

  /**
   *  Tries to find an event handler in memory for `event`, if it doesn't exist
   * creates a default handler and stores it in memory
   *
   * @param {String} event
   */
  getOrGenerateEventHandler (event) {
    return this.appliedEventHandlers.has(event)
      ? this.appliedEventHandlers.get(event)
      : this._addEventHandler(event).get(event)
  }

  /**
   * Finds an event not applied yet to the current element and adds a default
   * listener to it.
   */
  addNextAvailableEventHandler () {
    const event = this._getNextAvailableDOMEvent()
    this._addEventHandler(event)
  }

  /**
   * Replace the handlers of an event
   *
   * @param {Object} serializedEvent
   * @param {String} oldEventName
   */
  replaceEvent ({id, event, handler}, oldEventName) {
    this.appliedEventHandlers.delete(oldEventName)
    this.appliedEventHandlers.set(event, {id, handler})
  }

  /**
   * Delete the given event
   *
   * @param {String} event
   */
  delete (event) {
    this.appliedEventHandlers.delete(event)
  }

  /**
   * Maps all the DOM events in memory (ie. not custom) into an array
   *
   * @returns {String[]}
   */
  DOMEvents () {
    const result = []

    for (let [event, {id, handler}] of this.appliedEventHandlers) {
      if (this._isDOMEvent(event)) {
        result.push({id, event, handler})
      }
    }

    return result
  }

  /**
   * @returns {Boolean} indicating where the element has DOM events attached
   */
  hasDOMEvents () {
    return Boolean(this.DOMEvents().length)
  }

  /**
   * @returns {Number} how many events the element has attached
   */
  size () {
    return this.appliedEventHandlers.size
  }

  /**
   * Checks if an event is attached to the element
   *
   * @param {String} event
   * @returns {Boolean}
   */
  has (event) {
    return this.appliedEventHandlers.has(event)
  }

  /**
   * Simple getter for the in-memory applicableEventHandlers list
   */
  getApplicableEventHandlers () {
    return this.applicableEventHandlers
  }

  /**
   * Adds an event with a default handler to an element
   *
   * @param {String} event
   */
  _addEventHandler (event) {
    const {handler} = this._buildEventHandler(event)

    return this.appliedEventHandlers.set(event, {
      id: this._generateID(),
      handler
    })
  }

  _applicableEventHandlersToList () {
    const result = []

    for (let handlerGroup of this.applicableEventHandlers) {
      for (let {value} of handlerGroup.options) {
        result.push(value)
      }
    }

    return result
  }

  /**
   * Checks if an event is a DOM event
   *
   * @param {String} event
   * @returns {Boolean}
   */
  _isDOMEvent (event) {
    return this.applicableEventHandlersList.includes(event)
  }

  /**
   * Finds an event that hasn't been applied to the element
   */
  _getNextAvailableDOMEvent () {
    for (let event of this.applicableEventHandlersList) {
      if (!this.appliedEventHandlers.has(event)) {
        return event
      }
    }
  }

  /**
   * Generates a Map that is going to be our in-memory representation of all
   * the applied handlers to an element.
   *
   * The map stores the event name as a key (for convenience) and an object
   * containing the handler and a unique ID as the value.
   *
   * @param {Object} element
   * @returns {Map}
   */
  _getParsedAppliedHandlers (element) {
    const result = new Map()
    const appliedEventHandlers = element.getReifiedEventHandlers()

    for (let [event, rawHandler] of Object.entries(appliedEventHandlers)) {
      const wrappedHandler = rawHandler.original || rawHandler.handler
      const handler = functionToRFO(wrappedHandler).__function
      const id = this._generateID()

      // #FIXME: our pipeline to save and retrieve bytecode modifies the code
      // wrote by the user causing two issues:
      // 1. If the code only contains comments, the comments are deleted
      // 2. The format is not respected.
      handler.body =
        prettier.format(handler.body) || this._buildEventHandler().handler.body

      result.set(event, {
        id,
        handler
      })
    }

    return result
  }

  /**
   * Builds a default event handler
   *
   * @param {String} event
   * @returns {Object}
   */
  _buildEventHandler (event) {
    return {
      event,
      handler: {
        body: `/** event logic goes here */`,
        params: [`event`]
      }
    }
  }

  /**
   * Generates an unique-ish ID
   *
   * #FIXME: this logic is repeated all over Haiku, we should do a proper
   * abstraction
   *
   * @param {Number} len
   * @returns {String}
   */

  _generateID (len = 3) {
    let str = ''
    while (str.length < len) {
      str += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }
    return str
  }
}

export default HandlerManager
