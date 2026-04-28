DodgeBall.SplitBall = class SplitBall extends DodgeBall.Ball {
  constructor(x, y, vx, vy) {
    const C = DodgeBall.CONFIG;
    super(x, y, vx, vy, C.balls.split.radius, C.balls.split.color);
    this._timer = C.balls.split.splitTime;
    this.triggered = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this._timer -= 16.667;
    if (this._timer <= 0) this.triggered = true;
  }

  get type() { return 'split'; }
};
