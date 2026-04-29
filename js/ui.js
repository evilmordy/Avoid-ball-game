DodgeBall.UI = class UI {
  constructor() {
    this.overlay = document.getElementById('overlay');
    this.titleEl = document.getElementById('title');
    this.subEnEl = document.getElementById('subtitleEn');
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

  _basic(title, subEn, sub, btn1t, btn1c, btn1f, btn2t, btn2c, btn2f) {
    this._clear();
    this.rulesEl.innerHTML = '';
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = title;
    this.subEnEl.textContent = subEn || '';
    this.subEl.textContent = sub;
    this.btn1.textContent = btn1t;
    this.btn1.className = 'btn ' + btn1c;
    this.btn1.onclick = btn1f;
    this.btn1.style.display = 'inline-block';
    if (btn2t) {
      this.btn2.textContent = btn2t;
      this.btn2.className = 'btn ' + btn2c;
      this.btn2.onclick = btn2f;
      this.btn2.style.display = 'inline-block';
    }
  }

  _makeRule(label, color, isSquare, extra) {
    const d = document.createElement('div');
    d.className = 'rule-row';
    const dot = document.createElement('span');
    dot.className = 'dot' + (isSquare ? ' square' : '');
    dot.style.background = color;
    dot.style.boxShadow = '0 0 5px ' + color;
    d.appendChild(dot);
    const t = document.createElement('span');
    t.textContent = label;
    d.appendChild(t);
    if (extra) {
      const e = document.createElement('span');
      e.style.cssText = 'color:rgba(255,255,255,0.30);font-size:12px';
      e.textContent = extra;
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
    this.titleEl.textContent = '躲避小球';
    this.subEnEl.textContent = 'DODGE THE BALL';
    this.subEl.textContent = '方向键移动  |  P1 \u2190\u2191\u2192\u2193 / P2 WASD  |  HP 5  |  空格暂停';

    this.rulesEl.innerHTML = '';
    this.rulesEl.appendChild(this._makeRule('\u7ea2\u7403', '#ff4444', false, '\u6263 1 \u6ef4\u8840'));
    this.rulesEl.appendChild(this._makeRule('\u8ffd\u8e2a\u7403', '#ff8800', false, '\u7f13\u6162\u8ddf\u8e2a\uff0c\u6263\u8840\uff08\u4e0a\u9650 x0.6\uff09'));
    this.rulesEl.appendChild(this._makeRule('\u5206\u88c2\u7403', '#ff00ff', false, '\u6570\u79d2\u540e\u53d8 3 \u4e2a\u5c0f\u7ea2\u7403'));
    this.rulesEl.appendChild(this._makeRule('\u91d1\u7403', '#ffd700', false, '+10 \u5206'));
    this.rulesEl.appendChild(this._makeRule('\u7eff\u7403', '#44ff44', false, '+60 \u5206\uff0c\u4f53\u578b\u53d8\u5927'));
    this.rulesEl.appendChild(this._makeSep());
    this.rulesEl.appendChild(this._makeRule('\u62a4\u76fe S', '#44aaff', true, '\u514d\u75ab 10s\uff084min \u540e 6s\uff09'));
    this.rulesEl.appendChild(this._makeRule('\u52a0\u901f Z', '#ffff44', true, '\u79fb\u901f x1.5 / 4.5s'));
    this.rulesEl.appendChild(this._makeRule('\u7f29\u5c0f V', '#44ff88', true, '\u7acb\u5373\u53d8\u5c0f'));
    this.rulesEl.appendChild(this._makeRule('\u7231\u5fc3 H', '#ff4466', true, '\u56de 1 \u6ef4\u8840'));
    this.rulesEl.appendChild(this._makeSep());
    this.rulesEl.appendChild(this._makeRule('\u8fde\u51fb', '#ffd700', false, '\u6536\u7403 \u00d75 \u2192 \u500d\u7387 +1\uff0c\u6700\u9ad8 \u00d75'));

    const make = (txt, cls, fn) => {
      const b = document.createElement('button');
      b.textContent = txt;
      b.className = 'btn ' + cls;
      b.onclick = fn;
      return b;
    };
    this.btnGroup.appendChild(make('\u7b80  \u5355', 'btn-easy', onEasy));
    this.btnGroup.appendChild(make('\u5e38  \u89c4', 'btn-normal', onNormal));
    this.btnGroup.appendChild(make('\u56f0  \u96be', 'btn-hard', onHard));
  }

  showModeSelect(onSingle, onDual, onTimeAttack) {
    this._clear();
    this.rulesEl.innerHTML = '';
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = '\u9078\u64c7\u6a21\u5f0f';
    this.subEnEl.textContent = 'SELECT MODE';
    this.subEl.textContent = '';

    const make = (txt, cls, fn) => {
      const b = document.createElement('button');
      b.textContent = txt;
      b.className = 'btn ' + cls;
      b.onclick = fn;
      return b;
    };
    this.btnGroup.appendChild(make('\u5355\u4eba\u6a21\u5f0f', 'btn-primary', onSingle));
    this.btnGroup.appendChild(make('\u53cc\u4eba\u6a21\u5f0f', 'btn-secondary', onDual));
    this.btnGroup.appendChild(make('\u9650\u65f6\u6311\u6218', 'btn-green', onTimeAttack));
  }

  showPaused(onResume) {
    this._basic('\u6682\u505c', 'PAUSED', '\u6309 \u7a7a\u683c \u6216\u70b9\u51fb\u6309\u94ae\u7ee7\u7eed',
      '\u7ee7\u7eed\u6e38\u620f', 'btn-resume', onResume);
  }

  showGameOver(text, onRestart, isWin) {
    const title = isWin ? '\u5b58\u6d3b\u6210\u529f\uff01' : '\u6e38\u620f\u7ed3\u675f';
    const en = isWin ? 'VICTORY' : 'GAME OVER';
    const cls = isWin ? 'btn-green' : 'btn-restart';
    const label = isWin ? '\u518d\u6765\u4e00\u5c40' : '\u91cd\u65b0\u5f00\u59cb';
    this._basic(title, en, text, label, cls, onRestart);
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
