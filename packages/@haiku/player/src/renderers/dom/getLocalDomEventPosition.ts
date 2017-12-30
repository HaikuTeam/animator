import getDomEventPosition from './getDomEventPosition';

export default function getLocalDomEventPosition(event, element) {
  const doc = element.ownerDocument;
  const viewPosition = getDomEventPosition(event, doc);
  const elementRect = element.getBoundingClientRect();
  const x = viewPosition.x - elementRect.left;
  const y = viewPosition.y - elementRect.top;
  return {
    x: ~~x,
    y: ~~y,
    pageX: viewPosition.x,
    pageY: viewPosition.y,
  };
}
