DodgeBall.TrackingBall = class TrackingBall extends DodgeBall.Ball {
  constructor(x, y, vx, vy, speed) {
    const C = DodgeBall.CONFIG;
    super(x, y, vx, vy, C.balls.tracking.radius, C.balls.tracking.color);
    this.baseSpeed = speed || C.balls.tracking.speed;
    this._tx = 0;
    this._ty = 0;
  }

  setTarget(px, py) { this._tx = px; this._ty = py; }

  update() {
    const dx = this._tx - this.x;
    const dy = this._ty - this.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    this.x += (dx / d) * this.baseSpeed;
    this.y += (dy / d) * this.baseSpeed;
  }

  get type() { return 'tracking'; }
};
