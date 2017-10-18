import VANITY_HANDLERS from './../properties/dom/vanities';

export default function applyPropertyToElement(element, name, value, context, component) {
  let type = element.elementName;

  if (element.__instance) {
    // See if the instance at this node will allow us to apply this property
    const addressables = element.__instance.getAddressableProperties();
    if (addressables[name] !== undefined) {
      // Call the 'setter' of the given addressable property
      // TODO: Runtime type check?
      element.__instance.state[name] = value;
      // Early return - the component instance will handle applying the
      // property internally
      return;
    }
    // If we get here, then we will just apply to the wrapper element itself
    // using any of the built-in vanity handler functions
    type = 'div'; // TODO: How will this assumption bite us later?
  }

  if (
    VANITY_HANDLERS[type] &&
    VANITY_HANDLERS[type][name]
  ) {
    VANITY_HANDLERS[type][name](
      name,
      element,
      value,
      context,
      component,
    );
  } else {
    element.attributes[name] = value;
  }
}
