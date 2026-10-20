export interface GameProgress {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  unlockedHell: boolean;
  collectedCardIds: string[];
  highScore: number;
  selectedDogId?: string; // 當前選用狗狗 ID
}

export interface LeaderboardEntry {
  rank?: number;
  name: string;
  score: number;
  mode: 'normal' | 'hell';
  date: string;
}

export class StorageSystem {
  private static readonly STORAGE_KEY = 'food_crossy_road_save_v1';
  private static readonly LEADERBOARD_KEY = 'food_crossy_road_ranks_v1';

  public static loadProgress(): GameProgress {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // 容錯降級
    }

    return {
      unlockedLevel: 1,
      levelStars: {},
      unlockedHell: false,
      collectedCardIds: [],
      highScore: 0,
      selectedDogId: 'dog_yellow'
    };
  }

  public static saveProgress(progress: GameProgress) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // 容錯
    }
  }

  public static setSelectedDog(dogId: string) {
    const progress = this.loadProgress();
    progress.selectedDogId = dogId;
    this.saveProgress(progress);
  }

  public static getSelectedDogId(): string {
    const progress = this.loadProgress();
    return progress.selectedDogId || 'dog_yellow';
  }

  public static addCollectedCard(cardId: string): boolean {
    const progress = this.loadProgress();
    const isNew = !progress.collectedCardIds.includes(cardId);
    if (isNew) {
      progress.collectedCardIds.push(cardId);
      this.saveProgress(progress);
    }
    return isNew;
  }

  public static saveLevelResult(level: number, stars: number, score: number) {
    const progress = this.loadProgress();

    const currentStars = progress.levelStars[level] || 0;
    if (stars > currentStars) {
      progress.levelStars[level] = stars;
    }

    if (level >= progress.unlockedLevel && level < 10) {
      progress.unlockedLevel = level + 1;
    }

    if (level === 10) {
      progress.unlockedHell = true;
    }

    if (score > progress.highScore) {
      progress.highScore = score;
    }

    this.saveProgress(progress);
  }

  public static getLeaderboard(): LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(this.LEADERBOARD_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // 降級
    }

    const defaults: LeaderboardEntry[] = [
      { name: '士林夜市老饕', score: 12850, mode: 'normal', date: '2026-10-18' },
      { name: '逢甲小黃狗', score: 9820, mode: 'normal', date: '2026-10-19' },
      { name: '珍珠奶茶狂熱者', score: 8400, mode: 'normal', date: '2026-10-20' },
      { name: '地獄過街神犬', score: 7200, mode: 'hell', date: '2026-10-17' },
      { name: '九層塔鹽酥雞', score: 5500, mode: 'normal', date: '2026-10-15' }
    ];
    this.saveLeaderboard(defaults);
    return defaults;
  }

  public static saveLeaderboard(ranks: LeaderboardEntry[]) {
    try {
      localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(ranks));
    } catch {
      // 容錯
    }
  }

  public static recordScore(name: string, score: number, mode: 'normal' | 'hell') {
    const list = this.getLeaderboard();
    const today = new Date().toISOString().split('T')[0];
    list.push({ name, score, mode, date: today });
    list.sort((a, b) => b.score - a.score);
    this.saveLeaderboard(list.slice(0, 15));
  }
}
