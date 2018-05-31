export default function awaitDOMElementById(window: Window, id: string, cb: Function) {
  const found = window.document.getElementById(id);

  if (found) {
    return cb(null, found);
  }

  setTimeout(() => awaitDOMElementById(window, id, cb), 100);
}
