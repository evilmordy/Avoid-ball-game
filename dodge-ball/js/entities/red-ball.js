DodgeBall.RedBall = class RedBall extends DodgeBall.Ball {
  constructor(x, y, vx, vy, radius) {
    super(x, y, vx, vy, radius, DodgeBall.CONFIG.balls.red.color);
  }

  get type() {
    return 'red';
  }
};
