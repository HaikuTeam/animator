export default function domToMana(domElement: any, goDeep = false) {
  if (!domElement) {
    return;
  }

  if (domElement.nodeType === 1) {
    const mana = {
      elementName: domElement.tagName.toLowerCase(),
      attributes: {
        id: domElement.getAttribute('id'),
        class: domElement.getAttribute('class'),
        'haiku-id': domElement.getAttribute('haiku-id'),
      },
      children: [],
    };

    if (goDeep) {
      mana.children = domElement.children.map((childNode) => {
        return domToMana(childNode, true);
      });
    }

    return mana;
  }

  if (domElement.nodeType === 3) {
    return domElement.textContent;
  }
}
