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
    this.gameTime = 0;
    this.state = 0;
    this.lastTs = 0;

    this.ui.showModeSelect(
      () => this._start('single'),
      () => this._start('dual')
    );
    requestAnimationFrame((t) => this._loop(t));
  }

  _start(mode) {
    this.mode = mode;
    this.players = [];
    this.scores = [];

    const C = DodgeBall.CONFIG;
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
    this.gameTime = 0;
    this.state = 1;
    this.lastTs = performance.now();
    this.ui.hide();
  }

  _pause() {
    this.state = 2;
    this.ui.showPaused(() => this._resume());
  }

  _resume() {
    this.state = 1;
    this.lastTs = performance.now();
    this.ui.hide();
  }

  _over() {
    this.state = 3;
    const t = Math.floor(this.gameTime);
    let text;
    if (this.mode === 'dual') {
      const total = this.scores[0] + this.scores[1];
      text = `P1 ${this.scores[0]}分  P2 ${this.scores[1]}分  |  总分 ${total}分  |  存活 ${t}秒`;
    } else {
      text = `得分 ${this.scores[0]}  |  存活 ${t}秒`;
    }
    this.ui.showGameOver(text, () => this._backToMenu());
  }

  _backToMenu() {
    this.state = 0;
    this.players = [];
    this.scores = [];
    this.balls = [];
    this.mode = null;
    this.ui.showModeSelect(
      () => this._start('single'),
      () => this._start('dual')
    );
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

    if (this.state === 1 || this.state === 2 || this.state === 3) {
      this._render();
    }
  }

  _alivePlayers() {
    return this.players.filter(p => !p.dead);
  }

  _update(dt, now) {
    const C = DodgeBall.CONFIG;

    for (const p of this.players) {
      if (!p.dead) p.update(this.input);
    }

    this.spawner.update(dt);

    const alive = this._alivePlayers();
    const ref = alive.length > 0 ? alive[0] : { x: C.canvas.width / 2, y: C.canvas.height / 2 };

    if (this.spawner.shouldSpawn(now)) {
      const ball = this.spawner.spawn(ref.x, ref.y);
      if (ball) {
        this.balls.push(ball);
        this.spawner.lastSpawn = now;
      }
    }

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      b.update();

      if (b.isOffScreen(C.canvas.width, C.canvas.height)) {
        this.balls.splice(i, 1);
        continue;
      }

      let consumed = false;
      for (let j = 0; j < this.players.length && !consumed; j++) {
        const p = this.players[j];
        if (p.dead) continue;

        if (DodgeBall.rectCircleCollision(p.x, p.y, p.size, b.x, b.y, b.radius)) {
          consumed = true;
          this.balls.splice(i, 1);

          if (b.type === 'red') {
            p.dead = true;
            if (this._alivePlayers().length === 0) {
              this._over();
              return;
            }
          } else if (b.type === 'gold') {
            this.scores[j] += C.balls.gold.points;
          } else if (b.type === 'green') {
            this.scores[j] += C.balls.green.points;
            p.enlarge(C.balls.green.sizeMultiplier);
          }
        }
      }
    }

    if (this._alivePlayers().length === 0) {
      this._over();
    }
  }

  _render() {
    this.renderer.clear();
    this.renderer.drawGrid();
    for (const b of this.balls) this.renderer.drawBall(b);
    for (const p of this.players) this.renderer.drawPlayer(p);
    this.renderer.drawJoystick(this.input);
    this.renderer.drawHUD(this.scores, this.gameTime, this.mode);
  }
};
