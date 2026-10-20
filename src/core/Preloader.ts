import { DOG_BREEDS } from '../entities/DogBreeds';
import { AssetLoader } from './AssetLoader';

export class Preloader {
  private elPreloader = document.getElementById('preloader');
  private elFill = document.getElementById('preloader-fill');
  private elPct = document.getElementById('preloader-pct');
  private elTip = document.getElementById('preloader-tip');

  private readonly tips = [
    '🏮 正在點亮夜市大紅燈籠...',
    '🌭 正在碳烤香脆的士林大香腸...',
    '🧋 正在慢火熬煮黑糖波霸珍珠...',
    '🪵 正在扎緊河流過街的竹筏與蒸籠...',
    '🛵 正在檢查街道穿梭的機車與計程車...',
    '🐕 正在召集 10 款可愛街頭名犬...',
    '✨ 即將抵達夜市，小狗準備起跳！'
  ];

  private tipInterval: number | null = null;
  private currentProgress: number = 0;

  constructor() {
    const dogSprite = document.querySelector<HTMLElement>('.preloader-dog-sprite');
    if (dogSprite) {
      dogSprite.style.backgroundImage = "url('./assets/dog/dog_yellow.svg')";
    }
  }

  /**
   * 啟動資源預載與進度追蹤
   */
  public async start(): Promise<void> {
    if (!this.elPreloader) return;

    this.startTipsCycle();

    const minTimePromise = new Promise((resolve) => setTimeout(resolve, 800));
    const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 3800));

    // 實體資源清單 (10 款名犬 SVG)
    const loader = AssetLoader.getInstance();
    const totalAssets = DOG_BREEDS.length + 1; // 10 款名犬 + 字體/DOM
    let loadedAssets = 0;

    const updateProgress = () => {
      loadedAssets++;
      const targetPct = Math.min(95, Math.floor((loadedAssets / totalAssets) * 100));
      this.setProgress(targetPct);
    };

    // 預載全部名犬圖集
    const assetPromises = DOG_BREEDS.map((breed) => {
      return loader.loadImage(breed.id, `./assets/dog/${breed.id}.svg`).then(() => {
        updateProgress();
      });
    });

    // 預載主圖集
    assetPromises.push(
      loader.loadImage('dog', './assets/dog/dog_spritesheet.svg').then(() => {
        updateProgress();
      })
    );

    // 等待全部資源完成或逾時兜底
    await Promise.race([
      Promise.all([Promise.all(assetPromises), minTimePromise]),
      safetyTimeout
    ]);

    // 達到 100%
    this.setProgress(100);
    if (this.elTip) this.elTip.textContent = '🎉 夜市開市！祝小狗冒險愉快！';

    // 稍候 250ms 後平滑淡出
    await new Promise((resolve) => setTimeout(resolve, 250));
    await this.fadeOut();
  }

  private setProgress(pct: number) {
    this.currentProgress = Math.max(this.currentProgress, pct);
    if (this.elFill) {
      this.elFill.style.width = `${this.currentProgress}%`;
    }
    if (this.elPct) {
      this.elPct.textContent = `${this.currentProgress}%`;
    }
  }

  private startTipsCycle() {
    let index = 0;
    this.tipInterval = window.setInterval(() => {
      index = (index + 1) % this.tips.length;
      if (this.elTip) {
        this.elTip.textContent = this.tips[index];
      }
    }, 450);
  }

  private async fadeOut(): Promise<void> {
    if (this.tipInterval) {
      clearInterval(this.tipInterval);
      this.tipInterval = null;
    }

    if (!this.elPreloader) return;

    this.elPreloader.classList.add('fade-out');

    // 等待 0.5 秒淡出動畫結束
    await new Promise((resolve) => setTimeout(resolve, 520));
    this.elPreloader.style.display = 'none';
  }
}
