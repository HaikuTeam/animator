import getFlexId from './getFlexId';

export default function shouldElementBeReplaced(domElement, virtualElement) {
  const oldFlexId = getFlexId(domElement);
  const newFlexId = getFlexId(virtualElement);

  if (oldFlexId && newFlexId) {
    if (oldFlexId !== newFlexId) {
      return true;
    }
  }

  return false;
}
