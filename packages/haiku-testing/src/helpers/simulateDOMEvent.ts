export default (element, name) => {
  const document = element.ownerDocument;
  const event = document.createEvent('HTMLEvents');

  event.initEvent(name, false, true);
  element.dispatchEvent(event);

  return event;
};
