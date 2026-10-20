import { Direction } from '../core/Input';
import { ProceduralArt } from '../render/ProceduralArt';
import { Platform } from './Platform';
import { AssetLoader } from '../core/AssetLoader';
import { ParticleSystem } from '../render/ParticleSystem';
import { DogBreed, DOG_BREEDS } from './DogBreeds';

export class Player {
  public gridX: number = 4;
  public gridY: number = 0;
  
  public pixelX: number = 0;
  public pixelY: number = 0;
  private startPixelX: number = 0;
  private startPixelY: number = 0;
  private targetPixelX: number = 0;
  private targetPixelY: number = 0;

  public size: number = 42;
  public hitboxRadius: number = 16;
  public direction: Direction = 'up';

  // 當前選用之狗狗品種
  public currentBreed: DogBreed = DOG_BREEDS[0];

  // 品種被動特異狀態
  public hasShield: boolean = false;           // 黃金獵犬聖盾
  public shieldActive: boolean = false;

  // 平滑跳躍與彈跳動畫參數
  public isJumping: boolean = false;
  private jumpProgress: number = 0;
  private jumpSpeed: number = 8.0;
  private readonly maxJumpHeight: number = 24;

  // 乘載浮島物理
  public currentPlatform: Platform | null = null;

  // 狀態
  public isDead: boolean = false;
  public deathReason: 'car' | 'water' | 'timeout' | null = null;
  public deathTimer: number = 0;
  public isVictory: boolean = false;

  private idleTimer: number = 0;
  public particleSystem: ParticleSystem | null = null;

  constructor(initialGridX: number = 4, initialGridY: number = 0) {
    this.setBreed(DOG_BREEDS[0]);
    this.reset(initialGridX, initialGridY);
  }

  public setBreed(breed: DogBreed) {
    this.currentBreed = breed;
    this.size = breed.renderSize;
    this.hitboxRadius = breed.hitboxRadius;
    this.jumpSpeed = breed.jumpSpeed;

    // 若是黃金獵犬，賦予初始聖盾
    if (breed.id === 'dog_golden') {
      this.hasShield = true;
      this.shieldActive = true;
    } else {
      this.hasShield = false;
      this.shieldActive = false;
    }
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

    if (this.currentBreed.id === 'dog_golden') {
      this.shieldActive = true;
    }
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

    // 起跳微塵粒子 (邊牧自帶藍色風流殘影)
    if (this.particleSystem) {
      this.particleSystem.emitDust(this.pixelX + this.size / 2, this.pixelY + this.size - 4, 4);
    }
  }

  public die(reason: 'car' | 'water' | 'timeout'): boolean {
    if (this.isDead) return false;

    // 黃金獵犬聖盾抵擋致命一擊
    if (this.shieldActive && reason !== 'timeout') {
      this.shieldActive = false;
      if (this.particleSystem) {
        this.particleSystem.emitVictory(this.pixelX + this.size / 2, this.pixelY + this.size / 2, 8);
      }
      return false; // 免疫死亡！
    }

    // 法國鬥牛犬 30% 噸位彈開抵擋
    if (this.currentBreed.id === 'dog_frenchie' && reason === 'car' && Math.random() < 0.3) {
      if (this.particleSystem) {
        this.particleSystem.emitDust(this.pixelX + this.size / 2, this.pixelY + this.size / 2, 6);
      }
      return false; // 彈開成功！
    }

    this.isDead = true;
    this.deathReason = reason;
    this.deathTimer = 0;
    this.currentPlatform = null;

    if (reason === 'water' && this.particleSystem) {
      this.particleSystem.emitSplash(this.pixelX + this.size / 2, this.pixelY + this.size / 2, 10);
    }

    return true; // 判定真正死亡
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
    // 預設採用具備 10 種真實品種外觀與專屬毛色的 Procedural 渲染
    // 若為原始台灣土黃狗且有精靈圖檔，可使用精靈圖，其餘 9 種名犬均以高規格程式化毛色、配件與專屬尺寸繪製
    if (this.currentBreed.id === 'dog_yellow') {
      const loader = AssetLoader.getInstance();
      const spriteSheet = loader.getImage('dog');
      if (spriteSheet) {
        this.drawPixelSprite(ctx, spriteSheet);
        return;
      }
    }

    this.drawBreedProcedural(ctx);
  }

  private drawBreedProcedural(ctx: CanvasRenderingContext2D) {
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
      squashY,
      this.currentBreed,
      this.shieldActive
    );
  }

  private drawPixelSprite(ctx: CanvasRenderingContext2D, sprite: HTMLImageElement) {
    const frameW = 32;
    const frameH = 32;

    let row = 0;
    let col = 0;

    if (this.isVictory) {
      row = 4;
      col = 2;
    } else if (this.isDead) {
      row = 4;
      col = this.deathReason === 'water' ? 1 : 0;
    } else {
      if (this.direction === 'up') row = 0;
      else if (this.direction === 'down') row = 1;
      else if (this.direction === 'left') row = 2;
      else if (this.direction === 'right') row = 3;

      if (this.isJumping) {
        if (this.jumpProgress < 0.3) col = 1;
        else if (this.jumpProgress < 0.7) col = 2;
        else col = 3;
      } else {
        const idleCycle = Math.floor(this.idleTimer * 3) % 8;
        col = (idleCycle === 0 || idleCycle === 1) ? 1 : 0;
      }
    }

    let jumpY = 0;
    if (this.isJumping) {
      jumpY = Math.sin(this.jumpProgress * Math.PI) * this.maxJumpHeight;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // 地面影子
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
}
