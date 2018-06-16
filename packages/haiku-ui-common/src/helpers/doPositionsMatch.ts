import {Position} from './types';

function doPositionsMatch (p1?: Position, p2?: Position) {
  if (!p1) {
    return false;
  }
  if (!p2) {
    return false;
  }
  return ~~p1.x === ~~p2.x && ~~p1.y === ~~p2.y;
}

export default doPositionsMatch;
