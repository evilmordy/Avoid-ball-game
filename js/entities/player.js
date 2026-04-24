DodgeBall.Player = class Player {
  constructor(cfg) {
    this.cfg = cfg;
    this.reset();
  }

  update(input) {
    let dx = 0;
    let dy = 0;
    const k = this.cfg.keys;
    if (input.isDown(k.left))  dx -= 1;
    if (input.isDown(k.right)) dx += 1;
    if (input.isDown(k.up))    dy -= 1;
    if (input.isDown(k.down))  dy += 1;

    if (dx !== 0 && dy !== 0) {
      const diag = 1 / Math.SQRT2;
      dx *= diag;
      dy *= diag;
    }

    const C = DodgeBall.CONFIG;
    this.x += dx * this.speed;
    this.y += dy * this.speed;

    const half = this.size / 2;
    this.x = Math.max(half, Math.min(C.canvas.width - half, this.x));
    this.y = Math.max(half, Math.min(C.canvas.height - half, this.y));
  }

  enlarge(multiplier) {
    this.size = Math.min(this.size * multiplier, DodgeBall.CONFIG.players.maxSize);
  }

  reset() {
    const C = DodgeBall.CONFIG;
    this.x = C.canvas.width / 2;
    this.y = C.canvas.height / 2;
    this.size = this.cfg.size;
    this.speed = this.cfg.speed;
    this.color = this.cfg.color;
    this.dead = false;
  }
};
