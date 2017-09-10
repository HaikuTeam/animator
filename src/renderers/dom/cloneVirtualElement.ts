import cloneAttributes from "./cloneAttributes"

export default function cloneVirtualElement(virtualElement) {
  return {
    elementName: virtualElement.elementName,
    attributes: cloneAttributes(virtualElement.attributes),
    children: virtualElement.children,
  }
}
