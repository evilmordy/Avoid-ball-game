DodgeBall.rectCircleCollision = function(rx, ry, rSize, cx, cy, cr) {
  const half = rSize / 2;
  const closestX = Math.max(rx - half, Math.min(cx, rx + half));
  const closestY = Math.max(ry - half, Math.min(cy, ry + half));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < cr * cr;
};
