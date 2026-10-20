export type FoodCategory = '小吃' | '麵食' | '甜點' | '飲品';
export type FoodRarity = '普通' | '稀有' | '傳說';

export interface FoodCard {
  id: string;
  name: string;
  category: FoodCategory;
  rarity: FoodRarity;
  icon: string;
  district: string;
  description: string;
  googleMapsQuery: string;
}

export const FOOD_DATABASE: FoodCard[] = [
  // 1. 小吃
  {
    id: 'food_01',
    name: '士林大香腸',
    category: '小吃',
    rarity: '普通',
    icon: '🌭',
    district: '台北士林夜市',
    description: '外皮微焦噴香，內餡肉汁飽滿，搭配生蒜片一口咬下超過癮！',
    googleMapsQuery: '士林夜市 大香腸'
  },
  {
    id: 'food_02',
    name: '酥炸地瓜球',
    category: '小吃',
    rarity: '普通',
    icon: '🍠',
    district: '全台各大夜市',
    description: '反覆壓擠炸出金黃空心脆皮，外酥內 Q 彈，逛夜市必備刷嘴零嘴！',
    googleMapsQuery: '地瓜球 推薦'
  },
  {
    id: 'food_03',
    name: '台南經典蚵仔煎',
    category: '小吃',
    rarity: '稀有',
    icon: '🍳',
    district: '台南花園夜市',
    description: '飽滿東石鮮蚵、鮮嫩小白菜與特調甜辣紅醬，粉漿邊緣焦香酥脆。',
    googleMapsQuery: '台南 蚵仔煎'
  },
  {
    id: 'food_04',
    name: '大腸包小腸',
    category: '小吃',
    rarity: '稀有',
    icon: '🌯',
    district: '台中逢甲夜市',
    description: '碳烤糯米腸夾入鮮肉香腸，鋪上酸菜、小黃瓜與生蒜，雙重飽足！',
    googleMapsQuery: '逢甲夜市 大腸包小腸'
  },
  {
    id: 'food_05',
    name: '黃金鹽酥雞',
    category: '小吃',
    rarity: '傳說',
    icon: '🍗',
    district: '台灣夜市宵夜之王',
    description: '獨門香料醃漬，高溫搶酥逼油，拌入大量九層塔與特製胡椒鹽，銷魂無比！',
    googleMapsQuery: '鹽酥雞 台灣第一'
  },
  {
    id: 'food_06',
    name: '深坑深山臭豆腐',
    category: '小吃',
    rarity: '稀有',
    icon: '🧈',
    district: '新北深坑老街',
    description: '天然發酵豆香撲鼻，外皮卡滋酥脆，搭配台式酸甜爽脆泡菜，越臭越香！',
    googleMapsQuery: '深坑 臭豆腐'
  },
  {
    id: 'food_07',
    name: '台灣黑金滷肉飯',
    category: '小吃',
    rarity: '傳說',
    icon: '🍚',
    district: '三重五燈獎/全台知名',
    description: '手切帶皮五花肉慢火煨煮出膠質，淋在熱騰騰白飯上，油亮甘甜入口即化。',
    googleMapsQuery: '滷肉飯 推薦'
  },

  // 2. 麵食
  {
    id: 'food_08',
    name: '紅燒半筋半肉牛肉麵',
    category: '麵食',
    rarity: '傳說',
    icon: '🍜',
    district: '台北永康街',
    description: '慢燉牛骨高湯醇厚濃郁，牛筋 Q 軟滑嫩、牛腩肉香四溢，搭配勁道手工麵！',
    googleMapsQuery: '台北 永康牛肉麵'
  },
  {
    id: 'food_09',
    name: '大腸蚵仔麵線',
    category: '麵食',
    rarity: '普通',
    icon: '🥣',
    district: '萬華龍山寺商圈',
    description: '柴魚高湯勾芡紅麵線，大腸滷得軟透入味，加一匙特製蒜泥與黑醋堪稱一絕。',
    googleMapsQuery: '萬華 大腸麵線'
  },
  {
    id: 'food_10',
    name: '府城擔仔麵',
    category: '麵食',
    rarity: '普通',
    icon: '🍲',
    district: '台南度小月',
    description: '百年老滷肉燥飄香，搭配鮮蝦高湯與經典火燒蝦，精緻小巧風味深長。',
    googleMapsQuery: '台南 度小月擔仔麵'
  },
  {
    id: 'food_11',
    name: '濃厚麻醬麵',
    category: '麵食',
    rarity: '普通',
    icon: '🥢',
    district: '宜蘭羅東夜市',
    description: '純白芝麻現磨濃郁醬汁，熱氣騰騰拌開香氣撲鼻，配上一碗蛤蜊湯最對味。',
    googleMapsQuery: '麻醬麵 推薦'
  },

  // 3. 甜點
  {
    id: 'food_12',
    name: '古早味綜合豆花',
    category: '甜點',
    rarity: '普通',
    icon: '🍧',
    district: '嘉義文化路夜市',
    description: '細緻綿密如絲綢般的黃豆豆花，加上小湯圓、花生與炒糖黑糖冰沙。',
    googleMapsQuery: '古早味 豆花'
  },
  {
    id: 'food_13',
    name: '爆漿脆皮車輪餅',
    category: '甜點',
    rarity: '普通',
    icon: '🥧',
    district: '全台巷弄下午茶',
    description: '現烤脆殼包覆滿滿萬丹紅豆與卡士達奶油，一口咬下瞬間爆漿燙口！',
    googleMapsQuery: '車輪餅 紅豆餅'
  },
  {
    id: 'food_14',
    name: '金鑽鳳梨酥',
    category: '甜點',
    rarity: '稀有',
    icon: '🍍',
    district: '南投八卦山 / 台北佳德',
    description: '嚴選金鑽鳳梨手工熬煮內餡，微酸果香纖維伴隨酥香奶香外皮，台灣代表伴手禮！',
    googleMapsQuery: '台灣 鳳梨酥 名店'
  },
  {
    id: 'food_15',
    name: '古法糖葫蘆',
    category: '甜點',
    rarity: '普通',
    icon: '🍡',
    district: '各大老街廟口',
    description: '晶瑩剔透冰脆糖衣，包裹酸甜番茄與化應子蜜餞，酸甜交織童年回憶。',
    googleMapsQuery: '夜市 糖葫蘆'
  },

  // 4. 飲品
  {
    id: 'food_16',
    name: '波霸黑糖珍珠鮮奶',
    category: '飲品',
    rarity: '傳說',
    icon: '🧋',
    district: '公館陳三鼎 / 台中發源',
    description: '現煮溫熱黑糖波霸在杯身暈染出虎紋，注入香濃小農鮮乳，名揚世界的台灣之光！',
    googleMapsQuery: '黑糖珍珠鮮奶 創始'
  },
  {
    id: 'food_17',
    name: '枋山芒果雪花冰',
    category: '飲品',
    rarity: '稀有',
    icon: '🥭',
    district: '台北永康街冰館',
    description: '綿密如雪牛奶冰底，鋪滿金黃愛文芒果切塊，淋上香濃煉乳與一球芒果冰淇淋。',
    googleMapsQuery: '芒果雪花冰 台北'
  },
  {
    id: 'food_18',
    name: '台南古早味冬瓜檸檬',
    category: '飲品',
    rarity: '普通',
    icon: '🍋',
    district: '台南義豐冬瓜茶',
    description: '百年老店冬瓜糖磚慢火慢熬，搭配現榨九如綠檸檬，消暑生津解油膩！',
    googleMapsQuery: '台南 義豐冬瓜茶'
  },
  {
    id: 'food_19',
    name: '夜市現打木瓜牛奶',
    category: '飲品',
    rarity: '普通',
    icon: '🥤',
    district: '高雄六合夜市',
    description: '熟透網室紅肉木瓜與純淨鮮乳現打，稠度恰到好處，濃醇香滑回味無窮。',
    googleMapsQuery: '高雄 木瓜牛奶'
  },
  {
    id: 'food_20',
    name: '日月潭紅玉紅茶 (台茶18號)',
    category: '飲品',
    rarity: '稀有',
    icon: '🫖',
    district: '南投日月潭水社',
    description: '特有薄荷香與天然肉桂尾韻，琥珀色明亮茶湯，台灣頂級單一莊園紅茶代表。',
    googleMapsQuery: '日月潭 紅玉紅茶'
  }
];

export class GachaSystem {
  /**
   * 隨機抽取一張美食卡
   * 權重：普通 60%, 稀有 30%, 傳說 10%
   */
  public static drawCard(): FoodCard {
    const roll = Math.random() * 100;
    let targetRarity: FoodRarity = '普通';

    if (roll < 10) {
      targetRarity = '傳說';
    } else if (roll < 40) {
      targetRarity = '稀有';
    } else {
      targetRarity = '普通';
    }

    const pool = FOOD_DATABASE.filter(c => c.rarity === targetRarity);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return chosen;
  }
}
