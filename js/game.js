DodgeBall.Game = class Game {
  constructor() {
    const C = DodgeBall.CONFIG;
    this.canvas = document.getElementById('gameCanvas');
    this.canvas.width = C.canvas.width;
    this.canvas.height = C.canvas.height;

    this.renderer = new DodgeBall.Renderer(this.canvas);
    this.ui = new DodgeBall.UI();
    this.input = new DodgeBall.Input(this.canvas);
    this.spawner = new DodgeBall.Spawner();

    this.mode = null;
    this.players = [];
    this.scores = [];
    this.balls = [];
    this.powerups = [];
    this.particles = [];
    this.stars = [];
    this.gameTime = 0;
    this.state = 0;
    this.lastTs = 0;

    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeDur = 0;
    this.shakeInt = 0;

    this.combo = 0;
    this.comboMult = 1;
    this.comboTime = 0;

    this.timeLimit = 0;
    this.timeLeft = 0;

    this._initStars();
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    this._showDifficultyScreen();
    requestAnimationFrame((t) => this._loop(t));
  }

  _initStars() {
    const C = DodgeBall.CONFIG;
    const cfg = C.backgroundStars;
    for (let i = 0; i < cfg.count; i++) {
      this.stars.push({
        x: Math.random() * C.canvas.width,
        y: Math.random() * C.canvas.height,
        r: 0.5 + Math.random() * cfg.maxRadius,
        a: 0.3 + Math.random() * 0.7,
        s: cfg.speed * (0.5 + Math.random()),
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  _resizeCanvas() {
    const c = this.canvas;
    const mw = window.innerWidth;
    const mh = window.innerHeight;
    const r = 800 / 600;
    let w, h;
    if (mw / mh > r) { h = mh * 0.92; w = h * r; }
    else { w = mw * 0.95; h = w / r; }
    c.style.width = w + 'px';
    c.style.height = h + 'px';
  }

  _applyDifficulty(p) {
    const C = DodgeBall.CONFIG;
    C.balls.green.sizeMultiplier = p.greenSizeMultiplier;
    Object.assign(C.spawner, p.spawner);
    Object.assign(C.difficulty, p.difficulty);
    Object.assign(C.spawnChances, p.spawnChances);
    if (p.powerups) Object.assign(C.powerups, p.powerups);
    C.players.p1.speed = p.playerSpeed;
    C.players.p2.speed = p.playerSpeed;
  }

  _showDifficultyScreen() {
    this.ui.showDifficultySelect(
      () => this._onDifficulty('easy'),
      () => this._onDifficulty('normal'),
      () => this._onDifficulty('hard')
    );
  }

  _onDifficulty(key) {
    this._applyDifficulty(DodgeBall.CONFIG.difficultyPresets[key]);
    this.ui.showModeSelect(
      () => this._start('single'),
      () => this._start('dual'),
      () => this._start('timeAttack')
    );
  }

  _start(mode) {
    const C = DodgeBall.CONFIG;
    this.mode = mode;
    this.players = [];
    this.scores = [];

    this.players.push(new DodgeBall.Player(C.players.p1));
    this.scores.push(0);

    if (mode === 'dual') {
      const p2 = new DodgeBall.Player(C.players.p2);
      p2.x += 80;
      this.players.push(p2);
      this.scores.push(0);
    }

    this.spawner.reset();
    this.balls = [];
    this.powerups = [];
    this.particles = [];
    this.gameTime = 0;
    this.state = 1;
    this.lastTs = performance.now();
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeDur = 0;
    this.combo = 0;
    this.comboMult = 1;
    this.comboTime = 0;
    this.timeLimit = mode === 'timeAttack' ? C.timeAttack.duration : 0;
    this.timeLeft = this.timeLimit;

    this.ui.hide();
    this.ui.showPauseBtn(() => this._pause());
  }

  _pause() {
    this.state = 2;
    this.ui.hidePauseBtn();
    this.ui.showPaused(() => this._resume());
  }

  _resume() {
    this.state = 1;
    this.lastTs = performance.now();
    this.ui.hide();
    this.ui.showPauseBtn(() => this._pause());
  }

  _over(isWin) {
    this.state = 3;
    this.ui.hidePauseBtn();
    const t = Math.floor(this.gameTime);
    let text;
    if (this.mode === 'dual') {
      const total = this.scores[0] + this.scores[1];
      text = 'P1 ' + this.scores[0] + '分  P2 ' + this.scores[1] + '分  |  总分 ' + total + '分  |  存活 ' + t + '秒';
    } else {
      text = '得分 ' + this.scores[0] + '  |  存活 ' + t + '秒';
    }
    this.ui.showGameOver(text, () => this._backToMenu(), isWin);
  }

  _backToMenu() {
    this.state = 0;
    this.players = [];
    this.balls = [];
    this.powerups = [];
    this.particles = [];
    this.ui.hidePauseBtn();
    this._showDifficultyScreen();
  }

  _loop(ts) {
    requestAnimationFrame((t) => this._loop(t));

    if (this.input.justPressed(' ')) {
      if (this.state === 1) this._pause();
      else if (this.state === 2) this._resume();
    }
    this.input.clearFrame();

    if (this.state === 1) {
      let dt = ts - this.lastTs;
      this.lastTs = ts;
      if (dt > 200) dt = 16.667;
      this.gameTime += dt / 1000;
      this._update(dt, ts);
    }

    if (this.state > 0) this._render();
  }

  _alive() {
    return this.players.filter(p => !p.dead);
  }

  _emitParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new DodgeBall.Particle(x, y, color));
    }
  }

  _shake(dur, int) {
    this.shakeDur = Math.max(this.shakeDur, dur);
    this.shakeInt = int;
  }

  _update(dt, now) {
    const C = DodgeBall.CONFIG;

    for (const p of this.players) {
      if (!p.dead) p.update(this.input);
    }

    this.spawner.update(dt);

    const alive = this._alive();
    const ref = alive.length > 0 ? alive[0] : { x: C.canvas.width / 2, y: C.canvas.height / 2 };

    if (this.spawner.shouldSpawn(now)) {
      const ball = this.spawner.spawn(ref.x, ref.y);
      if (ball) { this.balls.push(ball); this.spawner.lastSpawn = now; }
    }

    if (this.spawner.shouldSpawnPowerup(now)) {
      const pw = this.spawner.spawnPowerup(this.spawner.elapsed);
      if (pw) { this.powerups.push(pw); this.spawner.lastPowerupSpawn = now; }
    }

    const target = alive.length > 0 ? alive[0] : null;

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];

      if (target && b.setTarget) b.setTarget(target.x, target.y);
      b.update();

      if (b.type === 'split' && b.triggered) {
        const sc = C.balls.split;
        for (let j = 0; j < sc.splitCount; j++) {
          const a = (Math.PI * 2 / sc.splitCount) * j + Math.random() * 0.3;
          const cvx = Math.cos(a) * 3;
          const cvy = Math.sin(a) * 3;
          this.balls.push(new DodgeBall.RedBall(b.x, b.y, cvx, cvy, sc.childRadius));
        }
        this._emitParticles(b.x, b.y, b.color, 8);
        this.balls.splice(i, 1);
        continue;
      }

      if (b.isOffScreen(C.canvas.width, C.canvas.height)) {
        this.balls.splice(i, 1);
        continue;
      }

      let used = false;
      for (let j = 0; j < this.players.length && !used; j++) {
        const p = this.players[j];
        if (p.dead) continue;

        if (!DodgeBall.rectCircleCollision(p.x, p.y, p.size, b.x, b.y, b.radius)) continue;

        const danger = b.type === 'red' || b.type === 'tracking' || b.type === 'split';

        if (danger) {
          if (p.hasShield) {
            this.balls.splice(i, 1);
            used = true;
            this._emitParticles(b.x, b.y, '#44aaff', 6);
            continue;
          }

          const alive2 = p.takeDamage();
          this.balls.splice(i, 1);
          used = true;
          this.combo = 0;
          this.comboMult = 1;

          if (p.dead) {
            this._emitParticles(p.x, p.y, p.color, C.particles.death);
            this._emitParticles(p.x, p.y, '#ffffff', 10);
            this._shake(C.screenShake.deathDuration, C.screenShake.deathIntensity);
            if (this._alive().length === 0) { this._over(false); return; }
          } else {
            this._emitParticles(b.x, b.y, b.color, C.particles.hit);
            this._shake(C.screenShake.hitDuration, C.screenShake.hitIntensity);
          }
        } else if (b.type === 'gold' || b.type === 'green') {
          used = true;
          this.balls.splice(i, 1);

          const base = b.type === 'gold' ? C.balls.gold.points : C.balls.green.points;
          this.combo++;
          this.comboTime = this.gameTime;
          this.comboMult = Math.min(C.combo.max, 1 + Math.floor(this.combo / C.combo.step));
          this.scores[j] += base * this.comboMult;
          this._emitParticles(b.x, b.y, b.color, C.particles.collect);

          if (b.type === 'green') p.enlarge(C.balls.green.sizeMultiplier);
        }
      }
    }

    if (this.combo > 0 && (this.gameTime - this.comboTime) * 1000 > C.combo.timeout) {
      this.combo = 0;
      this.comboMult = 1;
    }

    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const pw = this.powerups[i];
      pw.update();
      if (pw.dead) { this.powerups.splice(i, 1); continue; }
      for (const p of this.players) {
        if (p.dead) continue;
        if (DodgeBall.rectCircleCollision(p.x, p.y, p.size, pw.x, pw.y, pw.radius)) {
          this.powerups.splice(i, 1);
          this._emitParticles(pw.x, pw.y, pw.color, 8);
          p.applyPowerup(pw.type, pw.cfg);
          break;
        }
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].dead) this.particles.splice(i, 1);
    }

    if (this.shakeDur > 0) {
      const decay = this.shakeDur < 60 ? 0.3 : 1;
      this.shakeX = (Math.random() - 0.5) * this.shakeInt * decay;
      this.shakeY = (Math.random() - 0.5) * this.shakeInt * decay;
      this.shakeDur -= dt;
      if (this.shakeDur <= 0) { this.shakeX = 0; this.shakeY = 0; }
    }

    for (const s of this.stars) {
      s.y += s.s * (dt / 16.667);
      if (s.y > C.canvas.height + 5) { s.y = -5; s.x = Math.random() * C.canvas.width; }
      s.tw += dt * 0.003;
      s.a = 0.3 + Math.abs(Math.sin(s.tw)) * 0.7;
    }

    if (this.mode === 'timeAttack') {
      this.timeLeft -= dt / 1000;
      if (this.timeLeft <= 0) { this.timeLeft = 0; this._over(true); return; }
    }
  }

  _render() {
    this.renderer.clear();
    this.renderer.drawStars(this.stars);
    const ctx = this.renderer.ctx;
    ctx.save();
    if (this.shakeX || this.shakeY) ctx.translate(this.shakeX, this.shakeY);
    this.renderer.drawGrid();
    for (const b of this.balls) this.renderer.drawBall(b);
    this.renderer.drawPowerups(this.powerups);
    for (const p of this.players) this.renderer.drawPlayer(p);
    this.renderer.drawParticles(this.particles);
    this.renderer.drawJoystick(this.input);
    this.renderer.drawHUD(this.scores, this.gameTime, this.mode);
    this.renderer.drawHP(this.players);
    this.renderer.drawCombo(this.combo, this.comboMult);
    this.renderer.drawTimeAttack(this.timeLeft, this.timeLimit);
    ctx.restore();
  }
};
