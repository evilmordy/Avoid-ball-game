DodgeBall.UI = class UI {
  constructor() {
    this.overlay = document.getElementById('overlay');
    this.titleEl = document.getElementById('title');
    this.subEl = document.getElementById('subtitle');
    this.btnGroup = document.getElementById('btn-group');
    this.btn1 = document.getElementById('btn-primary');
    this.btn2 = document.getElementById('btn-secondary');
  }

  _clearButtons() {
    this.btn1.style.display = 'none';
    this.btn2.style.display = 'none';
    while (this.btnGroup.children.length > 2) {
      this.btnGroup.removeChild(this.btnGroup.lastChild);
    }
  }

  _show(title, sub, btn1Text, btn1Class, btn1Fn, btn2Text, btn2Class, btn2Fn) {
    this._clearButtons();
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
    }
  }

  showDifficultySelect(onEasy, onNormal, onHard) {
    this._clearButtons();
    this.overlay.style.display = 'flex';
    this.titleEl.textContent = '选择难度';
    this.subEl.textContent = '决定刷新频率与绿球成长幅度';

    const createBtn = (text, cls, fn) => {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.className = 'btn ' + cls;
      btn.onclick = fn;
      return btn;
    };

    this.btnGroup.appendChild(createBtn('简  单', 'btn-green', onEasy));
    this.btnGroup.appendChild(createBtn('常  规', 'btn-primary', onNormal));
    this.btnGroup.appendChild(createBtn('困  难', 'btn-danger', onHard));
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
