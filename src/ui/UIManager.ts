import { FoodCard, FOOD_DATABASE, GachaSystem } from '../systems/GachaSystem';
import { StorageSystem } from '../systems/StorageSystem';
import { AudioManager } from '../core/AudioManager';
import { DogBreed, DOG_BREEDS } from '../entities/DogBreeds';

export class UIManager {
  private audio: AudioManager;

  private elHudLevel = document.getElementById('hud-level')!;
  private elHudTime = document.getElementById('hud-time')!;
  private elHudScore = document.getElementById('hud-score')!;
  private elHudLife = document.getElementById('hud-life')!;
  private elTimebarFill = document.getElementById('timebar-fill')!;
  private elToast = document.getElementById('toast')!;

  private ovStart = document.getElementById('ov-start')!;
  private ovVictory = document.getElementById('ov-victory')!;
  private ovGameover = document.getElementById('ov-gameover')!;
  private ovCard = document.getElementById('ov-card')!;
  private ovDex = document.getElementById('ov-dex')!;
  private ovRank = document.getElementById('ov-rank')!;
  private ovPause = document.getElementById('ov-pause')!;
  private ovDogs = document.getElementById('ov-dogs')!;

  private layerRain = document.getElementById('rain')!;
  private layerFog = document.getElementById('fog')!;
  private layerDanger = document.getElementById('danger')!;

  public onStartNormal: (() => void) | null = null;
  public onStartHell: (() => void) | null = null;
  public onNextLevel: (() => void) | null = null;
  public onRetry: (() => void) | null = null;
  public onResume: (() => void) | null = null;
  public onBackMenu: (() => void) | null = null;
  public onSelectDog: ((breed: DogBreed) => void) | null = null;

  constructor(audio: AudioManager) {
    this.audio = audio;
    this.bindEvents();
    this.refreshStartMenu();
  }

  private bindEvents() {
    document.getElementById('btn-start')?.addEventListener('click', () => {
      this.ovStart.classList.add('hidden');
      if (this.onStartNormal) this.onStartNormal();
    });

    document.getElementById('btn-hell')?.addEventListener('click', () => {
      const progress = StorageSystem.loadProgress();
      if (!progress.unlockedHell) {
        this.showToast('🔒 需通關一般模式 10 關才可解鎖地獄模式！');
        return;
      }
      this.ovStart.classList.add('hidden');
      if (this.onStartHell) this.onStartHell();
    });

    document.getElementById('btn-open-dex')?.addEventListener('click', () => {
      this.openDex();
    });

    document.getElementById('dex-close')?.addEventListener('click', () => {
      this.ovDex.classList.add('hidden');
    });

    document.getElementById('btn-open-rank')?.addEventListener('click', () => {
      this.openRank();
    });

    document.getElementById('rank-close')?.addEventListener('click', () => {
      this.ovRank.classList.add('hidden');
    });

    document.getElementById('btn-open-dogs')?.addEventListener('click', () => {
      this.openDogs();
    });

    document.getElementById('dogs-close')?.addEventListener('click', () => {
      this.ovDogs.classList.add('hidden');
    });

    document.getElementById('btn-sound')?.addEventListener('click', (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const isEnabled = this.audio.toggle();
      btn.textContent = isEnabled ? '🔊' : '🔇';
      this.showToast(isEnabled ? '音效已開啟' : '靜音模式');
    });

    document.getElementById('btn-pause')?.addEventListener('click', () => {
      this.showPause();
    });

    document.getElementById('btn-resume')?.addEventListener('click', () => {
      this.ovPause.classList.add('hidden');
      if (this.onResume) this.onResume();
    });

    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      this.ovPause.classList.add('hidden');
      if (this.onBackMenu) this.onBackMenu();
    });

    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      this.ovVictory.classList.add('hidden');
      if (this.onNextLevel) this.onNextLevel();
    });

    document.getElementById('btn-retry')?.addEventListener('click', () => {
      this.ovGameover.classList.add('hidden');
      if (this.onRetry) this.onRetry();
    });

    document.getElementById('btn-back-menu')?.addEventListener('click', () => {
      this.ovGameover.classList.add('hidden');
      if (this.onBackMenu) this.onBackMenu();
    });

    document.getElementById('btn-draw-card')?.addEventListener('click', () => {
      this.ovVictory.classList.add('hidden');
      this.drawAndShowCard();
    });

    document.getElementById('fc-close')?.addEventListener('click', () => {
      this.ovCard.classList.add('hidden');
      if (this.onNextLevel) this.onNextLevel();
    });

    document.getElementById('dex-cat-filter')?.addEventListener('change', (e) => {
      const cat = (e.target as HTMLSelectElement).value;
      this.renderDexList(cat);
    });
  }

  public refreshStartMenu() {
    const progress = StorageSystem.loadProgress();
    const btnHell = document.getElementById('btn-hell');
    if (btnHell) {
      if (progress.unlockedHell) {
        btnHell.classList.remove('locked');
        btnHell.innerHTML = '🔥 地獄模式';
      } else {
        btnHell.classList.add('locked');
      }
    }
  }

  public showStartMenu() {
    this.refreshStartMenu();
    this.ovStart.classList.remove('hidden');
    this.ovVictory.classList.add('hidden');
    this.ovGameover.classList.add('hidden');
    this.ovPause.classList.add('hidden');
    this.ovDogs.classList.add('hidden');
    this.setWeather('normal');
  }

  public updateHUD(levelText: string, timeSec: number, score: number, lives: number, timeRatio: number) {
    this.elHudLevel.textContent = levelText;

    const mins = Math.floor(timeSec / 60);
    const secs = Math.floor(timeSec % 60);
    this.elHudTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    this.elHudScore.textContent = score.toLocaleString();

    let lifeIcons = '';
    for (let i = 0; i < lives; i++) lifeIcons += '❤️';
    for (let i = lives; i < 3; i++) lifeIcons += '🤍';
    this.elHudLife.textContent = lifeIcons;

    this.elTimebarFill.style.width = `${Math.max(0, Math.min(100, timeRatio * 100))}%`;
  }

  public showVictory(level: number, stallName: string, timeCost: number, scoreAdd: number, stars: number) {
    this.audio.playVictory();
    document.getElementById('vic-title')!.textContent = `🎉 恭喜通過第 ${level} 關！`;
    document.getElementById('vic-summary')!.textContent = `小狗順利抵達了「${stallName}」美味攤位！`;
    document.getElementById('vic-time')!.textContent = `${timeCost.toFixed(1)}s`;
    document.getElementById('vic-score')!.textContent = `+${scoreAdd}`;

    const starsContainer = document.getElementById('vic-stars')!;
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const star = document.createElement('span');
      star.className = `star ${i <= stars ? 'active' : ''}`;
      star.textContent = '★';
      starsContainer.appendChild(star);
    }

    this.ovVictory.classList.remove('hidden');
  }

  public showGameOver(reason: string) {
    this.audio.playHit();
    document.getElementById('fail-desc')!.textContent = reason;
    this.ovGameover.classList.remove('hidden');
  }

  public showPause() {
    this.ovPause.classList.remove('hidden');
  }

  public showToast(msg: string) {
    this.elToast.textContent = msg;
    this.elToast.classList.add('show');
    setTimeout(() => {
      this.elToast.classList.remove('show');
    }, 2400);
  }

  public setWeather(weather: 'normal' | 'rain' | 'fog' | 'danger') {
    this.layerRain.classList.toggle('active', weather === 'rain');
    this.layerFog.classList.toggle('active', weather === 'fog');
    this.layerDanger.classList.toggle('active', weather === 'danger');
  }

  public drawAndShowCard() {
    const card = GachaSystem.drawCard();
    const isNew = StorageSystem.addCollectedCard(card.id);
    this.audio.playCardReveal();

    document.getElementById('fc-rarity')!.textContent = `${card.rarity} ★★★`;
    document.getElementById('fc-badge')!.textContent = isNew ? 'NEW 解鎖!' : '已收集';
    document.getElementById('fc-icon')!.textContent = card.icon;
    document.getElementById('fc-cat')!.textContent = card.category;
    document.getElementById('fc-name')!.textContent = card.name;
    document.getElementById('fc-dist')!.textContent = `📍 ${card.district}`;
    document.getElementById('fc-blurb')!.textContent = card.description;

    const mapLink = document.getElementById('fc-map') as HTMLAnchorElement;
    if (mapLink) {
      mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.googleMapsQuery)}`;
    }

    this.ovCard.classList.remove('hidden');
  }

  public openDex() {
    this.ovDex.classList.remove('hidden');
    this.renderDexList('');
  }

  private renderDexList(catFilter: string) {
    const progress = StorageSystem.loadProgress();
    const listEl = document.getElementById('dex-list')!;
    const countEl = document.getElementById('dex-count')!;
    listEl.innerHTML = '';

    const collectedSet = new Set(progress.collectedCardIds);
    countEl.textContent = `收集進度: ${collectedSet.size} / ${FOOD_DATABASE.length}`;

    const filtered = catFilter
      ? FOOD_DATABASE.filter(f => f.category === catFilter)
      : FOOD_DATABASE;

    filtered.forEach(card => {
      const isOwned = collectedSet.has(card.id);
      const item = document.createElement('div');
      item.className = `dex-item ${isOwned ? '' : 'locked'}`;
      item.innerHTML = `
        <div class="dex-item-icon">${isOwned ? card.icon : '❓'}</div>
        <div class="dex-item-name">${isOwned ? card.name : '？？？'}</div>
      `;

      if (isOwned) {
        item.addEventListener('click', () => {
          this.showSingleCard(card);
        });
      }

      listEl.appendChild(item);
    });
  }

  private showSingleCard(card: FoodCard) {
    document.getElementById('fc-rarity')!.textContent = `${card.rarity} ★★★`;
    document.getElementById('fc-badge')!.textContent = '圖鑑中';
    document.getElementById('fc-icon')!.textContent = card.icon;
    document.getElementById('fc-cat')!.textContent = card.category;
    document.getElementById('fc-name')!.textContent = card.name;
    document.getElementById('fc-dist')!.textContent = `📍 ${card.district}`;
    document.getElementById('fc-blurb')!.textContent = card.description;

    const mapLink = document.getElementById('fc-map') as HTMLAnchorElement;
    if (mapLink) {
      mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.googleMapsQuery)}`;
    }

    this.ovCard.classList.remove('hidden');
  }

  public openRank() {
    this.ovRank.classList.remove('hidden');
    const ranks = StorageSystem.getLeaderboard();
    const rankList = document.getElementById('rank-list')!;
    rankList.innerHTML = '';

    ranks.forEach((entry, idx) => {
      const li = document.createElement('li');
      li.className = 'rank-item';
      li.innerHTML = `
        <span class="rank-badge">#${idx + 1}</span>
        <span class="rank-name">${entry.name} <small style="color:#718096">(${entry.mode === 'hell' ? '地獄' : '一般'})</small></span>
        <span class="rank-score">${entry.score.toLocaleString()} 分</span>
      `;
      rankList.appendChild(li);
    });
  }

  public openDogs() {
    this.ovDogs.classList.remove('hidden');
    this.renderDogsList();
  }

  private renderDogsList() {
    const progress = StorageSystem.loadProgress();
    const activeDogId = StorageSystem.getSelectedDogId();
    const listEl = document.getElementById('dogs-list')!;
    listEl.innerHTML = '';

    DOG_BREEDS.forEach((breed) => {
      const isUnlocked = progress.unlockedLevel >= breed.unlockLevel;
      const isActive = breed.id === activeDogId;

      const card = document.createElement('div');
      card.className = `dog-card ${isActive ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;

      let btnLabel = '出戰';
      let btnClass = 'btn primary dog-card-btn';
      if (isActive) {
        btnLabel = '✓ 出戰中';
        btnClass = 'btn secondary dog-card-btn';
      } else if (!isUnlocked) {
        btnLabel = `🔒 通關第 ${breed.unlockLevel - 1} 關解鎖`;
        btnClass = 'btn secondary dog-card-btn';
      }

      // 動態像素預覽頭像 (CSS steps 踩步搖尾動畫)
      card.innerHTML = `
        <div class="dog-card-header">
          <div class="dog-sprite-preview-wrap" style="background-color: ${breed.themeColors.secondary}">
            <div class="dog-sprite-preview" style="background-image: url('./assets/dog/${breed.id}.svg')"></div>
          </div>
          <span class="dog-size-badge ${breed.category}">${breed.category}</span>
        </div>
        <div class="dog-name">${breed.name}</div>
        <div class="dog-trait-title">✨ ${breed.traitName}</div>
        <div class="dog-trait-desc">${breed.traitDesc}</div>
        <button class="${btnClass}" ${(!isUnlocked || isActive) ? 'disabled' : ''}>${btnLabel}</button>
      `;

      const btn = card.querySelector('button');
      if (btn && isUnlocked && !isActive) {
        btn.addEventListener('click', () => {
          if (this.onSelectDog) {
            this.onSelectDog(breed);
          }
          this.renderDogsList();
        });
      }

      listEl.appendChild(card);
    });
  }
}
