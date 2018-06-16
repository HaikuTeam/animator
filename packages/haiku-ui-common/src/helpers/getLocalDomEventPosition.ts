import getDomEventPosition from './getDomEventPosition';
import getDomNodeRect from './getDomNodeRect';

function getLocalDomEventPosition (event: MouseEvent, element: Element) {
  const doc = element.ownerDocument;
  const viewPosition = getDomEventPosition(event, doc);
  const elementRect = getDomNodeRect(element);
  const x = viewPosition.x - elementRect.left;
  const y = viewPosition.y - elementRect.top;
  return {
    x: ~~x,
    y: ~~y,
  };
}

export default getLocalDomEventPosition;
