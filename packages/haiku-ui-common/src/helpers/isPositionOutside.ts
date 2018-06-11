import {Position} from './types';

function isPositionOutside (p1: Position, box: ClientRect) {
  if (!p1) {
    return true;
  }
  if (!box) {
    return true;
  }
  const answer = (
    p1.x < box.left ||
    p1.x > box.right ||
    p1.y < box.top ||
    p1.y > box.bottom
  );
  return answer;
}

export default isPositionOutside;
