DodgeBall.Ball = class Ball {
  constructor(x, y, vx, vy, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  isOffScreen(w, h) {
    const m = this.radius * 2;
    return this.x + this.radius < -m
      || this.x - this.radius > w + m
      || this.y + this.radius < -m
      || this.y - this.radius > h + m;
  }

  get type() {
    return 'ball';
  }
};
