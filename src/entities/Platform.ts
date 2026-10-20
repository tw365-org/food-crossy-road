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
   * 判定角色是否乘載於浮台上
   * @param px 角色左上角 X
   * @param py 角色左上角 Y
   * @param pSize 角色尺寸
   * @param tolerance 可選：邊界寬容度 (如柴犬拒否犬抗水流特性可達 18px，預設 6px)
   */
  public contains(px: number, py: number, pSize: number, tolerance: number = 6): boolean {
    const centerX = px + pSize / 2;
    const centerY = py + pSize / 2;
    return (
      centerX >= this.x - tolerance &&
      centerX <= this.x + this.width + tolerance &&
      centerY >= this.y - 4 &&
      centerY <= this.y + this.height + 4
    );
  }
}
