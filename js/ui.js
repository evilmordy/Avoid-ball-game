DodgeBall.UI = class UI {
  constructor() {
    this.overlay = document.getElementById('overlay');
    this.titleEl = document.getElementById('title');
    this.subEl = document.getElementById('subtitle');
    this.rulesEl = document.getElementById('rules');
    this.btnGroup = document.getElementById('btn-group');
    this.btn1 = document.getElementById('btn-primary');
    this.btn2 = document.getElementById('btn-secondary');
    this.pauseBtn = document.getElementById('mobile-pause-btn');
    this._pauseCb = null;

    if (this.pauseBtn) {
      const fn = () => { if (this._pauseCb) this._pauseCb(); };
      this.pauseBtn.addEventListener('click', fn);
      this.pauseBtn.addEventListener('touchstart', (e) => { e.preventDefault(); fn(); });
    }
  }

  _clear() {
    this.btn1.style.display = 'none';
    this.btn2.style.display = 'none';
    while (this.btnGroup.children.length > 2) {
      this.btnGroup.removeChild(this.btnGroup.lastChild);
    }
  }

  _show(title, sub, b1t, b1c, b1f, b2t, b2c, b2f) {
    this._clear();
    this.rulesEl.innerHTML = '';
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = title;
    this.subEl.textContent = sub;
    this.btn1.textContent = b1t;
    this.btn1.className = 'btn ' + b1c;
    this.btn1.onclick = b1f;
    this.btn1.style.display = 'inline-block';
    if (b2t) {
      this.btn2.textContent = b2t;
      this.btn2.className = 'btn ' + b2c;
      this.btn2.onclick = b2f;
      this.btn2.style.display = 'inline-block';
    }
  }

  _makeRule(label, color, isSquare, extra) {
    const d = document.createElement('div');
    d.className = 'rule-row';
    const dot = document.createElement('span');
    dot.className = 'dot' + (isSquare ? ' square' : '');
    dot.style.background = color;
    dot.style.boxShadow = '0 0 6px ' + color;
    d.appendChild(dot);
    const t = document.createElement('span');
    t.textContent = label;
    d.appendChild(t);
    if (extra) {
      const e = document.createElement('span');
      e.style.cssText = 'color:rgba(255,255,255,0.35);font-size:12px';
      e.textContent = '  ' + extra;
      d.appendChild(e);
    }
    return d;
  }

  _makeSep() {
    const hr = document.createElement('hr');
    hr.className = 'sep';
    return hr;
  }

  showDifficultySelect(onEasy, onNormal, onHard) {
    this._clear();
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = '选择难度';
    this.subEl.textContent = '方向键移动 | P1 方向键 / P2 WASD | HP: 5 / 暂停: 空格';

    this.rulesEl.innerHTML = '';
    this.rulesEl.appendChild(this._makeRule('红球 - 扣 1 滴血', '#ff4444', false));
    this.rulesEl.appendChild(this._makeRule('橙色追踪球 - 缓慢跟踪，扣血', '#ff8800', false));
    this.rulesEl.appendChild(this._makeRule('紫色分裂球 - 分裂为 3 个小红球', '#ff00ff', false));
    this.rulesEl.appendChild(this._makeRule('金色球 - +10 分', '#ffd700', false));
    this.rulesEl.appendChild(this._makeRule('绿色球 - +60 分，体型变大', '#44ff44', false));
    this.rulesEl.appendChild(this._makeSep());
    this.rulesEl.appendChild(this._makeRule('S 护盾 - 免疫伤害 5s', '#44aaff', true));
    this.rulesEl.appendChild(this._makeRule('Z 加速 - 移速 x1.5', '#ffff44', true));
    this.rulesEl.appendChild(this._makeRule('V 缩小 - 立即缩小', '#44ff88', true));
    this.rulesEl.appendChild(this._makeSep());
    this.rulesEl.appendChild(this._makeRule('连击 - 连续吃金/绿球，每 5 次倍率 +1，最高 x5', '#ffd700', false));

    const make = (txt, cls, fn) => {
      const b = document.createElement('button');
      b.textContent = txt;
      b.className = 'btn ' + cls;
      b.onclick = fn;
      return b;
    };
    this.btnGroup.appendChild(make('简  单', 'btn-green', onEasy));
    this.btnGroup.appendChild(make('常  规', 'btn-primary', onNormal));
    this.btnGroup.appendChild(make('困  难', 'btn-danger', onHard));
  }

  showModeSelect(onSingle, onDual, onTimeAttack) {
    this._clear();
    this.rulesEl.innerHTML = '';
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = '躲避小球';
    this.subEl.textContent = '选择游戏模式';

    const make = (txt, cls, fn) => {
      const b = document.createElement('button');
      b.textContent = txt;
      b.className = 'btn ' + cls;
      b.onclick = fn;
      return b;
    };
    this.btnGroup.appendChild(make('单人模式', 'btn-primary', onSingle));
    this.btnGroup.appendChild(make('双人模式', 'btn-secondary', onDual));
    this.btnGroup.appendChild(make('限时挑战', 'btn-green', onTimeAttack));
  }

  showPaused(onResume) {
    this._show('暂停中', '按 空格 或点击按钮继续', '继续游戏', 'btn-resume', onResume);
  }

  showGameOver(text, onRestart, isWin) {
    const title = isWin ? '存活成功!' : '游戏结束';
    const cls = isWin ? 'btn-green' : 'btn-restart';
    const label = isWin ? '再来一局' : '重新开始';
    this._show(title, text, label, cls, onRestart);
  }

  hide() { this.overlay.style.display = 'none'; }

  showPauseBtn(cb) {
    this._pauseCb = cb;
    if (this.pauseBtn) this.pauseBtn.style.display = 'flex';
  }

  hidePauseBtn() {
    this._pauseCb = null;
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';
  }
};
