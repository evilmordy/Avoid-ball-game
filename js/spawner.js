DodgeBall.Spawner = class Spawner {
  constructor() {
    this.reset();
  }

  reset() {
    this.lastSpawn = 0;
    this.lastPowerupSpawn = 0;
    this.elapsed = 0;
  }

  get interval() {
    const C = DodgeBall.CONFIG;
    const lvl = Math.floor(this.elapsed / C.spawner.levelUpTime);
    return Math.max(C.spawner.minInterval, C.spawner.initialInterval - lvl * C.spawner.intervalDecrease);
  }

  get ballSpeed() {
    const C = DodgeBall.CONFIG;
    const lvl = Math.floor(this.elapsed / C.difficulty.speedIncreaseInterval);
    const raw = C.difficulty.initialBallSpeed + lvl * C.difficulty.speedIncrease;
    const cap = C.players.p1.speed * C.difficulty.ballSpeedCap;
    return Math.min(raw, cap);
  }

  get trackingSpeed() {
    const C = DodgeBall.CONFIG;
    const lvl = Math.floor(this.elapsed / C.difficulty.trackingSpeedInterval);
    const raw = C.difficulty.trackingSpeedBase + lvl * C.difficulty.trackingSpeedIncrease;
    const cap = C.players.p1.speed * C.difficulty.ballSpeedCap;
    return Math.min(raw, cap);
  }

  get powerupInterval() {
    const C = DodgeBall.CONFIG;
    const t = this.elapsed;
    const start = C.powerups.spawnInterval;
    const end = C.powerups.maxSpawnInterval;
    const ramp = C.powerups.rampTime;
    if (t >= ramp) return end;
    return start + (end - start) * (t / ramp);
  }

  update(dt) { this.elapsed += dt; }

  shouldSpawn(now) { return now - this.lastSpawn >= this.interval; }
  shouldSpawnPowerup(now) { return now - this.lastPowerupSpawn >= this.powerupInterval; }

  spawn(px, py) {
    const C = DodgeBall.CONFIG;
    const edge = Math.floor(Math.random() * 4);
    const spd = this.ballSpeed;
    const W = C.canvas.width, H = C.canvas.height;
    const m = 30;
    let x, y, vx, vy;

    switch (edge) {
      case 0: x = Math.random() * W; y = -m; vx = (Math.random() - 0.5) * spd * 0.6; vy = spd; break;
      case 1: x = W + m; y = Math.random() * H; vx = -spd; vy = (Math.random() - 0.5) * spd * 0.6; break;
      case 2: x = Math.random() * W; y = H + m; vx = (Math.random() - 0.5) * spd * 0.6; vy = -spd; break;
      case 3: x = -m; y = Math.random() * H; vx = spd; vy = (Math.random() - 0.5) * spd * 0.6; break;
    }

    const dx = x - px, dy = y - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < C.spawner.minSpawnDistance) {
      const nd = C.spawner.minSpawnDistance;
      x = px + (dx / dist || 1) * nd;
      y = py + (dy / dist || 0) * nd;
    }

    const r = Math.random();
    const ch = C.spawnChances;
    if (r < ch.red) {
      const radius = C.balls.red.minRadius + Math.random() * (C.balls.red.maxRadius - C.balls.red.minRadius);
      return new DodgeBall.RedBall(x, y, vx, vy, radius);
    }
    if (r < ch.red + ch.gold) return new DodgeBall.GoldBall(x, y, vx, vy);
    if (r < ch.red + ch.gold + ch.green) return new DodgeBall.GreenBall(x, y, vx, vy);
    if (r < ch.red + ch.gold + ch.green + ch.tracking) {
      return new DodgeBall.TrackingBall(x, y, vx, vy, this.trackingSpeed);
    }
    return new DodgeBall.SplitBall(x, y, vx, vy);
  }

  spawnPowerup(elapsed) {
    const C = DodgeBall.CONFIG;
    const x = 60 + Math.random() * (C.canvas.width - 120);
    const y = 60 + Math.random() * (C.canvas.height - 120);
    const r = Math.random();
    const w = C.powerups.weights;
    let type;
    if (r < w.shield) type = 'shield';
    else if (r < w.shield + w.speed) type = 'speed';
    else type = 'shrink';

    let cfg = C.powerups.types[type];
    if (type === 'shield' && elapsed >= C.powerups.shieldDropTime) {
      cfg = { duration: C.powerups.shieldDropDuration, color: cfg.color, label: cfg.label };
    }
    return new DodgeBall.PowerUp(x, y, type, cfg);
  }
};
