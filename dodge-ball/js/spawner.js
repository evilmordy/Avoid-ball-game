DodgeBall.Spawner = class Spawner {
  constructor() {
    this.reset();
  }

  reset() {
    this.lastSpawn = 0;
    this.elapsed = 0;
  }

  get interval() {
    const C = DodgeBall.CONFIG;
    const lvl = Math.floor(this.elapsed / C.spawner.levelUpTime);
    return Math.max(
      C.spawner.minInterval,
      C.spawner.initialInterval - lvl * C.spawner.intervalDecrease
    );
  }

  get ballSpeed() {
    const C = DodgeBall.CONFIG;
    const lvl = Math.floor(this.elapsed / C.difficulty.speedIncreaseInterval);
    return C.difficulty.initialBallSpeed + lvl * C.difficulty.speedIncrease;
  }

  update(dt) {
    this.elapsed += dt;
  }

  shouldSpawn(now) {
    return now - this.lastSpawn >= this.interval;
  }

  spawn(px, py) {
    const C = DodgeBall.CONFIG;
    const edge = Math.floor(Math.random() * 4);
    const spd = this.ballSpeed;
    const { width: W, height: H } = C.canvas;
    const m = 30;
    let x, y, vx, vy;

    switch (edge) {
      case 0: x = Math.random() * W;       y = -m;             vx = (Math.random() - 0.5) * spd * 0.6; vy = spd; break;
      case 1: x = W + m;                  y = Math.random() * H; vx = -spd; vy = (Math.random() - 0.5) * spd * 0.6; break;
      case 2: x = Math.random() * W;       y = H + m;           vx = (Math.random() - 0.5) * spd * 0.6; vy = -spd; break;
      case 3: x = -m;                     y = Math.random() * H; vx = spd;  vy = (Math.random() - 0.5) * spd * 0.6; break;
    }

    const dx = x - px;
    const dy = y - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < C.spawner.minSpawnDistance) {
      const nd = C.spawner.minSpawnDistance;
      x = px + (dx / dist || 1) * nd;
      y = py + (dy / dist || 0) * nd;
    }

    const r = Math.random();
    const { red, gold, green } = C.spawnChances;

    if (r < red) {
      const radius = C.balls.red.minRadius + Math.random() * (C.balls.red.maxRadius - C.balls.red.minRadius);
      return new DodgeBall.RedBall(x, y, vx, vy, radius);
    }
    if (r < red + gold) {
      return new DodgeBall.GoldBall(x, y, vx, vy);
    }
    return new DodgeBall.GreenBall(x, y, vx, vy);
  }
};
