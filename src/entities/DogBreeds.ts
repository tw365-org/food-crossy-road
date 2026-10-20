export type DogSizeCategory = '超小型' | '小型' | '中型' | '大型';

export interface DogBreed {
  id: string;
  name: string;
  category: DogSizeCategory;
  renderSize: number;       // 視覺繪圖尺寸 (px)
  hitboxRadius: number;     // 碰撞箱半徑 (px，越小越容易在車縫穿梭)
  jumpSpeed: number;        // 跳躍速度 (數值越大跳越快)
  traitName: string;        // 特性名稱
  traitDesc: string;        // 特性說明
  unlockLevel: number;      // 解鎖關卡條件 (1 代表初始擁有)
  themeColors: {
    primary: string;        // 主毛色
    secondary: string;      // 搭配毛色/臉部花紋
    ears: string;           // 耳朵
    details: string;        // 斑紋/配件
  };
}

export const DOG_BREEDS: DogBreed[] = [
  // 1. 台灣土黃狗 (初始主角，均衡耐力)
  {
    id: 'dog_yellow',
    name: '台灣土黃狗',
    category: '中型',
    renderSize: 42,
    hitboxRadius: 16,
    jumpSpeed: 8.0,
    traitName: '夜市巡邏員',
    traitDesc: '台灣街頭最忠誠的守護者，體態適中，各項運動數值最穩定均衡。',
    unlockLevel: 1,
    themeColors: {
      primary: '#E58E26',
      secondary: '#FFF4E0',
      ears: '#B35400',
      details: '#E53935' // 紅項圈
    }
  },
  // 2. 台灣純黑狗 (通關第 1 關解鎖，夜市疾速)
  {
    id: 'dog_black',
    name: '台灣黑狗 (小黑)',
    category: '中型',
    renderSize: 42,
    hitboxRadius: 15,
    jumpSpeed: 9.2,
    traitName: '暗夜神行',
    traitDesc: '毛色漆黑反光，身手矯健，起跳移動速度提升 15%！',
    unlockLevel: 2,
    themeColors: {
      primary: '#2D3436',
      secondary: '#636E72',
      ears: '#1E272E',
      details: '#F1C40F' // 金項圈
    }
  },
  // 3. 威爾斯柯基犬 (通關第 2 關解鎖，底盤短腿超快連跳)
  {
    id: 'dog_corgi',
    name: '短腿柯基',
    category: '小型',
    renderSize: 36,
    hitboxRadius: 14,
    jumpSpeed: 10.0,
    traitName: '蜜桃低底盤',
    traitDesc: '圓滾滾蜜桃屁屁與招牌小短腿，跳躍頻率極快，落地回彈靈敏！',
    unlockLevel: 3,
    themeColors: {
      primary: '#E17055',
      secondary: '#FFFFFF',
      ears: '#D63031',
      details: '#00CEC9' // 藍項圈
    }
  },
  // 4. 吉娃娃 (通關第 3 關解鎖，超小型神級走位)
  {
    id: 'dog_chihuahua',
    name: '傲嬌吉娃娃',
    category: '超小型',
    renderSize: 28,
    hitboxRadius: 10,
    jumpSpeed: 8.5,
    traitName: '極致微型走位',
    traitDesc: '身型極其嬌小玲瓏，碰撞檢測體積減少 35%，極易在車流夾縫中超車！',
    unlockLevel: 4,
    themeColors: {
      primary: '#F39C12',
      secondary: '#FDFEFE',
      ears: '#D35400',
      details: '#9B59B6' // 紫項圈
    }
  },
  // 5. 柴犬 (通關第 4 關解鎖，傲嬌拒否抗水流)
  {
    id: 'dog_shiba',
    name: '赤柴 (阿柴)',
    category: '中型',
    renderSize: 40,
    hitboxRadius: 15,
    jumpSpeed: 8.0,
    traitName: '拒否犬之錨',
    traitDesc: '天生傲嬌固執，乘載竹筏與蒸籠時抗水流平穩度提升，不易失足滑落。',
    unlockLevel: 5,
    themeColors: {
      primary: '#D35400',
      secondary: '#F5EEF8',
      ears: '#A04000',
      details: '#27AE60' // 綠唐草方巾
    }
  },
  // 6. 紅貴賓 (通關第 5 關解鎖，時尚討喜增加關卡時限)
  {
    id: 'dog_poodle',
    name: '玩具紅貴賓',
    category: '小型',
    renderSize: 32,
    hitboxRadius: 12,
    jumpSpeed: 8.4,
    traitName: '社交小甜心',
    traitDesc: '泰迪熊般蓬鬆捲毛，討喜程度滿分，每關自動額外延長 8 秒時間！',
    unlockLevel: 6,
    themeColors: {
      primary: '#A0522D',
      secondary: '#D2691E',
      ears: '#8B4513',
      details: '#FF69B4' // 粉紅蝴蝶結
    }
  },
  // 7. 法國鬥牛犬 (通關第 6 關解鎖，肌肉噸位擦撞抵抗)
  {
    id: 'dog_frenchie',
    name: '法國鬥牛犬',
    category: '小型',
    renderSize: 36,
    hitboxRadius: 14,
    jumpSpeed: 7.8,
    traitName: '敦厚小鋼砲',
    traitDesc: '圓滾肌肉身材配大蝙蝠耳，下盤極穩，受到車流輕微擦撞時能彈開不失誤！',
    unlockLevel: 7,
    themeColors: {
      primary: '#ECEFF1',
      secondary: '#CFD8DC',
      ears: '#37474F',
      details: '#E91E63' // 亮眼項圈
    }
  },
  // 8. 邊境牧羊犬 (通關第 7 關解鎖，高智商風流殘影加分)
  {
    id: 'dog_collie',
    name: '邊境牧羊犬',
    category: '大型',
    renderSize: 46,
    hitboxRadius: 17,
    jumpSpeed: 9.5,
    traitName: '智商天花板',
    traitDesc: '全犬界智商霸主，起跳動作自帶風流殘影，關卡所有步進與通關分數 +25%！',
    unlockLevel: 8,
    themeColors: {
      primary: '#1E272E',
      secondary: '#FFFFFF',
      ears: '#000000',
      details: '#3498DB' // 湛藍領巾
    }
  },
  // 9. 黃金獵犬 (通關第 8 關解鎖，自帶天使聖盾)
  {
    id: 'dog_golden',
    name: '黃金獵犬',
    category: '大型',
    renderSize: 50,
    hitboxRadius: 18,
    jumpSpeed: 7.6,
    traitName: '天使金甲護盾',
    traitDesc: '暖心大天使，每場開局自帶 1 次「神聖護盾」，能無損免疫 1 次致命失誤！',
    unlockLevel: 9,
    themeColors: {
      primary: '#F39C12',
      secondary: '#FCF3CF',
      ears: '#D68910',
      details: '#2ECC71' // 綠色探險牽繩
    }
  },
  // 10. 哈士奇 (通關第 10 關全破後解鎖，二哈隨機狂暴大跳躍)
  {
    id: 'dog_husky',
    name: '西伯利亞哈士奇',
    category: '大型',
    renderSize: 48,
    hitboxRadius: 17,
    jumpSpeed: 9.0,
    traitName: '二哈狂暴飛躍',
    traitDesc: '傳說中的雪橇拆家王者，起跳時有 20% 機率爆發狂奔，直接向前飛躍 2 格！',
    unlockLevel: 10,
    themeColors: {
      primary: '#7F8C8D',
      secondary: '#FFFFFF',
      ears: '#2C3E50',
      details: '#00CEC9' // 冰藍異色瞳
    }
  }
];
