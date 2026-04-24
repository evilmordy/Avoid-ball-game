DodgeBall.GreenBall = class GreenBall extends DodgeBall.Ball {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy, DodgeBall.CONFIG.balls.green.radius, DodgeBall.CONFIG.balls.green.color);
  }

  get type() {
    return 'green';
  }
};
