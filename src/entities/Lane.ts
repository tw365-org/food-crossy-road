import { Obstacle, ObstacleType } from './Obstacle';
import { Platform, PlatformType } from './Platform';
import { ProceduralArt } from '../render/ProceduralArt';

export type LaneType = 'grass' | 'road' | 'river' | 'rail' | 'goal';

export interface LaneConfig {
  type: LaneType;
  speed?: number; // 速度與方向 (+向右, -向左)
  obstacleType?: ObstacleType;
  platformType?: PlatformType;
  spacing?: number; // 障礙物/浮台間距
  goalFoodName?: string;
}

export class Lane {
  public gridY: number;
  public y: number;
  public height: number;
  public type: LaneType;
  public speed: number = 0;

  public obstacles: Obstacle[] = [];
  public platforms: Platform[] = [];

  // 鐵路專用：火車警報與疾駛狀態
  public isTrainWarning: boolean = false;
  public trainCooldown: number = 4.0;
  public trainTimer: number = 0;

  public goalFoodName: string = '士林小吃';

  constructor(
    gridY: number,
    y: number,
    height: number,
    config: LaneConfig,
    stageWidth: number
  ) {
    this.gridY = gridY;
    this.y = y;
    this.height = height;
    this.type = config.type;
    this.speed = config.speed || 0;
    if (config.goalFoodName) this.goalFoodName = config.goalFoodName;

    this.initEntities(config, stageWidth);
  }

  private initEntities(config: LaneConfig, stageWidth: number) {
    const spacing = config.spacing || 240;

    if (this.type === 'road') {
      const obsType = config.obstacleType || 'car';
      let w = 56;
      if (obsType === 'scooter') w = 32;
      else if (obsType === 'truck') w = 75;
      else if (obsType === 'taxi') w = 58;

      const count = Math.ceil((stageWidth + 200) / spacing);
      for (let i = 0; i < count; i++) {
        const x = i * spacing - 100;
        this.obstacles.push(
          new Obstacle(x, this.y + 4, w, this.height - 8, this.speed, obsType)
        );
      }
    } else if (this.type === 'river') {
      const platType = config.platformType || 'raft';
      const w = platType === 'steamer' ? 70 : 95;
      const count = Math.ceil((stageWidth + 240) / spacing);

      for (let i = 0; i < count; i++) {
        const x = i * spacing - 120;
        this.platforms.push(
          new Platform(x, this.y + 3, w, this.height - 6, this.speed, platType)
        );
      }
    } else if (this.type === 'rail') {
      this.trainTimer = Math.random() * 3.5 + 2.0;
    }
  }

  public update(dt: number, stageWidth: number) {
    if (this.type === 'road') {
      for (const obs of this.obstacles) {
        obs.update(dt, stageWidth);
      }
    } else if (this.type === 'river') {
      for (const plat of this.platforms) {
        plat.update(dt, stageWidth);
      }
    } else if (this.type === 'rail') {
      this.trainTimer -= dt;

      // 火車通過警報
      if (this.trainTimer <= 1.2 && this.trainTimer > 0) {
        this.isTrainWarning = true;
      } else {
        this.isTrainWarning = false;
      }

      // 生成一輛疾駛高鐵/台鐵
      if (this.trainTimer <= 0) {
        const trainSpeed = this.speed !== 0 ? this.speed : 380;
        const trainWidth = 320;
        const startX = trainSpeed > 0 ? -trainWidth - 50 : stageWidth + 50;

        this.obstacles = [
          new Obstacle(startX, this.y + 4, trainWidth, this.height - 8, trainSpeed, 'train')
        ];
        this.trainTimer = 5.0 + Math.random() * 3.5;
      }

      for (const obs of this.obstacles) {
        obs.update(dt, stageWidth);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, stageWidth: number) {
    // 1. 繪製地形底色
    if (this.type === 'grass') {
      ctx.fillStyle = this.gridY % 2 === 0 ? '#78AB46' : '#85B84F';
      ctx.fillRect(0, this.y, stageWidth, this.height);

      // 草地點綴小花與草叢
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(20, this.y + 8, 4, 4);
      ctx.fillRect(160, this.y + 16, 5, 5);
      ctx.fillRect(280, this.y + 10, 4, 4);
      ctx.fillRect(400, this.y + 22, 5, 5);

    } else if (this.type === 'road') {
      ctx.fillStyle = '#374151'; // 柏油路面
      ctx.fillRect(0, this.y, stageWidth, this.height);

      // 馬路中央白色虛線
      ctx.fillStyle = '#CBD5E0';
      const dashW = 24;
      const gapW = 18;
      const count = Math.ceil(stageWidth / (dashW + gapW));
      for (let i = 0; i < count; i++) {
        ctx.fillRect(i * (dashW + gapW), this.y + this.height / 2 - 1.5, dashW, 3);
      }

    } else if (this.type === 'river') {
      ctx.fillStyle = '#38B2AC'; // 水藍色
      ctx.fillRect(0, this.y, stageWidth, this.height);

      // 動態水紋
      const waveOffset = (Date.now() / 400) % 20;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      for (let i = 0; i < stageWidth + 40; i += 40) {
        ctx.fillRect(i + waveOffset, this.y + 12, 16, 2);
        ctx.fillRect(i - waveOffset + 20, this.y + 28, 14, 2);
      }

    } else if (this.type === 'rail') {
      // 鐵道碎石基底
      ctx.fillStyle = '#4A5568';
      ctx.fillRect(0, this.y, stageWidth, this.height);

      // 枕木
      ctx.fillStyle = '#744210';
      for (let i = 0; i < stageWidth; i += 18) {
        ctx.fillRect(i, this.y + 5, 10, this.height - 10);
      }

      // 兩條鐵軌
      ctx.fillStyle = '#A0AEC0';
      ctx.fillRect(0, this.y + 10, stageWidth, 4);
      ctx.fillRect(0, this.y + this.height - 14, stageWidth, 4);

      // 警報紅燈閃爍
      if (this.isTrainWarning) {
        const isBlink = Math.floor(Date.now() / 150) % 2 === 0;
        ctx.fillStyle = isBlink ? '#E53E3E' : '#742A2A';
        ctx.beginPath();
        ctx.arc(24, this.y + this.height / 2, 7, 0, Math.PI * 2);
        ctx.arc(stageWidth - 24, this.y + this.height / 2, 7, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (this.type === 'goal') {
      // 夜市美食廣場
      ctx.fillStyle = '#ED8936';
      ctx.fillRect(0, this.y, stageWidth, this.height);

      // 夜市小吃攤排
      ProceduralArt.drawFoodStall(
        ctx,
        stageWidth / 2 - 80,
        this.y,
        160,
        this.height,
        this.goalFoodName
      );
    }

    // 2. 繪製浮台 (竹筏、蒸籠)
    for (const plat of this.platforms) {
      plat.draw(ctx);
    }

    // 3. 繪製障礙物 (車輛、火車)
    for (const obs of this.obstacles) {
      obs.draw(ctx);
    }
  }
}
