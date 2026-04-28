DodgeBall.Player = class Player {
  constructor(cfg) {
    this.cfg = cfg;
    this.reset();
  }

  reset() {
    const C = DodgeBall.CONFIG;
    this.x = C.canvas.width / 2;
    this.y = C.canvas.height / 2;
    this.size = this.cfg.size;
    this.speed = this.cfg.speed;
    this.color = this.cfg.color;
    this.dead = false;
    this.hp = C.players.maxHP;
    this.maxHP = C.players.maxHP;
    this._fx = {};
  }

  update(input) {
    if (this.dead) return;

    let dx = 0;
    let dy = 0;

    if (input.touchActive && this.cfg.keys.left === 'ArrowLeft') {
      dx = input.touchDX;
      dy = input.touchDY;
    } else {
      const k = this.cfg.keys;
      if (input.isDown(k.left))  dx -= 1;
      if (input.isDown(k.right)) dx += 1;
      if (input.isDown(k.up))    dy -= 1;
      if (input.isDown(k.down))  dy += 1;
    }

    if (dx !== 0 && dy !== 0) {
      const d = 1 / Math.SQRT2;
      dx *= d;
      dy *= d;
    }

    let spd = this.speed;
    const sp = this._fx.speed;
    if (sp) spd *= sp.multiplier;

    const C = DodgeBall.CONFIG;
    this.x += dx * spd;
    this.y += dy * spd;

    const half = this.size / 2;
    this.x = Math.max(half, Math.min(C.canvas.width - half, this.x));
    this.y = Math.max(half, Math.min(C.canvas.height - half, this.y));

    this._tickFx();
  }

  _tickFx() {
    for (const k of Object.keys(this._fx)) {
      this._fx[k].life -= 16.667;
      if (this._fx[k].life <= 0) delete this._fx[k];
    }
  }

  applyPowerup(type, cfg) {
    if (type === 'shrink') {
      this.size = Math.max(8, this.size * cfg.factor);
      return;
    }
    this._fx[type] = { life: cfg.duration, multiplier: cfg.multiplier || 1 };
  }

  get hasShield() { return !!this._fx.shield; }

  takeDamage() {
    if (this.hp <= 0) return false;
    this.hp--;
    if (this.hp <= 0) { this.dead = true; return false; }
    return true;
  }

  enlarge(m) {
    this.size = Math.min(this.size * m, DodgeBall.CONFIG.players.maxSize);
  }
};
