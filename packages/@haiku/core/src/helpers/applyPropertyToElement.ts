/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import vanities from './../properties/dom/vanities';

export default function applyPropertyToElement(element, name, value, context, component) {
  let type;

  if (element.__instance) {
    // Assume that nested components are always wrapped in a div
    type = 'div';

    // See if the instance at this node will allow us to apply this property
    const addressables = element.__instance.getAddressableProperties();
    if (addressables[name] !== undefined) {
      // Call the 'setter' of the given addressable property
      element.__instance.state[name] = value;
    }

    // Still apply known vanities even if the name collides with the addressable
    // This is important for components that want to handle e.g. size internally
    // but still want their wrapper element to display correctly
    if (vanities[type] && vanities[type][name]) {
      vanities[type][name](name, element, value, context, component);
    }
  } else {
    // Assume we're dealing with a normal built-in render node
    type = element.elementName;

    // Use the vanity if provided, otherwise fallback to attributes
    if (vanities[type] && vanities[type][name]) {
      vanities[type][name](name, element, value, context, component);
    } else {
      element.attributes[name] = value;
    }
  }
}
