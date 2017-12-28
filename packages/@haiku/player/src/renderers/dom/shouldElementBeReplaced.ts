import getFlexId from './getFlexId';

export default function shouldElementBeReplaced(domElement, virtualElement, component) {
  const oldFlexId = getFlexId(domElement);
  const newFlexId = getFlexId(virtualElement);

  if (oldFlexId && newFlexId) {
    if (oldFlexId !== newFlexId) {
      return true;
    }
  }

  if (domElement.haiku && domElement.haiku.component) {
    // If the element carried at this node has a different host component,
    // we should do a full replacement, since the cache of the two instances
    // are different and may result in different (cached) rendering output
    if (domElement.haiku.component !== component) {
      return true;
    }
  }

  return false;
}
