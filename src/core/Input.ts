export type Direction = 'up' | 'down' | 'left' | 'right';

export class InputManager {
  private moveQueue: Direction[] = [];
  private onPauseCallback: (() => void) | null = null;
  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor(canvasElement: HTMLCanvasElement, onPause?: () => void) {
    if (onPause) this.onPauseCallback = onPause;
    this.bindKeyboard();
    this.bindTouch(canvasElement);
    this.bindDpad();
  }

  private bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'KeyW':
        case 'w':
        case 'W':
          e.preventDefault();
          this.queueMove('up');
          break;
        case 'ArrowDown':
        case 'KeyS':
        case 's':
        case 'S':
          e.preventDefault();
          this.queueMove('down');
          break;
        case 'ArrowLeft':
        case 'KeyA':
        case 'a':
        case 'A':
          e.preventDefault();
          this.queueMove('left');
          break;
        case 'ArrowRight':
        case 'KeyD':
        case 'd':
        case 'D':
          e.preventDefault();
          this.queueMove('right');
          break;
        case 'Escape':
          e.preventDefault();
          if (this.onPauseCallback) this.onPauseCallback();
          break;
      }
    });
  }

  private bindTouch(canvas: HTMLCanvasElement) {
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const dx = e.changedTouches[0].clientX - this.touchStartX;
        const dy = e.changedTouches[0].clientY - this.touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        // 滑動判定
        if (Math.max(absX, absY) > 28) {
          if (absX > absY) {
            this.queueMove(dx > 0 ? 'right' : 'left');
          } else {
            this.queueMove(dy > 0 ? 'down' : 'up');
          }
        } else {
          // 輕點畫面預設為往前跳一步 (仿造原版 fofo-game)
          this.queueMove('up');
        }
      }
    }, { passive: true });
  }

  private bindDpad() {
    const dpadButtons = document.querySelectorAll<HTMLButtonElement>('.dpad button');
    dpadButtons.forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const dir = btn.getAttribute('data-dir') as Direction;
        if (dir) {
          this.queueMove(dir);
        }
      });
    });
  }

  public queueMove(dir: Direction) {
    // 限制佇列最多緩存 2 個按鍵動作，確保操作靈活不卡頓
    if (this.moveQueue.length < 2) {
      this.moveQueue.push(dir);
    }
  }

  public consumeMove(): Direction | null {
    return this.moveQueue.shift() || null;
  }

  public clear() {
    this.moveQueue = [];
  }
}
