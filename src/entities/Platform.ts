import { ProceduralArt } from '../render/ProceduralArt';

export type PlatformType = 'raft' | 'steamer';

export class Platform {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number;
  public type: PlatformType;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    type: PlatformType = 'raft'
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.type = type;
  }

  public update(dt: number, stageWidth: number) {
    this.x += this.speed * dt;

    // 螢幕外循環重置
    const margin = 100;
    if (this.speed > 0 && this.x > stageWidth + margin) {
      this.x = -this.width - margin;
    } else if (this.speed < 0 && this.x + this.width < -margin) {
      this.x = stageWidth + margin;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.type === 'steamer') {
      ProceduralArt.drawSteamer(ctx, this.x, this.y, this.width, this.height);
    } else {
      ProceduralArt.drawRaft(ctx, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * 判定黃狗是否在浮台上
   */
  public contains(px: number, py: number, pSize: number): boolean {
    const centerX = px + pSize / 2;
    const centerY = py + pSize / 2;
    // 寬裕容錯範圍 (+/- 6px)
    return (
      centerX >= this.x - 6 &&
      centerX <= this.x + this.width + 6 &&
      centerY >= this.y - 4 &&
      centerY <= this.y + this.height + 4
    );
  }
}
