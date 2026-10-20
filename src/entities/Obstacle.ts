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
   * AABB 碰撞檢測 (留有 4px 邊界緩衝，避免誤判造成挫折感)
   */
  public collidesWith(px: number, py: number, pSize: number): boolean {
    const pad = 6;
    return (
      px + pad < this.x + this.width &&
      px + pSize - pad > this.x &&
      py + pad < this.y + this.height &&
      py + pSize - pad > this.y
    );
  }
}
