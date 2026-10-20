import { ProceduralArt } from '../render/ProceduralArt';

export type ObstacleType = 'car' | 'taxi' | 'truck' | 'scooter' | 'train';

export class Obstacle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number;
  public type: ObstacleType;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    type: ObstacleType = 'car'
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

    const margin = 120;
    if (this.speed > 0 && this.x > stageWidth + margin) {
      this.x = -this.width - margin;
    } else if (this.speed < 0 && this.x + this.width < -margin) {
      this.x = stageWidth + margin;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.type === 'train') {
      ProceduralArt.drawTrain(ctx, this.x, this.y, this.width, this.height, this.speed);
    } else {
      ProceduralArt.drawVehicle(ctx, this.x, this.y, this.width, this.height, this.type, this.speed);
    }
  }

  /**
   * 碰撞檢測：支援犬種專屬半徑判定箱或標準邊界緩衝
   * @param px 角色左上角 X
   * @param py 角色左上角 Y
   * @param pSize 角色尺寸
   * @param hitboxRadius 可選：犬種專屬判定半徑 (如吉娃娃 10px、金毛 18px)
   */
  public collidesWith(px: number, py: number, pSize: number, hitboxRadius?: number): boolean {
    if (typeof hitboxRadius === 'number') {
      const pCenter = px + pSize / 2;
      return (
        pCenter + hitboxRadius > this.x &&
        pCenter - hitboxRadius < this.x + this.width &&
        py + pSize > this.y + 4 &&
        py < this.y + this.height - 4
      );
    }

    const pad = 6;
    return (
      px + pad < this.x + this.width &&
      px + pSize - pad > this.x &&
      py + pad < this.y + this.height &&
      py + pSize - pad > this.y
    );
  }
}
