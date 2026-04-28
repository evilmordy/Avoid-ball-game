DodgeBall.Particle = class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const a = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 3;
    this.vx = Math.cos(a) * spd;
    this.vy = Math.sin(a) * spd;
    this.color = color;
    this.life = 500 + Math.random() * 300;
    this.maxLife = this.life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.life -= 16.667;
  }

  get dead() { return this.life <= 0; }
  get alpha() { return Math.max(0, this.life / this.maxLife); }
  get radius() { return 2 + 2 * this.alpha; }
};
