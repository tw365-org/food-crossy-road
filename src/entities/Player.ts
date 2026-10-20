import { Direction } from '../core/Input';
import { ProceduralArt } from '../render/ProceduralArt';
import { Platform } from './Platform';

export class Player {
  public gridX: number = 4;
  public gridY: number = 0; // 0 表示起點行 (最下方)
  
  public pixelX: number = 0;
  public pixelY: number = 0;
  private startPixelX: number = 0;
  private startPixelY: number = 0;
  private targetPixelX: number = 0;
  private targetPixelY: number = 0;

  public size: number = 38;
  public direction: Direction = 'up';

  // 平滑跳躍與彈跳動畫參數
  public isJumping: boolean = false;
  private jumpProgress: number = 0;
  private readonly jumpSpeed: number = 7.5; // 約 130ms 完成一跳
  private readonly maxJumpHeight: number = 22;

  // 乘載浮島物理
  public currentPlatform: Platform | null = null;

  // 狀態
  public isDead: boolean = false;
  public deathReason: 'car' | 'water' | 'timeout' | null = null;
  public deathTimer: number = 0;

  constructor(initialGridX: number = 4, initialGridY: number = 0) {
    this.reset(initialGridX, initialGridY);
  }

  public reset(gridX: number = 4, gridY: number = 0) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.direction = 'up';
    this.isJumping = false;
    this.jumpProgress = 0;
    this.isDead = false;
    this.deathReason = null;
    this.deathTimer = 0;
    this.currentPlatform = null;
  }

  public setScreenPosition(x: number, y: number) {
    this.pixelX = x;
    this.pixelY = y;
    this.startPixelX = x;
    this.startPixelY = y;
    this.targetPixelX = x;
    this.targetPixelY = y;
  }

  /**
   * 觸發跳向新網格
   */
  public jumpTo(nextGridX: number, nextGridY: number, targetX: number, targetY: number, dir: Direction) {
    if (this.isDead) return;

    this.direction = dir;
    this.gridX = nextGridX;
    this.gridY = nextGridY;

    this.startPixelX = this.pixelX;
    this.startPixelY = this.pixelY;
    this.targetPixelX = targetX;
    this.targetPixelY = targetY;

    this.isJumping = true;
    this.jumpProgress = 0;
    this.currentPlatform = null; // 跳躍瞬間離開浮台
  }

  public die(reason: 'car' | 'water' | 'timeout') {
    if (this.isDead) return;
    this.isDead = true;
    this.deathReason = reason;
    this.deathTimer = 0;
    this.currentPlatform = null;
  }

  public update(dt: number) {
    if (this.isDead) {
      this.deathTimer += dt;
      return;
    }

    // 隨竹筏/蒸籠浮動
    if (this.currentPlatform && !this.isJumping) {
      this.pixelX += this.currentPlatform.speed * dt;
      this.targetPixelX = this.pixelX;
      this.startPixelX = this.pixelX;
    }

    // 跳躍補間動畫 (拋物線與彈性形變)
    if (this.isJumping) {
      this.jumpProgress += this.jumpSpeed * dt;

      if (this.jumpProgress >= 1) {
        this.jumpProgress = 1;
        this.isJumping = false;
        this.pixelX = this.targetPixelX;
        this.pixelY = this.targetPixelY;
      } else {
        // 線性插值平滑位置
        this.pixelX = this.startPixelX + (this.targetPixelX - this.startPixelX) * this.jumpProgress;
        this.pixelY = this.startPixelY + (this.targetPixelY - this.startPixelY) * this.jumpProgress;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.isDead) {
      this.drawDeathAnimation(ctx);
      return;
    }

    // 計算拋物線跳躍高度
    let jumpHeight = 0;
    let squashX = 1;
    let squashY = 1;

    if (this.isJumping) {
      // 拋物線 sin(pi * p)
      jumpHeight = Math.sin(this.jumpProgress * Math.PI) * this.maxJumpHeight;

      // 擠壓回彈 (Takeoff & Landing Squash, Mid-air Stretch)
      if (this.jumpProgress < 0.25) {
        squashX = 1.15;
        squashY = 0.85;
      } else if (this.jumpProgress < 0.75) {
        squashX = 0.9;
        squashY = 1.15;
      } else {
        squashX = 1.1;
        squashY = 0.9;
      }
    }

    ProceduralArt.drawDog(
      ctx,
      this.pixelX,
      this.pixelY,
      this.size,
      this.direction,
      jumpHeight,
      squashX,
      squashY
    );
  }

  private drawDeathAnimation(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.pixelX + this.size / 2, this.pixelY + this.size / 2);

    if (this.deathReason === 'water') {
      // 落水水花波紋擴散
      const rippleSize = Math.min(30, this.deathTimer * 40);
      const alpha = Math.max(0, 1 - this.deathTimer * 1.5);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, rippleSize, 0, Math.PI * 2);
      ctx.stroke();

      // 小狗旋轉下沉
      const sinkScale = Math.max(0, 1 - this.deathTimer * 2);
      ctx.scale(sinkScale, sinkScale);
      ctx.rotate(this.deathTimer * 8);
      ProceduralArt.drawDog(ctx, -this.size / 2, -this.size / 2, this.size, this.direction);
    } else {
      // 車撞扁平或眩暈星星
      const squash = Math.max(0.2, 1 - this.deathTimer * 2.5);
      ctx.scale(1.3, squash);
      ProceduralArt.drawDog(ctx, -this.size / 2, -this.size / 2, this.size, this.direction);

      // 眩暈星星旋轉
      const starAngle = this.deathTimer * 6;
      ctx.fillStyle = '#ECC94B';
      for (let i = 0; i < 3; i++) {
        const a = starAngle + (i * Math.PI * 2) / 3;
        const sx = Math.cos(a) * 20;
        const sy = Math.sin(a) * 10 - 15;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
