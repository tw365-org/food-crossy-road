import { LaneConfig } from '../entities/Lane';

export interface LevelDefinition {
  levelNumber: number;
  title: string;
  foodTarget: string;
  timeLimit: number; // 秒數
  weather: 'normal' | 'rain' | 'fog' | 'danger';
  lanes: LaneConfig[];
}

export class LevelManager {
  public static getLevel(levelNumber: number): LevelDefinition {
    const clampedLevel = Math.max(1, Math.min(10, levelNumber));
    return this.LEVEL_CONFIGS[clampedLevel - 1];
  }

  public static generateHellLanes(laneCount: number = 25): LaneConfig[] {
    const lanes: LaneConfig[] = [
      { type: 'grass' } // 起點
    ];

    const pool: LaneConfig[] = [
      { type: 'road', speed: 180, obstacleType: 'scooter', spacing: 160 },
      { type: 'road', speed: -220, obstacleType: 'taxi', spacing: 190 },
      { type: 'road', speed: 240, obstacleType: 'truck', spacing: 230 },
      { type: 'river', speed: 160, platformType: 'raft', spacing: 190 },
      { type: 'river', speed: -180, platformType: 'steamer', spacing: 170 },
      { type: 'rail', speed: 450, spacing: 300 },
      { type: 'grass' }
    ];

    for (let i = 0; i < laneCount; i++) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      lanes.push({ ...pick });
    }

    lanes.push({ type: 'goal', goalFoodName: '地獄總舖師' });
    return lanes;
  }

  private static readonly LEVEL_CONFIGS: LevelDefinition[] = [
    // 關卡 1
    {
      levelNumber: 1,
      title: '第 1 關：新手夜市口',
      foodTarget: '士林大香腸',
      timeLimit: 60,
      weather: 'normal',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: 80, obstacleType: 'car', spacing: 240 },
        { type: 'road', speed: -90, obstacleType: 'car', spacing: 260 },
        { type: 'grass' },
        { type: 'road', speed: 100, obstacleType: 'taxi', spacing: 250 },
        { type: 'goal', goalFoodName: '士林大香腸' }
      ]
    },
    // 關卡 2
    {
      levelNumber: 2,
      title: '第 2 關：機車穿梭街',
      foodTarget: '酥炸地瓜球',
      timeLimit: 55,
      weather: 'normal',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: 90, obstacleType: 'car', spacing: 230 },
        { type: 'road', speed: 140, obstacleType: 'scooter', spacing: 180 },
        { type: 'grass' },
        { type: 'road', speed: -110, obstacleType: 'taxi', spacing: 220 },
        { type: 'road', speed: -150, obstacleType: 'scooter', spacing: 170 },
        { type: 'goal', goalFoodName: '酥炸地瓜球' }
      ]
    },
    // 關卡 3
    {
      levelNumber: 3,
      title: '第 3 關：清涼竹筏溪',
      foodTarget: '台南蚵仔煎',
      timeLimit: 50,
      weather: 'normal',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: 110, obstacleType: 'taxi', spacing: 220 },
        { type: 'river', speed: 90, platformType: 'raft', spacing: 210 },
        { type: 'river', speed: -100, platformType: 'raft', spacing: 220 },
        { type: 'grass' },
        { type: 'road', speed: -120, obstacleType: 'truck', spacing: 260 },
        { type: 'goal', goalFoodName: '台南蚵仔煎' }
      ]
    },
    // 關卡 4
    {
      levelNumber: 4,
      title: '第 4 關：蒸籠包子河',
      foodTarget: '古早味豆花',
      timeLimit: 45,
      weather: 'normal',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: 120, obstacleType: 'scooter', spacing: 170 },
        { type: 'river', speed: -110, platformType: 'steamer', spacing: 190 },
        { type: 'river', speed: 120, platformType: 'steamer', spacing: 190 },
        { type: 'river', speed: -95, platformType: 'raft', spacing: 210 },
        { type: 'grass' },
        { type: 'goal', goalFoodName: '古早味豆花' }
      ]
    },
    // 關卡 5
    {
      levelNumber: 5,
      title: '第 5 關：平交道快車',
      foodTarget: '大腸包小腸',
      timeLimit: 45,
      weather: 'normal',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: -120, obstacleType: 'taxi', spacing: 210 },
        { type: 'rail', speed: 420 },
        { type: 'grass' },
        { type: 'river', speed: 115, platformType: 'raft', spacing: 200 },
        { type: 'road', speed: 140, obstacleType: 'truck', spacing: 240 },
        { type: 'goal', goalFoodName: '大腸包小腸' }
      ]
    },
    // 關卡 6
    {
      levelNumber: 6,
      title: '第 6 關：雷雨夜市夜',
      foodTarget: '黃金鹽酥雞',
      timeLimit: 40,
      weather: 'rain',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: 140, obstacleType: 'scooter', spacing: 160 },
        { type: 'road', speed: -130, obstacleType: 'taxi', spacing: 200 },
        { type: 'river', speed: 120, platformType: 'raft', spacing: 200 },
        { type: 'river', speed: -130, platformType: 'steamer', spacing: 180 },
        { type: 'road', speed: 150, obstacleType: 'car', spacing: 200 },
        { type: 'goal', goalFoodName: '黃金鹽酥雞' }
      ]
    },
    // 關卡 7
    {
      levelNumber: 7,
      title: '第 7 關：迷霧老街渡口',
      foodTarget: '深坑臭豆腐',
      timeLimit: 40,
      weather: 'fog',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: -130, obstacleType: 'truck', spacing: 220 },
        { type: 'river', speed: -140, platformType: 'steamer', spacing: 180 },
        { type: 'river', speed: 130, platformType: 'steamer', spacing: 190 },
        { type: 'river', speed: -120, platformType: 'raft', spacing: 210 },
        { type: 'road', speed: 160, obstacleType: 'scooter', spacing: 160 },
        { type: 'goal', goalFoodName: '深坑臭豆腐' }
      ]
    },
    // 關卡 8
    {
      levelNumber: 8,
      title: '第 8 關：雙軌高鐵競速',
      foodTarget: '紅燒牛肉麵',
      timeLimit: 35,
      weather: 'danger',
      lanes: [
        { type: 'grass' },
        { type: 'rail', speed: 460 },
        { type: 'grass' },
        { type: 'rail', speed: -480 },
        { type: 'road', speed: 170, obstacleType: 'scooter', spacing: 150 },
        { type: 'road', speed: -150, obstacleType: 'taxi', spacing: 190 },
        { type: 'goal', goalFoodName: '紅燒牛肉麵' }
      ]
    },
    // 關卡 9
    {
      levelNumber: 9,
      title: '第 9 關：九曲連環水岸',
      foodTarget: '芒果雪花冰',
      timeLimit: 35,
      weather: 'normal',
      lanes: [
        { type: 'grass' },
        { type: 'river', speed: 140, platformType: 'raft', spacing: 190 },
        { type: 'river', speed: -150, platformType: 'steamer', spacing: 180 },
        { type: 'river', speed: 160, platformType: 'raft', spacing: 180 },
        { type: 'river', speed: -140, platformType: 'steamer', spacing: 190 },
        { type: 'road', speed: 180, obstacleType: 'car', spacing: 190 },
        { type: 'goal', goalFoodName: '芒果雪花冰' }
      ]
    },
    // 關卡 10
    {
      levelNumber: 10,
      title: '第 10 關：夜市總鋪師決戰',
      foodTarget: '波霸黑糖珍珠鮮奶',
      timeLimit: 30,
      weather: 'rain',
      lanes: [
        { type: 'grass' },
        { type: 'road', speed: 180, obstacleType: 'scooter', spacing: 150 },
        { type: 'rail', speed: 500 },
        { type: 'river', speed: -170, platformType: 'steamer', spacing: 170 },
        { type: 'river', speed: 180, platformType: 'raft', spacing: 170 },
        { type: 'road', speed: -190, obstacleType: 'truck', spacing: 200 },
        { type: 'goal', goalFoodName: '波霸黑糖珍珠鮮奶' }
      ]
    }
  ];
}
