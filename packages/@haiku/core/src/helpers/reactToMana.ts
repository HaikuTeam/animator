/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import reactChildrenToMana from './reactChildrenToMana';

const STRING_TYPE = 'string';

export default function reactToMana (react) {
  const props = {};
  for (const key in react.props) {
    if (key !== 'children') {
      props[key] = react.props[key];
    }
  }

  const givenChildren = react.props.children || react.children;
  let processedChildren;
  if (Array.isArray(givenChildren)) {
    processedChildren = reactChildrenToMana(givenChildren);
  } else if (givenChildren && givenChildren.type) {
    processedChildren = [reactToMana(givenChildren)];
  } else if (typeof givenChildren === STRING_TYPE) {
    processedChildren = [givenChildren];
  }

  return {
    elementName: react.type,
    attributes: props,
    children: processedChildren,
  };
}
