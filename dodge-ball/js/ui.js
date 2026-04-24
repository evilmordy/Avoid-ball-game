DodgeBall.UI = class UI {
  constructor() {
    this.overlay = document.getElementById('overlay');
    this.titleEl = document.getElementById('title');
    this.subEl = document.getElementById('subtitle');
    this.btn1 = document.getElementById('btn-primary');
    this.btn2 = document.getElementById('btn-secondary');
  }

  _show(title, sub, btn1Text, btn1Class, btn1Fn, btn2Text, btn2Class, btn2Fn) {
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = title;
    this.subEl.textContent = sub;
    this.btn1.textContent = btn1Text;
    this.btn1.className = 'btn ' + btn1Class;
    this.btn1.onclick = btn1Fn;
    this.btn1.style.display = 'inline-block';
    if (btn2Text) {
      this.btn2.textContent = btn2Text;
      this.btn2.className = 'btn ' + btn2Class;
      this.btn2.onclick = btn2Fn;
      this.btn2.style.display = 'inline-block';
    } else {
      this.btn2.style.display = 'none';
    }
  }

  showModeSelect(onSingle, onDual) {
    this._show('躲避小球', '方向键移动 | P1 方向键 / P2 WASD',
      '单人模式', 'btn-primary', onSingle,
      '双人模式', 'btn-secondary', onDual);
  }

  showPaused(onResume) {
    this._show('暂停中', '按 空格 或点击按钮继续',
      '继续游戏', 'btn-resume', onResume);
  }

  showGameOver(text, onRestart) {
    this._show('游戏结束', text,
      '重新开始', 'btn-restart', onRestart);
  }

  hide() {
    this.overlay.style.display = 'none';
  }
};
