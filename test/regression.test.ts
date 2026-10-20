import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Mock localStorage for Node.js test environment
const mockStorage: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => mockStorage[k] || null,
    setItem: (k: string, v: string) => { mockStorage[k] = String(v); },
    removeItem: (k: string) => { delete mockStorage[k]; },
    clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
  };
}

// Mock Image for Node.js test environment
if (typeof (globalThis as unknown as { Image?: unknown }).Image === 'undefined') {
  (globalThis as unknown as { Image: unknown }).Image = class {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_: string) {
      setTimeout(() => { if (this.onload) this.onload(); }, 1);
    }
  };
}

// 載入核心系統與實體
import { DOG_BREEDS } from '../src/entities/DogBreeds.ts';
import { Player } from '../src/entities/Player.ts';
import { FOOD_DATABASE, GachaSystem } from '../src/systems/GachaSystem.ts';
import { LevelManager } from '../src/systems/LevelManager.ts';
import { StorageSystem } from '../src/systems/StorageSystem.ts';
import { Obstacle } from '../src/entities/Obstacle.ts';
import { Platform } from '../src/entities/Platform.ts';

// 測試群組 1: 素材完整性與規範回歸 (Asset & Rule Integrity)
test('【素材回歸】10 款名犬 SVG 精靈圖集檔案皆存在且格式有效', () => {
  const assetDir = path.resolve('public/assets/dog');
  assert.ok(fs.existsSync(assetDir), 'public/assets/dog 目錄應存在');

  const expectedFiles = [
    'dog_yellow.svg',
    'dog_black.svg',
    'dog_corgi.svg',
    'dog_chihuahua.svg',
    'dog_shiba.svg',
    'dog_poodle.svg',
    'dog_frenchie.svg',
    'dog_collie.svg',
    'dog_golden.svg',
    'dog_husky.svg'
  ];

  for (const file of expectedFiles) {
    const filePath = path.join(assetDir, file);
    assert.ok(fs.existsSync(filePath), `精靈圖集檔案 ${file} 應存在於 public/assets/dog`);
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('<svg'), `${file} 應為合法的 SVG`);
    assert.ok(content.includes('viewBox="0 0 128 160"'), `${file} 應符合 128x160 規格 (32x32 網格)`);
  }
});

test('【規範回歸】index.html 必須包含符合全域規範的內嵌 SVG Favicon', () => {
  const htmlPath = path.resolve('index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('<link rel="icon" type="image/svg+xml" href="data:image/svg+xml'), 'index.html 必須配置 SVG Data URI Favicon');
});

test('【預載回歸】index.html 必須包含專業遊戲載入畫面 (Preloader) 元素結構', () => {
  const htmlPath = path.resolve('index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('id="preloader"'), '應包含 preloader 容器');
  assert.ok(html.includes('id="preloader-fill"'), '應包含進度條填滿元素');
  assert.ok(html.includes('id="preloader-tip"'), '應包含隨機趣味夜市提示');
  assert.ok(html.includes('id="preloader-pct"'), '應包含百分比數值顯示');
});

// 測試群組 2: 10 大犬種規格與被動特性回歸 (Dog Breeds & Traits)
test('【名犬規格】10 種狗狗定義完整，涵蓋大/中/小型與專屬體型參數', () => {
  assert.equal(DOG_BREEDS.length, 10, '必須精確定義 10 種狗狗品種');

  const categories = new Set(DOG_BREEDS.map(d => d.category));
  assert.ok(categories.has('超小型'), '應包含超小型犬 (吉娃娃)');
  assert.ok(categories.has('小型'), '應包含小型犬 (柯基/法鬥/貴賓)');
  assert.ok(categories.has('中型'), '應包含中型犬 (黃狗/黑狗/柴犬)');
  assert.ok(categories.has('大型'), '應包含大型犬 (金毛/哈士奇/邊牧)');

  for (const dog of DOG_BREEDS) {
    assert.ok(dog.renderSize >= 28 && dog.renderSize <= 52, `${dog.name} 渲染尺寸應在合理範圍 (28..52px)`);
    assert.ok(dog.hitboxRadius >= 10 && dog.hitboxRadius <= 20, `${dog.name} 判定半徑應在合理範圍 (10..20px)`);
    assert.ok(dog.jumpSpeed >= 7.0 && dog.jumpSpeed <= 11.0, `${dog.name} 跳躍速度應在平衡範圍`);
    assert.ok(dog.traitName.length > 0, `${dog.name} 必須有名稱鮮明的特性`);
    assert.ok(dog.traitDesc.length > 0, `${dog.name} 必須有特性機制說明`);
  }
});

test('【特性回歸】黃金獵犬自帶天使聖盾，可無損抵擋 1 次致命車禍', () => {
  const golden = DOG_BREEDS.find(d => d.id === 'dog_golden')!;
  const player = new Player(4, 0);
  player.setBreed(golden);

  assert.equal(player.hasShield, true, '黃金獵犬初始應具備聖盾');
  assert.equal(player.shieldActive, true, '聖盾初始應為啟用狀態');

  const died1 = player.die('car');
  assert.equal(died1, false, '聖盾啟用時應免疫死亡');
  assert.equal(player.isDead, false, '玩家狀態不應被標記為死亡');
  assert.equal(player.shieldActive, false, '聖盾吸收後應轉為未啟用');

  const died2 = player.die('car');
  assert.equal(died2, true, '聖盾耗盡後應正常死亡');
  assert.equal(player.isDead, true, '玩家應標記為死亡');

  player.reset(4, 0);
  assert.equal(player.shieldActive, true, '新回合應恢復聖盾');
  assert.equal(player.isDead, false, '玩家應復活');
});

test('【特性回歸】吉娃娃擁有超小型微型判定箱 (10px)', () => {
  const chihuahua = DOG_BREEDS.find(d => d.id === 'dog_chihuahua')!;
  const yellow = DOG_BREEDS.find(d => d.id === 'dog_yellow')!;
  assert.ok(chihuahua.hitboxRadius < yellow.hitboxRadius, '吉娃娃判定箱必須明顯小於標準黃狗');
  assert.equal(chihuahua.hitboxRadius, 10, '吉娃娃判定箱半徑應為 10px');
});

test('【特性回歸】柯基具備最靈敏之起跳頻率 (jumpSpeed = 10.0)', () => {
  const corgi = DOG_BREEDS.find(d => d.id === 'dog_corgi')!;
  const yellow = DOG_BREEDS.find(d => d.id === 'dog_yellow')!;
  assert.ok(corgi.jumpSpeed > yellow.jumpSpeed, '柯基起跳速度應高於標準黃狗');
  assert.equal(corgi.jumpSpeed, 10.0);
});

// 測試群組 3: 關卡生成與難度遞進回歸 (Level Progression)
test('【關卡回歸】10 個主題關卡配置合法，時間與障礙隨進度遞進', () => {
  for (let i = 1; i <= 10; i++) {
    const level = LevelManager.getLevel(i);
    assert.equal(level.levelNumber, i, `關卡編號應為 ${i}`);
    assert.ok(level.timeLimit >= 30 && level.timeLimit <= 60, `關卡 ${i} 時限應在 30~60 秒合理區間`);
    assert.ok(level.lanes.length >= 6, `關卡 ${i} 橫列長度應足夠挑戰性`);
    assert.equal(level.lanes[0].type, 'grass', `關卡 ${i} 起點必須是安全草地`);
    assert.equal(level.lanes[level.lanes.length - 1].type, 'goal', `關卡 ${i} 終點必須是小吃攤位`);
    assert.ok(level.foodTarget.length > 0, `關卡 ${i} 必須有目標美食名稱`);
  }

  assert.equal(LevelManager.getLevel(1).foodTarget, '士林大香腸');
  assert.equal(LevelManager.getLevel(10).foodTarget, '波霸黑糖珍珠鮮奶');
});

test('【地獄模式】地獄模式生成器能正確生成無盡挑戰橫列', () => {
  const hellLanes = LevelManager.generateHellLanes(25);
  assert.ok(hellLanes.length >= 26, '地獄模式應包含 25+ 橫列');
  assert.equal(hellLanes[0].type, 'grass', '地獄模式起點為安全區');
  assert.equal(hellLanes[hellLanes.length - 1].type, 'goal', '地獄模式終點為地獄總舖師');

  const types = new Set(hellLanes.map(l => l.type));
  assert.ok(types.has('road'), '地獄模式應包含馬路');
  assert.ok(types.has('river'), '地獄模式應包含河流');
  assert.ok(types.has('rail'), '地獄模式應包含平交道鐵軌');
});

// 測試群組 4: 美食資料庫與抽卡權重回歸 (Food Database & Gacha)
test('【美食圖鑑】收錄 20 款在地小吃，欄位完整無空值', () => {
  assert.equal(FOOD_DATABASE.length, 20, '美食圖鑑應剛好收錄 20 款經典小吃');

  const idSet = new Set<string>();
  for (const food of FOOD_DATABASE) {
    assert.ok(!idSet.has(food.id), `美食 ID ${food.id} 不可重複`);
    idSet.add(food.id);

    assert.ok(['小吃', '麵食', '甜點', '飲品'].includes(food.category), `美食分類 ${food.category} 應為四大分類之一`);
    assert.ok(['普通', '稀有', '傳說'].includes(food.rarity), `稀有度 ${food.rarity} 應為三大稀有度之一`);
    assert.ok(food.googleMapsQuery.length > 0, `美食 ${food.name} 必須具備 Google 地圖搜尋關鍵字`);
  }
});

test('【抽卡機制】蒙地卡羅抽卡 3000 次，稀有度機率符合分配設計 (普通 60%, 稀有 30%, 傳說 10%)', () => {
  const counts = { 普通: 0, 稀有: 0, 傳說: 0 };
  const SIM_DRAWS = 3000;

  for (let i = 0; i < SIM_DRAWS; i++) {
    const card = GachaSystem.drawCard();
    counts[card.rarity]++;
  }

  const normalRatio = counts.普通 / SIM_DRAWS;
  const rareRatio = counts.稀有 / SIM_DRAWS;
  const legendRatio = counts.傳說 / SIM_DRAWS;

  assert.ok(Math.abs(normalRatio - 0.60) < 0.05, `普通卡期望 60%，實測 ${(normalRatio * 100).toFixed(1)}%`);
  assert.ok(Math.abs(rareRatio - 0.30) < 0.05, `稀有卡期望 30%，實測 ${(rareRatio * 100).toFixed(1)}%`);
  assert.ok(Math.abs(legendRatio - 0.10) < 0.04, `傳說卡期望 10%，實測 ${(legendRatio * 100).toFixed(1)}%`);
});

// 測試群組 5: 資料持久化與排行榜排序回歸 (Storage & Leaderboard)
test('【存檔機制】存檔更新、星星覆蓋與解鎖地獄模式邏輯正確', () => {
  for (const k in mockStorage) delete mockStorage[k];

  const init = StorageSystem.loadProgress();
  assert.equal(init.unlockedLevel, 1);
  assert.equal(init.unlockedHell, false);

  StorageSystem.saveLevelResult(1, 2, 850);
  let p = StorageSystem.loadProgress();
  assert.equal(p.unlockedLevel, 2, '第 1 關通關應解鎖第 2 關');
  assert.equal(p.levelStars[1], 2);

  StorageSystem.saveLevelResult(1, 3, 1200);
  p = StorageSystem.loadProgress();
  assert.equal(p.levelStars[1], 3, '獲得 3 星應覆蓋原本的 2 星');

  StorageSystem.saveLevelResult(1, 1, 600);
  p = StorageSystem.loadProgress();
  assert.equal(p.levelStars[1], 3, '低星級不應降低歷史最高 3 星紀錄');

  StorageSystem.saveLevelResult(10, 3, 9999);
  p = StorageSystem.loadProgress();
  assert.equal(p.unlockedHell, true, '第 10 關通關應解鎖地獄模式');

  const isNew1 = StorageSystem.addCollectedCard('food_01');
  assert.equal(isNew1, true, '首次獲得卡片應為 NEW');
  const isNew2 = StorageSystem.addCollectedCard('food_01');
  assert.equal(isNew2, false, '再次獲得同張卡片不應標記為 NEW');
});

test('【排行榜回歸】排行榜紀錄按分數由高至低自動嚴格排序', () => {
  for (const k in mockStorage) delete mockStorage[k];

  StorageSystem.recordScore('小柴', 1000, 'normal');
  StorageSystem.recordScore('大金毛', 5000, 'normal');
  StorageSystem.recordScore('二哈', 3000, 'hell');

  const ranks = StorageSystem.getLeaderboard();
  assert.ok(ranks.length >= 3);

  for (let i = 0; i < ranks.length - 1; i++) {
    assert.ok(ranks[i].score >= ranks[i + 1].score, `排行榜第 ${i+1} 名 (${ranks[i].score}) 應大於等於第 ${i+2} 名 (${ranks[i+1].score})`);
  }
});

// 測試群組 6: 幾何碰撞演算法回歸 (Physics & Collisions)
test('【碰撞檢測】車輛 AABB 碰撞檢測運算精確且支援犬種專屬判定半徑', () => {
  const car = new Obstacle(100, 200, 60, 40, 100, 'car');

  // 標準包圍盒判定 (無 hitboxRadius 引數)
  assert.equal(car.collidesWith(120, 210, 36), true, '重疊區域應判定為碰撞');
  assert.equal(car.collidesWith(300, 200, 36), false, '遠離區域不應判定碰撞');
  assert.equal(car.collidesWith(120, 350, 36), false, '不同高度不應判定碰撞');

  // 微型化犬種半徑檢測 (吉娃娃 10px vs 金毛 18px)
  // 車輛 X: 100..160。角色 X: 65, 寬度: 36 => 角色中心點: 83 (距離車輛邊緣 17px)
  const px = 65;
  const py = 205;
  const pSize = 36;
  // 吉娃娃半徑 10px: 中心點 83 + 10 = 93 < 100 (不碰撞，成功穿梭過車縫！)
  assert.equal(car.collidesWith(px, py, pSize, 10), false, '吉娃娃微型半徑在車縫間不應判定碰撞');
  // 金毛半徑 18px: 中心點 83 + 18 = 101 > 100 (碰撞！)
  assert.equal(car.collidesWith(px, py, pSize, 18), true, '大型犬較大半徑在邊界處應判定碰撞');
});

test('【浮台檢測】河流竹筏乘載範圍判定符合邊界寬容度且支援拒否犬特性', () => {
  const raft = new Platform(100, 150, 90, 44, 80, 'raft');

  assert.equal(raft.contains(120, 140, 40), true, '竹筏中央應判定在浮台上');
  assert.equal(raft.contains(300, 140, 40), false, '離開竹筏應判定不在浮台上');

  // 測試柴犬 18px 寬容度 vs 標準 6px 寬容度
  // 竹筏 X: 100..190。若角色中心點位於 198 (超出右邊緣 8px)
  // 角色 X: 178, pSize: 40 => 中心點 198
  const edgePx = 178;
  const edgePy = 152;
  const pSize = 40;
  assert.equal(raft.contains(edgePx, edgePy, pSize, 6), false, '標準犬種超出 6px 邊界應判定落水');
  assert.equal(raft.contains(edgePx, edgePy, pSize, 18), true, '柴犬具備 18px 寬容度應判定穩固站立於竹筏上');
});

// 測試群組 7: 防禦性反序列化安全回歸 (Defensive Deserialization & Robustness)
test('【存檔機制】舊版本殘留或毀損存檔具備防禦性反序列化修復力', () => {
  for (const k in mockStorage) delete mockStorage[k];

  // 1. 舊版缺少 levelStars 與 selectedDogId 的不完整存檔
  mockStorage['food_crossy_road_save_v1'] = JSON.stringify({
    highScore: 888
  });

  const legacyProgress = StorageSystem.loadProgress();
  assert.equal(legacyProgress.highScore, 888);
  assert.equal(legacyProgress.unlockedLevel, 1, '缺少 unlockedLevel 應自動補齊預設值 1');
  assert.deepEqual(legacyProgress.levelStars, {}, '缺少 levelStars 應自動補齊空物件避免崩潰');
  assert.equal(legacyProgress.selectedDogId, 'dog_yellow', '缺少 selectedDogId 應自動退回初始黃狗');

  // 驗證進行存檔不會報錯
  assert.doesNotThrow(() => {
    StorageSystem.saveLevelResult(1, 3, 1000);
  });
  const updated = StorageSystem.loadProgress();
  assert.equal(updated.levelStars[1], 3);

  // 2. 存檔字串損壞 (非合法 JSON)
  mockStorage['food_crossy_road_save_v1'] = '{bad-json-corrupted}';
  const fallbackProgress = StorageSystem.loadProgress();
  assert.equal(fallbackProgress.unlockedLevel, 1);
  assert.equal(fallbackProgress.selectedDogId, 'dog_yellow');
});
