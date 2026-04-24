DodgeBall.GoldBall = class GoldBall extends DodgeBall.Ball {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy, DodgeBall.CONFIG.balls.gold.radius, DodgeBall.CONFIG.balls.gold.color);
  }

  get type() {
    return 'gold';
  }
};
