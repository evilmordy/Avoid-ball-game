DodgeBall.PowerUp = class PowerUp {
  constructor(x, y, type, cfg) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.cfg = cfg;
    this.radius = 12;
    this.life = 12000;
    this._pulse = 0;
  }

  update() {
    this.life -= 16.667;
    this._pulse += 0.08;
  }

  get dead() { return this.life <= 0; }
  get color() { return this.cfg.color; }
  get label() { return this.cfg.label; }
  get pulseScale() { return 1 + Math.sin(this._pulse) * 0.15; }
};
