import { Direction } from '../core/Input';
import { ProceduralArt } from '../render/ProceduralArt';
import { Platform } from './Platform';
import { AssetLoader } from '../core/AssetLoader';
import { ParticleSystem } from '../render/ParticleSystem';

export class Player {
  public gridX: number = 4;
  public gridY: number = 0;
  
  public pixelX: number = 0;
  public pixelY: number = 0;
  private startPixelX: number = 0;
  private startPixelY: number = 0;
  private targetPixelX: number = 0;
  private targetPixelY: number = 0;

  public size: number = 42; // 像素精靈顯示尺寸
  public direction: Direction = 'up';

  // 平滑跳躍與彈跳動畫參數
  public isJumping: boolean = false;
  private jumpProgress: number = 0;
  private readonly jumpSpeed: number = 8.0;
  private readonly maxJumpHeight: number = 24;

  // 乘載浮島物理
  public currentPlatform: Platform | null = null;

  // 狀態
  public isDead: boolean = false;
  public deathReason: 'car' | 'water' | 'timeout' | null = null;
  public deathTimer: number = 0;
  public isVictory: boolean = false;

  // 待機眨眼與搖尾計時器
  private idleTimer: number = 0;

  // 外部粒子系統委派
  public particleSystem: ParticleSystem | null = null;

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
    this.isVictory = false;
    this.currentPlatform = null;
    this.idleTimer = 0;
  }

  public setScreenPosition(x: number, y: number) {
    this.pixelX = x;
    this.pixelY = y;
    this.startPixelX = x;
    this.startPixelY = y;
    this.targetPixelX = x;
    this.targetPixelY = y;
  }

  public jumpTo(nextGridX: number, nextGridY: number, targetX: number, targetY: number, dir: Direction) {
    if (this.isDead || this.isVictory) return;

    this.direction = dir;
    this.gridX = nextGridX;
    this.gridY = nextGridY;

    this.startPixelX = this.pixelX;
    this.startPixelY = this.pixelY;
    this.targetPixelX = targetX;
    this.targetPixelY = targetY;

    this.isJumping = true;
    this.jumpProgress = 0;
    this.currentPlatform = null;

    // 起跳微塵粒子
    if (this.particleSystem) {
      this.particleSystem.emitDust(this.pixelX + this.size / 2, this.pixelY + this.size - 4, 4);
    }
  }

  public die(reason: 'car' | 'water' | 'timeout') {
    if (this.isDead) return;
    this.isDead = true;
    this.deathReason = reason;
    this.deathTimer = 0;
    this.currentPlatform = null;

    // 落水水花噴濺
    if (reason === 'water' && this.particleSystem) {
      this.particleSystem.emitSplash(this.pixelX + this.size / 2, this.pixelY + this.size / 2, 10);
    }
  }

  public setVictory() {
    this.isVictory = true;
    if (this.particleSystem) {
      this.particleSystem.emitVictory(this.pixelX + this.size / 2, this.pixelY + this.size / 2, 12);
    }
  }

  public update(dt: number) {
    this.idleTimer += dt;

    if (this.isDead) {
      this.deathTimer += dt;
      return;
    }

    if (this.currentPlatform && !this.isJumping) {
      this.pixelX += this.currentPlatform.speed * dt;
      this.targetPixelX = this.pixelX;
      this.startPixelX = this.pixelX;
    }

    if (this.isJumping) {
      this.jumpProgress += this.jumpSpeed * dt;

      if (this.jumpProgress >= 1) {
        this.jumpProgress = 1;
        this.isJumping = false;
        this.pixelX = this.targetPixelX;
        this.pixelY = this.targetPixelY;

        // 著地時的灰塵回彈粒子
        if (this.particleSystem) {
          this.particleSystem.emitDust(this.pixelX + this.size / 2, this.pixelY + this.size - 4, 3);
        }
      } else {
        this.pixelX = this.startPixelX + (this.targetPixelX - this.startPixelX) * this.jumpProgress;
        this.pixelY = this.startPixelY + (this.targetPixelY - this.startPixelY) * this.jumpProgress;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const loader = AssetLoader.getInstance();
    const spriteSheet = loader.getImage('dog');

    // 若圖片未載入完成或載入失敗，以原版 Procedural 向量繪圖無縫降級兜底
    if (!spriteSheet) {
      this.drawProceduralFallback(ctx);
      return;
    }

    this.drawPixelSprite(ctx, spriteSheet);
  }

  /**
   * 像素精靈圖繪製 (支援 4 方向、跳躍動態與狀態機)
   */
  private drawPixelSprite(ctx: CanvasRenderingContext2D, sprite: HTMLImageElement) {
    const frameW = 32;
    const frameH = 32;

    let row = 0;
    let col = 0;

    // 1. 決定精靈圖的列 (Row) 與欄 (Col)
    if (this.isVictory) {
      row = 4;
      col = 2; // 歡呼勝利高舉雙爪
    } else if (this.isDead) {
      row = 4;
      col = this.deathReason === 'water' ? 1 : 0; // 0: 眩暈星星, 1: 水波狗頭
    } else {
      // 四方向判定
      if (this.direction === 'up') row = 0;
      else if (this.direction === 'down') row = 1;
      else if (this.direction === 'left') row = 2;
      else if (this.direction === 'right') row = 3;

      // 動作幀判定
      if (this.isJumping) {
        // 跳躍時依進度播放起跳(1)、滯空(2)、收腿著地(3)
        if (this.jumpProgress < 0.3) col = 1;
        else if (this.jumpProgress < 0.7) col = 2;
        else col = 3;
      } else {
        // 待機時微幅搖尾 / 眨眼 (每 2 秒一次)
        const idleCycle = Math.floor(this.idleTimer * 3) % 8;
        col = (idleCycle === 0 || idleCycle === 1) ? 1 : 0;
      }
    }

    // 計算拋物線跳躍高度
    let jumpY = 0;
    if (this.isJumping) {
      jumpY = Math.sin(this.jumpProgress * Math.PI) * this.maxJumpHeight;
    }

    ctx.save();
    // 保持像素風格邊緣清晰
    ctx.imageSmoothingEnabled = false;

    // 繪製地面影子
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    const shadowScale = Math.max(0.4, 1 - jumpY / 45);
    ctx.ellipse(
      this.pixelX + this.size / 2,
      this.pixelY + this.size - 4,
      (this.size * 0.35) * shadowScale,
      (this.size * 0.16) * shadowScale,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 繪製本體 (加上跳躍高度位移)
    const drawY = this.pixelY - jumpY;
    ctx.drawImage(
      sprite,
      col * frameW,
      row * frameH,
      frameW,
      frameH,
      this.pixelX,
      drawY,
      this.size,
      this.size
    );

    ctx.restore();
  }

  /**
   * 向量降級繪製
   */
  private drawProceduralFallback(ctx: CanvasRenderingContext2D) {
    let jumpHeight = 0;
    let squashX = 1;
    let squashY = 1;

    if (this.isJumping) {
      jumpHeight = Math.sin(this.jumpProgress * Math.PI) * this.maxJumpHeight;
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
}
