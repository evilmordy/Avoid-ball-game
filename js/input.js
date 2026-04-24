DodgeBall.Input = class Input {
  constructor(canvas) {
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

    this._canvas = canvas;
    this._touchActive = false;
    this._touchDX = 0;
    this._touchDY = 0;
    this._touchR = 80;

    this._touchCX = 0;
    this._touchCY = 0;
    this._touchKnobCX = 0;
    this._touchKnobCY = 0;

    this._onTouchStart = (e) => {
      e.preventDefault();
      const rect = this._canvas.getBoundingClientRect();
      const scaleX = this._canvas.width / rect.width;
      const scaleY = this._canvas.height / rect.height;
      const t = e.touches[0];
      this._touchCX = (t.clientX - rect.left) * scaleX;
      this._touchCY = (t.clientY - rect.top) * scaleY;
      this._touchKnobCX = this._touchCX;
      this._touchKnobCY = this._touchCY;
      this._touchActive = true;
      this._updateTouchDir();
    };

    this._onTouchMove = (e) => {
      e.preventDefault();
      if (!this._touchActive) return;
      const rect = this._canvas.getBoundingClientRect();
      const scaleX = this._canvas.width / rect.width;
      const scaleY = this._canvas.height / rect.height;
      const t = e.touches[0];
      this._touchKnobCX = (t.clientX - rect.left) * scaleX;
      this._touchKnobCY = (t.clientY - rect.top) * scaleY;
      this._updateTouchDir();
    };

    this._onTouchEnd = (e) => {
      e.preventDefault();
      this._touchActive = false;
      this._touchDX = 0;
      this._touchDY = 0;
    };

    this._canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this._canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this._canvas.addEventListener('touchend', this._onTouchEnd);
    this._canvas.addEventListener('touchcancel', this._onTouchEnd);
  }

  _updateTouchDir() {
    const dx = this._touchKnobCX - this._touchCX;
    const dy = this._touchKnobCY - this._touchCY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 10) {
      this._touchDX = 0;
      this._touchDY = 0;
    } else {
      const r = Math.min(dist, this._touchR);
      const ratio = r / dist;
      this._touchDX = (dx * ratio) / this._touchR;
      this._touchDY = (dy * ratio) / this._touchR;
    }
  }

  get touchActive() { return this._touchActive; }
  get touchDX() { return this._touchDX; }
  get touchDY() { return this._touchDY; }
  get touchCX() { return this._touchCX; }
  get touchCY() { return this._touchCY; }
  get touchKnobCX() { return this._touchKnobCX; }
  get touchKnobCY() { return this._touchKnobCY; }
  get touchR() { return this._touchR; }

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
    this._canvas.removeEventListener('touchstart', this._onTouchStart);
    this._canvas.removeEventListener('touchmove', this._onTouchMove);
    this._canvas.removeEventListener('touchend', this._onTouchEnd);
    this._canvas.removeEventListener('touchcancel', this._onTouchEnd);
  }
};
