function doPositionsMatch(p1, p2) {
  if (!p1) { return false; }
  if (!p2) { return false; }
  return ~~p1.x === ~~p2.x && ~~p1.y === ~~p2.y;
}

export default doPositionsMatch;
