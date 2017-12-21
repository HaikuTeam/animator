// Notes: WOW!
export default function setInputSelection(contentEditableElement, isExpression) {
  let range;
  let selection;
  range = document.createRange();// Create a range (a range is a like the selection but invisible)
  range.selectNodeContents(contentEditableElement);// Select the entire contents of the element with the range
  if (isExpression) { range.collapse(false); }// collapse the range to the end point. false means collapse to end rather than the start
  selection = window.getSelection();// get the selection object (allows you to change selection)
  selection.removeAllRanges();// remove any selections already made
  selection.addRange(range);// make the range you have just created the visible selection
}
