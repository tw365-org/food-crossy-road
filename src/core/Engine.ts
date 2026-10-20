import { Player } from '../entities/Player';
import { Lane } from '../entities/Lane';
import { InputManager, Direction } from './Input';
import { AudioManager } from './AudioManager';
import { UIManager } from '../ui/UIManager';
import { LevelManager, LevelDefinition } from '../systems/LevelManager';
import { StorageSystem } from '../systems/StorageSystem';
import { AssetLoader } from './AssetLoader';
import { ParticleSystem } from '../render/ParticleSystem';
import { DogBreed, DOG_BREEDS } from '../entities/DogBreeds';

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER';

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private player: Player;
  private lanes: Lane[] = [];
  private input: InputManager;
  private audio: AudioManager;
  private ui: UIManager;
  private particles: ParticleSystem;

  public state: GameState = 'START';
  public currentMode: 'normal' | 'hell' = 'normal';
  public currentLevel: number = 1;

  // 網格與尺寸常數
  public readonly cellSize: number = 50;
  public readonly gridCols: number = 10;
  public readonly stageWidth: number = 500;
  public readonly stageHeight: number = 700;

  // 計時與評星
  private timeLimit: number = 60;
  private timeElapsed: number = 0;
  private hadMistake: boolean = false;
  private totalScore: number = 0;
  private levelScore: number = 0;
  private lives: number = 3;

  private cameraY: number = 0;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;

    this.audio = new AudioManager();
    this.ui = new UIManager(this.audio);
    this.input = new InputManager(canvas, () => this.togglePause());
    this.particles = new ParticleSystem();

    this.player = new Player(4, 0);
    this.player.particleSystem = this.particles;

    // 載入玩家保存的狗狗品種
    const savedBreedId = StorageSystem.getSelectedDogId();
    const initBreed = DOG_BREEDS.find(b => b.id === savedBreedId) || DOG_BREEDS[0];
    this.player.setBreed(initBreed);

    // 預載像素小狗精靈圖集
    AssetLoader.getInstance().loadImage('dog', './assets/dog/dog_spritesheet.svg');

    this.bindUICallbacks();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    requestAnimationFrame((t) => this.loop(t));
  }

  private resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const availableW = parent.clientWidth;
    const availableH = parent.clientHeight;
    const scale = Math.min(availableW / this.stageWidth, availableH / this.stageHeight, 1.25);

    this.canvas.style.width = `${Math.floor(this.stageWidth * scale)}px`;
    this.canvas.style.height = `${Math.floor(this.stageHeight * scale)}px`;
  }

  private bindUICallbacks() {
    this.ui.onStartNormal = () => {
      this.currentMode = 'normal';
      this.currentLevel = 1;
      this.totalScore = 0;
      this.lives = 3;
      this.startLevel(this.currentLevel);
    };

    this.ui.onStartHell = () => {
      this.currentMode = 'hell';
      this.currentLevel = 1;
      this.totalScore = 0;
      this.lives = 3;
      this.startHellMode();
    };

    this.ui.onNextLevel = () => {
      if (this.currentMode === 'normal') {
        if (this.currentLevel < 10) {
          this.currentLevel++;
          this.startLevel(this.currentLevel);
        } else {
          this.ui.showToast('🏆 恭喜全破 10 關！解鎖地獄無盡挑戰！');
          this.ui.showStartMenu();
        }
      } else {
        this.currentLevel++;
        this.startHellMode();
      }
    };

    this.ui.onRetry = () => {
      if (this.currentMode === 'normal') {
        this.hadMistake = true;
        this.startLevel(this.currentLevel);
      } else {
        this.lives--;
        if (this.lives > 0) {
          this.startHellMode();
        } else {
          StorageSystem.recordScore(this.player.currentBreed.name, this.totalScore, 'hell');
          this.ui.showToast(`挑戰結束！最終得分: ${this.totalScore}`);
          this.ui.showStartMenu();
        }
      }
    };

    this.ui.onResume = () => {
      this.state = 'PLAYING';
      this.lastTime = performance.now();
    };

    this.ui.onBackMenu = () => {
      this.state = 'START';
      this.ui.showStartMenu();
    };

    // 換狗回呼
    this.ui.onSelectDog = (breed: DogBreed) => {
      this.player.setBreed(breed);
      StorageSystem.setSelectedDog(breed.id);
      this.syncPlayerScreenPos();
      this.ui.showToast(`已指派「${breed.name}」出戰！特性：${breed.traitName}`);
    };
  }

  private togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.ui.showPause();
    }
  }

  public startLevel(levelNum: number) {
    const def = LevelManager.getLevel(levelNum);
    this.buildLanes(def);

    // 紅貴賓特性：每關自動延長 8 秒時限
    let limit = def.timeLimit;
    if (this.player.currentBreed.id === 'dog_poodle') {
      limit += 8;
    }
    this.timeLimit = limit;
    this.timeElapsed = 0;
    this.ui.setWeather(def.weather);
    this.particles.clear();

    this.player.reset(4, 0);
    this.syncPlayerScreenPos();

    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.input.clear();
  }

  public startHellMode() {
    const lanesConfig = LevelManager.generateHellLanes(20);
    let limit = Math.max(25, 45 - this.currentLevel);
    if (this.player.currentBreed.id === 'dog_poodle') {
      limit += 8;
    }

    const def: LevelDefinition = {
      levelNumber: this.currentLevel,
      title: `地獄無盡第 ${this.currentLevel} 階`,
      foodTarget: '地獄總舖師',
      timeLimit: limit,
      weather: this.currentLevel % 2 === 0 ? 'rain' : 'danger',
      lanes: lanesConfig
    };

    this.buildLanes(def);
    this.timeLimit = def.timeLimit;
    this.timeElapsed = 0;
    this.ui.setWeather(def.weather);
    this.particles.clear();

    this.player.reset(4, 0);
    this.syncPlayerScreenPos();

    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.input.clear();
  }

  private buildLanes(def: LevelDefinition) {
    this.lanes = [];
    const count = def.lanes.length;

    for (let i = 0; i < count; i++) {
      const cfg = def.lanes[i];
      const y = (count - 1 - i) * this.cellSize;
      this.lanes.push(new Lane(i, y, this.cellSize, cfg, this.stageWidth));
    }
  }

  private syncPlayerScreenPos() {
    const px = this.player.gridX * this.cellSize + (this.cellSize - this.player.size) / 2;
    const py = (this.lanes.length - 1 - this.player.gridY) * this.cellSize + (this.cellSize - this.player.size) / 2;
    this.player.setScreenPosition(px, py);
  }

  private loop(timestamp: number) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (this.state === 'PLAYING') {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number) {
    this.timeElapsed += dt;
    const timeLeft = Math.max(0, this.timeLimit - this.timeElapsed);

    const levelTitle = this.currentMode === 'hell' ? `🔥 地獄第 ${this.currentLevel} 階` : `關卡 ${this.currentLevel}/10`;
    this.ui.updateHUD(
      levelTitle,
      timeLeft,
      this.totalScore + this.levelScore,
      this.lives,
      timeLeft / this.timeLimit
    );

    if (timeLeft <= 0 && !this.player.isDead) {
      this.player.die('timeout');
      setTimeout(() => {
        this.state = 'GAMEOVER';
        this.ui.showGameOver('⏰ 時間用盡！夜市攤位打烊了！');
      }, 1000);
      return;
    }

    for (const lane of this.lanes) {
      lane.update(dt, this.stageWidth);
    }

    if (!this.player.isJumping && !this.player.isDead) {
      const dir = this.input.consumeMove();
      if (dir) {
        this.executeMove(dir);
      }
    }

    this.player.update(dt);
    this.particles.update(dt);

    if (!this.player.isDead) {
      this.checkCollisions();
    }

    const targetCamY = this.player.pixelY - this.stageHeight * 0.65;
    this.cameraY += (targetCamY - this.cameraY) * 0.1;
  }

  private executeMove(dir: Direction) {
    let nextX = this.player.gridX;
    let nextY = this.player.gridY;

    // 哈士奇特性：二哈隨機狂暴大跳躍 (20% 機率向前多飛躍 1 格)
    let leapBonus = 0;
    if (this.player.currentBreed.id === 'dog_husky' && dir === 'up' && Math.random() < 0.2) {
      if (nextY + 2 < this.lanes.length) {
        leapBonus = 1;
        this.ui.showToast('❄️ 二哈狂暴發作！超遠飛躍！');
      }
    }

    if (dir === 'up') nextY += (1 + leapBonus);
    else if (dir === 'down') nextY--;
    else if (dir === 'left') nextX--;
    else if (dir === 'right') nextX++;

    if (nextX < 0 || nextX >= this.gridCols || nextY < 0 || nextY >= this.lanes.length) {
      return;
    }

    this.audio.playJump();

    const targetPx = nextX * this.cellSize + (this.cellSize - this.player.size) / 2;
    const targetPy = (this.lanes.length - 1 - nextY) * this.cellSize + (this.cellSize - this.player.size) / 2;

    this.player.jumpTo(nextX, nextY, targetPx, targetPy, dir);

    // 邊境牧羊犬特性：分數獲得 +25%
    const scoreFactor = this.player.currentBreed.id === 'dog_collie' ? 1.25 : 1.0;
    this.levelScore = Math.max(this.levelScore, Math.floor(nextY * 20 * scoreFactor));
  }

  private checkCollisions() {
    const currentLane = this.lanes.find(l => l.gridY === this.player.gridY);
    if (!currentLane) return;

    // 1. 車輛與鐵道撞擊判定 (結合犬種專屬 hitboxRadius)
    if (currentLane.type === 'road' || currentLane.type === 'rail') {
      const pCenter = this.player.pixelX + this.player.size / 2;
      const r = this.player.hitboxRadius;

      for (const obs of currentLane.obstacles) {
        // 自適應碰撞體
        const isCollided = (
          pCenter + r > obs.x &&
          pCenter - r < obs.x + obs.width &&
          this.player.pixelY + this.player.size > obs.y + 4 &&
          this.player.pixelY < obs.y + obs.height - 4
        );

        if (isCollided) {
          const reallyDied = this.player.die('car');
          if (!reallyDied) {
            // 護盾或彈開生效！
            this.audio.playJump();
            this.ui.showToast('🛡️ 特性觸發！抵擋了致命碰撞！');
            return;
          }

          this.audio.playHit();
          setTimeout(() => {
            this.state = 'GAMEOVER';
            this.ui.showGameOver(obs.type === 'train' ? '💥 被疾駛的火車撞倒了！' : '💥 哎呀，被迎面的車輛撞上了！');
          }, 800);
          return;
        }
      }
    }

    // 2. 河流浮島乘載與溺水檢測 (柴犬抗水流寬鬆判定)
    if (currentLane.type === 'river') {
      if (!this.player.isJumping) {
        let onRaft = false;
        // 柴犬拒否犬之錨：額外 +14px 安全浮島邊界
        const tolerance = this.player.currentBreed.id === 'dog_shiba' ? 18 : 6;

        for (const plat of currentLane.platforms) {
          const centerX = this.player.pixelX + this.player.size / 2;
          const centerY = this.player.pixelY + this.player.size / 2;
          if (
            centerX >= plat.x - tolerance &&
            centerX <= plat.x + plat.width + tolerance &&
            centerY >= plat.y - 4 &&
            centerY <= plat.y + plat.height + 4
          ) {
            onRaft = true;
            this.player.currentPlatform = plat;
            break;
          }
        }

        if (!onRaft || this.player.pixelX < -20 || this.player.pixelX > this.stageWidth + 20) {
          const reallyDied = this.player.die('water');
          if (!reallyDied) {
            this.ui.showToast('🛡️ 聖盾光環拯救了落水危急！');
            return;
          }

          this.audio.playSplash();
          setTimeout(() => {
            this.state = 'GAMEOVER';
            this.ui.showGameOver('💦 撲通！掉進河裡了，請踩著竹筏過河！');
          }, 800);
          return;
        }
      }
    }

    // 3. 終點小吃攤位達成
    if (currentLane.type === 'goal' && !this.player.isJumping) {
      this.handleVictory(currentLane.goalFoodName);
    }
  }

  private handleVictory(stallName: string) {
    this.state = 'VICTORY';
    this.player.setVictory();
    const timeUsed = this.timeElapsed;
    const timeBonus = Math.floor(Math.max(0, (this.timeLimit - timeUsed) * 25));
    
    // 邊境牧羊犬過關加成
    const scoreFactor = this.player.currentBreed.id === 'dog_collie' ? 1.25 : 1.0;
    const scoreAdd = Math.floor((500 + timeBonus) * scoreFactor);
    this.totalScore += scoreAdd;

    let stars = 1;
    if (!this.hadMistake) stars++;
    if (timeUsed < this.timeLimit * 0.65) stars++;

    if (this.currentMode === 'normal') {
      StorageSystem.saveLevelResult(this.currentLevel, stars, this.totalScore);
    }

    this.ui.showVictory(this.currentLevel, stallName, timeUsed, scoreAdd, stars);
  }

  private render() {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.ctx.save();
    this.ctx.translate(0, -this.cameraY);

    for (const lane of this.lanes) {
      lane.draw(this.ctx, this.stageWidth);
    }

    this.particles.draw(this.ctx);
    this.player.draw(this.ctx);

    this.ctx.restore();
  }
}
