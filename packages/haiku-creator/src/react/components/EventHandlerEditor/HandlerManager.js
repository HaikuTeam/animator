import {parse} from '@babel/parser';
import * as prettier from 'prettier';
import functionToRFO from '@haiku/core/lib/reflection/functionToRFO';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const isHandlerEmpty = (handler) => {
  return (
    !handler.body ||
    /^\s*$/.test(handler.body)
  );
};

/*
 * The purpose of this clas is to abstract all the logic related to
 * event manipulation in an element.
 */
class HandlerManager {
  constructor (element) {
    this.element = element;
    this.applicableEventHandlers = element.getApplicableEventHandlerOptionsList();
    this.appliedEventHandlers = this._getParsedAppliedHandlers(element);
  }

  /**
   * Format a frame in a standarized event name
   *
   * @param {number} frame
   * @returns {string}
   */

  static frameToEvent (frame) {
    return `timeline:Default:${frame}`;
  }

  /*
   * Returns a serialized object which represents the new state of event
   * listeners in a element. This object can be used direcly by bytecode methods
   * to save in disk.
   *
   * @returns {Object} { [event]: serializedHandler }
   */
  serialize () {
    const result = {};

    this.appliedEventHandlers.forEach(({handler}, event) => {
      // Only save events with a handler length, in this way we support
      // deletion of events by empty body functions.
      if (handler.body.length) {
        result[event] = {handler: {__function: handler}};
      }

      this.element.setEventHandlerSaveStatus(event, true);
    });

    return result;
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
      : this._addEventHandler(event).get(event);
  }

  /**
   * Replace the handlers of an event
   *
   * @param {Object} serializedEvent
   * @param {String} oldEventName
   */
  replaceEvent ({id, event, handler, evaluator}, oldEventName) {
    if (isHandlerEmpty(handler)) {
      this.delete(event);
    } else {
      this.appliedEventHandlers.set(event, {id, handler, evaluator});
    }
  }

  /**
   * Delete the given event
   *
   * @param {String} event
   */
  delete (event) {
    this.appliedEventHandlers.delete(event);
  }

  /**
   * Returns an Array of all the events that should be displayed for an element, this means
   * all events that are not frame listeners.
   *
   * @returns {String[]}
   */
  userVisibleEvents () {
    const result = [];

    this.appliedEventHandlers.forEach(({id, handler}, event) => {
      if (!this._isTimelineEvent(event)) {
        result.push({id, event, handler});
      }
    });

    return result;
  }

  _isNewCustomEvent (eventName) {
    return !this.applicableEventHandlers
    .reduce((acc, element) => acc.concat(element.options.map(o => o.value)), [])
    .includes(eventName);
  }

  /**
   * @returns {Boolean} indicating where the element has DOM events attached
   */
  hasUserVisibleEvents () {
    return Boolean(this.userVisibleEvents().length);
  }

  /**
   * @returns {Number} how many events the element has attached
   */
  size () {
    return this.appliedEventHandlers.size;
  }

  /**
   * Checks if an event is attached to the element
   *
   * @param {String} event
   * @returns {Boolean}
   */
  has (event) {
    return this.appliedEventHandlers.has(event);
  }

  /**
   * Simple getter for the in-memory applicableEventHandlers list
   */
  getApplicableEventHandlers () {
    return this.applicableEventHandlers;
  }

  /**
   * Adds an event with a default handler to an element
   *
   * @param {String} event
   */
  _addEventHandler (event) {
    const {handler} = this._buildEventHandler(event);

    return this.appliedEventHandlers.set(event, {
      id: this._generateID(),
      handler,
    });
  }

  /**
   * Checks if an event is a timeline event
   *
   * @param {String} event
   * @returns {Boolean}
   */
  _isTimelineEvent (event) {
    return this.element.isTimelineEvent(event);
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
    const result = new Map();
    const appliedEventHandlers = element.getReifiedEventHandlers();

    for (const [event, rawHandler] of Object.entries(appliedEventHandlers)) {
      const wrappedHandler = rawHandler.handler;
      const handler = functionToRFO(wrappedHandler).__function;
      const id = this._generateID();

      // #FIXME: our pipeline to save and retrieve bytecode modifies the code
      // wrote by the user causing two issues:
      // 1. The format is not respected.
      let prettierHandlerBody = null;
      if (handler.body) {
        try {
          // We need to evaluate the handler body as a function body. If we wrap the contents of the function in
          // a throwaway function () => { ... }, it will output:
          //   () => {
          //     <original content indented two spaces>
          //   };
          // To restore the formatted function body, we have to strip off the terminal lines and outdent the remainder.
          //
          // The added newline after body is to avoid last line being commented and also commenting closing }
          const prettierHandlerBodyLines = prettier.format(
            `()=>{${handler.body}\n}`,
            {
              parser: (text) => parse(text),
            },
          ).trim().split('\n');
          // Strip terminal lines. Bail if we somehow encounter an unexpected format.
          if (prettierHandlerBodyLines.shift() === '() => {' && prettierHandlerBodyLines.pop() === '};') {
            // Outdent by two spaces.
            prettierHandlerBody = `${prettierHandlerBodyLines.map((s) => s.slice(2)).join('\n')}\n`;
            // If we somehow got nothing back, just restore the original body (e.g. for only comments).
            if (prettierHandlerBody.length === 0) {
              prettierHandlerBody = handler.body;
            }
          }
        } catch (e) {
          // noop. User likely was permitted to save invalid JS.
          logger.warn(`[glass] caught exception prettying handler body: ${e.toString()}`);
        }
      }
      handler.body = prettierHandlerBody || this._buildEventHandler().handler.body;

      result.set(event, {
        id,
        handler,
      });
    }

    return result;
  }

  /**
   * Builds a default event handler
   *
   * @param {String} event
   * @returns {Object}
   */
  _buildEventHandler (event) {
    const params = this._isNewCustomEvent(event) ? ['component', 'data'] : ['component', 'element', 'target', 'event'];

    return {
      event,
      handler: {
        body: ``,
        params,
      },
    };
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
    let str = '';
    while (str.length < len) {
      str += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return str;
  }
}

export default HandlerManager;
