/**
 * 資源載入器 (AssetLoader)
 * 負責預先非同步載入遊戲圖集，若離線或載入異常具備自動降級容錯
 */
export class AssetLoader {
  private static instance: AssetLoader;
  private images: Map<string, HTMLImageElement> = new Map();
  private loadedMap: Map<string, boolean> = new Map();

  private constructor() {}

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  /**
   * 載入單一圖片資源
   */
  public loadImage(key: string, url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        this.loadedMap.set(key, true);
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`[AssetLoader] 無法載入素材: ${url}，已自動啟用向量降級保護。`);
        this.loadedMap.set(key, false);
        resolve(img);
      };
      img.src = url;
    });
  }

  public isLoaded(key: string): boolean {
    return this.loadedMap.get(key) === true;
  }

  public getImage(key: string): HTMLImageElement | null {
    return this.isLoaded(key) ? this.images.get(key) || null : null;
  }
}
