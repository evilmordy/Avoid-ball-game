DodgeBall.Renderer = class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  clear() {
    const ctx = this.ctx;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStars(stars) {
    const ctx = this.ctx;
    for (const s of stars) {
      ctx.save();
      ctx.globalAlpha = s.a;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= this.canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= this.canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y); ctx.stroke();
    }
    ctx.restore();
  }

  drawBall(b) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    if (b.type === 'gold' || b.type === 'green') ctx.shadowBlur = 12;
    else ctx.shadowBlur = 6;
    ctx.shadowColor = b.color;
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(p) {
    if (p.dead) return;
    const ctx = this.ctx;
    ctx.save();

    if (p.hasShield) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2 + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(68,170,255,0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.lineWidth = 7;
      ctx.strokeStyle = 'rgba(68,170,255,0.2)';
      ctx.stroke();
    }

    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  }

  drawParticles(particles) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawPowerups(items) {
    const ctx = this.ctx;
    for (const pw of items) {
      ctx.save();
      ctx.translate(pw.x, pw.y);
      ctx.scale(pw.pulseScale, pw.pulseScale);

      ctx.fillStyle = pw.color;
      ctx.globalAlpha = 0.2;
      ctx.shadowColor = pw.color;
      ctx.shadowBlur = 10;

      if (pw.type === 'heal') {
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(-8, -6, -14, 2, 0, 10);
        ctx.bezierCurveTo(14, 2, 8, -6, 0, 4);
        ctx.fill();
        ctx.strokeStyle = pw.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, pw.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = pw.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px "Courier New", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pw.label, 0, 1);
      ctx.restore();
    }
  }

  drawJoystick(input) {
    if (!input.touchActive) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(input.touchCX, input.touchCY, input.touchR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.shadowColor = 'rgba(255,255,255,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(input.touchKnobCX, input.touchKnobCY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawHUD(scores, time, mode) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 16px "Courier New", sans-serif';
    if (mode === 'dual') {
      ctx.fillText('P1 ' + scores[0] + '分', 20, 35);
      ctx.fillText('P2 ' + scores[1] + '分', 20, 60);
      ctx.fillText('时间 ' + Math.floor(time) + 's', 20, 85);
    } else {
      ctx.fillText('得分 ' + scores[0], 20, 35);
      ctx.fillText('时间 ' + Math.floor(time) + 's', 20, 60);
    }
    ctx.restore();
  }

  drawHP(players) {
    const ctx = this.ctx;
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (p.dead) continue;
      ctx.save();
      const bw = 100, bh = 8;
      const x = this.canvas.width - bw - 15;
      const y = 12 + i * 22;
      const ratio = Math.max(0, p.hp / p.maxHP);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(x, y, bw, bh);
      ctx.fillStyle = ratio > 0.5 ? '#44ff44' : ratio > 0.2 ? '#ffaa00' : '#ff4444';
      ctx.fillRect(x, y, bw * ratio, bh);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, bw, bh);
      ctx.fillStyle = '#fff';
      ctx.font = '10px "Courier New", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText((i === 0 ? 'P1' : 'P2') + ' ' + p.hp + '/' + p.maxHP, x - 5, y + 7);
      ctx.restore();
    }
  }

  drawCombo(n, m) {
    if (n < 2) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px "Courier New", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255,215,0,0.6)';
    ctx.shadowBlur = 15;
    ctx.fillText('x' + m, this.canvas.width / 2, 55);
    ctx.restore();
  }

  drawTimeAttack(remaining, total) {
    if (remaining <= 0) return;
    const ctx = this.ctx;
    ctx.save();
    const bw = 160, bh = 6;
    const x = (this.canvas.width - bw) / 2;
    const y = this.canvas.height - 15;
    const r = remaining / total;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = r > 0.3 ? '#44ff44' : r > 0.1 ? '#ffaa00' : '#ff4444';
    ctx.fillRect(x, y, bw * r, bh);
    ctx.fillStyle = '#fff';
    ctx.font = '13px "Courier New", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(remaining) + 's', this.canvas.width / 2, y - 4);
    ctx.restore();
  }
};
