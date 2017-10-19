const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const ID_ATTRIBUTE = 'id';

/**
 * @function getFlexId
 * @description Get the flexible main identifier for the element, which may
 * be either a virtual element in the mana format, or a vanilla dom node.
 */
export default function getFlexId(element) {
  if (element) {
    if (element.getAttribute) {
      return element.getAttribute(HAIKU_ID_ATTRIBUTE) || element.getAttribute(ID_ATTRIBUTE);
    } else if (element.attributes) {
      return element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes[ID_ATTRIBUTE];
    }
  }
}
