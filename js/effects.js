DodgeBall.Effects = class Effects {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bg = [];
    this.trail = [];
    this.ripples = [];
    this.splashes = [];
    this.flashes = [];
    this.mx = -9999; this.my = -9999;
    this._px = -9999; this._py = -9999;
    this._timer = 0;
    this.running = false;
    this._colors = ['#4da6ff', '#88ccff', '#ffffff', '#66aadd', '#aaddff', '#44bbff'];
    this._rippleColors = ['#4da6ff', '#88ccff', '#66bbff', '#aaddff'];
    this._initBG();
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  start() { this.running = true; this._loop(); }
  stop() { this.running = false; }

  _initBG() {
    for (let i = 0; i < 120; i++) {
      this.bg.push({
        x: Math.random() * 2000, y: Math.random() * 1400,
        r: 0.2 + Math.random() * 2.5,
        a: 0.06 + Math.random() * 0.3,
        s: 0.06 + Math.random() * 0.5,
        p: Math.random() * Math.PI * 2,
        color: Math.random() < 0.25 ? '#4da6ff' : '#ffffff'
      });
    }
  }

  move(x, y) {
    const dx = x - this._px;
    const dy = y - this._py;
    const dd = dx * dx + dy * dy;
    if (dd < 1) return;

    this.mx = x; this.my = y;

    this._timer -= 16.667;
    if (this._timer > 0) return;
    this._timer = 2;

    const n = Math.min(10, Math.floor(Math.sqrt(dd) / 2) + 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.2 + Math.random() * 3.2;
      const c = this._colors[Math.floor(Math.random() * this._colors.length)];
      this.trail.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.0,
        r: 1.8 + Math.random() * 4.5,
        a: 0.6 + Math.random() * 0.4,
        life: 450 + Math.random() * 450,
        maxLife: 450 + Math.random() * 450,
        color: c
      });
    }
    this._px = x; this._py = y;
  }

  ripple(x, y) {
    const colors = ['#4da6ff', '#88ccff', '#ffd700', '#44ff88', '#ffffff'];
    for (let i = 0; i < 4; i++) {
      this.ripples.push({
        x, y, delay: i * 50,
        r: 0, maxR: 40 + i * 40 + Math.random() * 25,
        a: 0.6 - i * 0.13,
        life: 350 + i * 120 + Math.random() * 200,
        maxLife: 350 + i * 120 + Math.random() * 200,
        color: this._rippleColors[i % this._rippleColors.length]
      });
    }

    for (let i = 0; i < 22; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 5;
      const c = i < 6 ? '#4da6ff' : i < 12 ? '#88ccff' : i < 18 ? '#ffd700' : '#ffffff';
      this.splashes.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: 1.2 + Math.random() * 3,
        a: 0.75 + Math.random() * 0.25,
        life: 350 + Math.random() * 350,
        maxLife: 350 + Math.random() * 350,
        color: c,
        g: 0.04 + Math.random() * 0.06
      });
    }

    this.flashes.push({
      x, y, r: 0, maxR: 25 + Math.random() * 15,
      a: 0.9, life: 280, maxLife: 280
    });
  }

  _loop() {
    if (!this.running) return;
    this._update();
    this._draw();
    requestAnimationFrame(() => this._loop());
  }

  _update() {
    const W = this.canvas.width, H = this.canvas.height;

    for (const p of this.bg) {
      p.x += Math.cos(p.p) * p.s;
      p.y += Math.sin(p.p) * p.s * 0.3;
      p.p += 0.003;
      if (p.x < -30) p.x = W + 30;
      if (p.x > W + 30) p.x = -30;
      if (p.y < -30) p.y = H + 30;
      if (p.y > H + 30) p.y = -30;
    }

    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.012;
      p.life -= 16.667;
      if (p.life <= 0) this.trail.splice(i, 1);
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const p = this.ripples[i];
      if (p.delay > 0) { p.delay -= 16.667; continue; }
      p.r += (p.maxR - p.r) * 0.07;
      p.life -= 16.667;
      if (p.life <= 0) this.ripples.splice(i, 1);
    }

    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const p = this.splashes[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.g;
      p.life -= 16.667;
      if (p.life <= 0) this.splashes.splice(i, 1);
    }

    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const p = this.flashes[i];
      p.r += (p.maxR - p.r) * 0.15;
      p.life -= 16.667;
      if (p.life <= 0) this.flashes.splice(i, 1);
    }
  }

  _draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    for (const p of this.bg) {
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.r * 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const p of this.flashes) {
      const r = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = p.a * r;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#4da6ff';
      ctx.shadowBlur = p.r * 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const p of this.trail) {
      const r = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = p.a * r;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.r * 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.4 + 0.6 * r), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const p of this.splashes) {
      const r = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = p.a * r;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.r * 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const p of this.ripples) {
      if (p.delay > 0) continue;
      const r = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = p.a * r;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5 + 3 * r;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 14 * r;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
};
