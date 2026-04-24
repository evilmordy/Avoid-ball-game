DodgeBall.Input = class Input {
  constructor() {
    this._keys = {};
    this._justPressed = {};

    this._onKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      if (!this._keys[e.key]) {
        this._justPressed[e.key] = true;
      }
      this._keys[e.key] = true;
    };

    this._onKeyUp = (e) => {
      this._keys[e.key] = false;
    };

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  isDown(key) {
    return !!this._keys[key];
  }

  justPressed(key) {
    return !!this._justPressed[key];
  }

  clearFrame() {
    this._justPressed = {};
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }
};
