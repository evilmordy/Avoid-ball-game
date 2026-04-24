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

  drawPlayer(p) {
    const ctx = this.ctx;
    if (p.dead) return;
    ctx.save();
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

  drawBall(b) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    if (b.type === 'gold' || b.type === 'green') {
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12;
    }
    if (b.type === 'red') {
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;
    }
    ctx.fill();
    ctx.restore();
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
    ctx.beginPath();
    ctx.arc(input.touchCX, input.touchCY, input.touchR, 0, Math.PI * 2);
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
    ctx.font = 'bold 16px "Courier New", monospace';
    if (mode === 'dual') {
      ctx.fillText(`P1  ${scores[0]} 分`, 20, 35);
      ctx.fillText(`P2  ${scores[1]} 分`, 20, 60);
      ctx.fillText(`时间  ${Math.floor(time)}s`, 20, 85);
    } else {
      ctx.fillText(`得分  ${scores[0]}`, 20, 35);
      ctx.fillText(`时间  ${Math.floor(time)}s`, 20, 60);
    }
    ctx.restore();
  }
};
