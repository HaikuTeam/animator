import HaikuComponent from './../HaikuComponent';

const OBJECT_TYPE = 'object';
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const DEFAULT_TIMELINE_NAME = 'Default';

function isBytecode(thing) {
  return thing && typeof thing === OBJECT_TYPE && thing.template && thing.timelines;
}

function initializeComponentTree(element, component, context, instance) {
  // In addition to plain objects, a sub-element can also be a component,
  // which we currently detect by checking to see if it looks like 'bytecode'
  // Don't instantiate a second time if we already have the instance at this node
  if (isBytecode(element.elementName)) {
    const flexId = element.attributes && (element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes.id);

    // Allow an instance to be passed in if we happen to already have one representing this node.
    // Note that we do this whether or not an instance is already assigned - we *must* update.
    // BEWARE: This is used to work around an entity caching problem in Haiku.app, #FIXME
    if (instance) {
      element.__instance = instance;
    }

    // In the default behavior (not in Haiku.app), we instantiate an instance only if we don't
    // have one in memory already, since we can be assured that we don't handle hot replacements.
    if (!element.__instance) {
      element.__instance = new HaikuComponent(
        element.elementName,
        context,
        {
          // Exclude states, etc. (everything except 'options') since those should override *only* on the root element
          // being instantiated.
          options: context.config.options,
        },
        {
          nested: true,
        },
      );

      // We duplicate the behavior of HaikuContext and start the default timeline
      element.__instance.startTimeline(DEFAULT_TIMELINE_NAME);
    }

    // Another hack in order to make it easier to do editing hooks within Haiku.app
    element.__instance.__element = element;

    component._nestedComponentElements[flexId] = element;
  }

  // repeat through children
  if (element.children && element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      initializeComponentTree(element.children[i], component, context, instance);
    }
  }
}

export default initializeComponentTree;
