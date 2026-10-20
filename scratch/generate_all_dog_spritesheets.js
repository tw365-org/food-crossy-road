// 生成 10 款名犬的專屬 32x32 像素精靈圖集 (Modular Pixel Dog Spritesheets)
import fs from 'fs';
import path from 'path';

const FRAME_SIZE = 32;
const COLS = 4;
const ROWS = 5;
const WIDTH = COLS * FRAME_SIZE;
const HEIGHT = ROWS * FRAME_SIZE;

const DOG_STYLES = {
  dog_yellow: {
    name: '台灣土黃狗',
    primary: '#E58E26',
    dark: '#B35400',
    cream: '#FFF4E0',
    eye: '#1E272E',
    accessory: '#E53935',
    earType: 'floppy',
    tailType: 'curl',
    sizeFactor: 1.0
  },
  dog_black: {
    name: '台灣黑狗 (小黑)',
    primary: '#2D3436',
    dark: '#1E272E',
    cream: '#636E72',
    eye: '#E17055', // 琥珀眼
    accessory: '#F1C40F', // 金項圈
    earType: 'alert',
    tailType: 'long',
    sizeFactor: 1.0
  },
  dog_corgi: {
    name: '短腿柯基',
    primary: '#E17055',
    dark: '#D63031',
    cream: '#FFFFFF',
    eye: '#1E272E',
    accessory: '#00CEC9', // 藍色方巾
    earType: 'big_fox',
    tailType: 'peach_butt',
    sizeFactor: 0.9,
    shortLegs: true
  },
  dog_chihuahua: {
    name: '傲嬌吉娃娃',
    primary: '#F39C12',
    dark: '#D35400',
    cream: '#FCF3CF',
    eye: '#1E272E',
    accessory: '#9B59B6', // 紫色領結
    earType: 'giant_bat',
    tailType: 'thin',
    sizeFactor: 0.75, // 體積微型
    bigEyes: true
  },
  dog_shiba: {
    name: '赤柴 (阿柴)',
    primary: '#D35400',
    dark: '#A04000',
    cream: '#FFF9E6',
    eye: '#1E272E',
    accessory: '#27AE60', // 綠色唐草花紋包袱巾
    earType: 'triangle',
    tailType: 'curl',
    sizeFactor: 0.95
  },
  dog_poodle: {
    name: '玩具紅貴賓',
    primary: '#8D5B4C',
    dark: '#6E3D30',
    cream: '#B0887A',
    eye: '#1E272E',
    accessory: '#FF69B4', // 粉紅蝴蝶結
    earType: 'curly_pom',
    tailType: 'pom_pom',
    sizeFactor: 0.8,
    isCurly: true
  },
  dog_frenchie: {
    name: '法國鬥牛犬',
    primary: '#DFE6E9',
    dark: '#2D3436', // 黑斑
    cream: '#FFFFFF',
    eye: '#1E272E',
    accessory: '#E91E63', // 桃紅項圈
    earType: 'bat_round',
    tailType: 'stump',
    sizeFactor: 0.9,
    stoutBody: true
  },
  dog_collie: {
    name: '邊境牧羊犬',
    primary: '#1E272E', // 黑底
    dark: '#000000',
    cream: '#FFFFFF', // 白圍巾白臉中線
    eye: '#854D0E',
    accessory: '#3498DB', // 蔚藍領巾
    earType: 'tipped',
    tailType: 'plume',
    sizeFactor: 1.1,
    hasBlaze: true
  },
  dog_golden: {
    name: '黃金獵犬',
    primary: '#F5B041',
    dark: '#D68910',
    cream: '#FCF3CF',
    eye: '#1E272E',
    accessory: '#2ECC71', // 綠色冒險胸背帶
    earType: 'floppy_long',
    tailType: 'feathered',
    sizeFactor: 1.15
  },
  dog_husky: {
    name: '西伯利亞哈士奇',
    primary: '#7F8C8D', // 銀灰
    dark: '#2C3E50',
    cream: '#FFFFFF',
    eye: '#00CEC9', // 冰藍瞳孔！
    accessory: '#E74C3C',
    earType: 'pointy',
    tailType: 'plume',
    sizeFactor: 1.1,
    hasMask: true
  }
};

const outputDir = path.resolve('public/assets/dog');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [id, cfg] of Object.entries(DOG_STYLES)) {
  const rects = [];

  function pixel(x, y, color) {
    rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`);
  }

  function rect(x, y, w, h, color) {
    rects.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" />`);
  }

  const C_GOLD = cfg.primary;
  const C_DARK = cfg.dark;
  const C_CREAM = cfg.cream;
  const C_EYE = cfg.eye;
  const C_ACC = cfg.accessory;
  const C_PINK = '#FF7675';
  const C_WATER = '#00CEC9';
  const C_STAR = '#FDCB6E';

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ox = c * FRAME_SIZE;
      const oy = r * FRAME_SIZE;
      const frame = c;

      // 體型縮放位移
      const s = cfg.sizeFactor || 1.0;
      const legShort = cfg.shortLegs ? 2 : 0;
      const isSmall = cfg.sizeFactor < 0.85;

      if (r === 0) {
        // 面向上 (Up)
        const hopY = (frame === 1 || frame === 2) ? -2 : 0;
        const tailWiggle = frame % 2 === 0 ? 0 : (frame === 1 ? -2 : 2);

        // 耳朵
        if (cfg.earType === 'giant_bat' || cfg.earType === 'big_fox') {
          rect(ox + 6, oy + 5 + hopY, 5, 8, C_DARK);
          rect(ox + 21, oy + 5 + hopY, 5, 8, C_DARK);
        } else {
          rect(ox + 8, oy + 7 + hopY, 4, 6, C_DARK);
          rect(ox + 20, oy + 7 + hopY, 4, 6, C_DARK);
        }

        // 頭部
        rect(ox + 10, oy + 9 + hopY, 12, 10, C_GOLD);
        if (cfg.hasBlaze) {
          rect(ox + 15, oy + 9 + hopY, 2, 7, C_CREAM); // 邊牧白中線
        }

        // 項圈
        rect(ox + 11, oy + 19 + hopY, 10, 2, C_ACC);

        // 身體
        rect(ox + 9, oy + 21 + hopY, 14, 9, C_GOLD);
        if (cfg.hasBlaze) {
          rect(ox + 10, oy + 20 + hopY, 12, 3, C_CREAM); // 白圍巾
        }

        // 尾巴
        if (cfg.tailType === 'peach_butt') {
          // 柯基蜜桃愛心屁屁！
          rect(ox + 11, oy + 25 + hopY, 5, 4, C_GOLD);
          rect(ox + 16, oy + 25 + hopY, 5, 4, C_GOLD);
          rect(ox + 13, oy + 27 + hopY, 6, 2, C_CREAM);
        } else {
          rect(ox + 15 + tailWiggle, oy + 18 + hopY, 3, 3, C_GOLD);
          rect(ox + 17 + tailWiggle, oy + 16 + hopY, 3, 3, C_DARK);
        }

        // 短腳 / 正常腳
        rect(ox + 10, oy + 29 + hopY - legShort, 3, 2 + legShort, C_CREAM);
        rect(ox + 19, oy + 29 + hopY - legShort, 3, 2 + legShort, C_CREAM);

      } else if (r === 1) {
        // 面向下 (Down)
        const hopY = (frame === 1 || frame === 2) ? -2 : 0;
        const blink = frame === 3;
        const tongue = (frame === 1 || frame === 2);

        // 耳朵
        if (cfg.earType === 'giant_bat' || cfg.earType === 'big_fox') {
          rect(ox + 5, oy + 4 + hopY, 6, 8, C_DARK);
          rect(ox + 21, oy + 4 + hopY, 6, 8, C_DARK);
          rect(ox + 6, oy + 5 + hopY, 4, 6, C_PINK);
          rect(ox + 22, oy + 5 + hopY, 4, 6, C_PINK);
        } else if (cfg.earType === 'bat_round') {
          // 法鬥圓蝙蝠耳
          rect(ox + 6, oy + 6 + hopY, 5, 7, C_DARK);
          rect(ox + 21, oy + 6 + hopY, 5, 7, C_DARK);
        } else {
          rect(ox + 7, oy + 7 + hopY, 4, 5, C_DARK);
          rect(ox + 21, oy + 7 + hopY, 4, 5, C_DARK);
        }

        // 頭部
        rect(ox + 9, oy + 9 + hopY, 14, 11, C_GOLD);

        // 哈士奇 / 邊牧面部特徵
        if (cfg.hasMask) {
          rect(ox + 11, oy + 10 + hopY, 10, 8, C_CREAM);
          rect(ox + 14, oy + 10 + hopY, 4, 4, C_DARK); // 哈士奇三把火
        } else if (cfg.hasBlaze) {
          rect(ox + 14, oy + 9 + hopY, 4, 11, C_CREAM);
        }

        // 臉頰胸腹白毛
        rect(ox + 11, oy + 13 + hopY, 10, 7, C_CREAM);

        // 眼睛
        const eyeSize = cfg.bigEyes ? 3 : 2;
        if (blink) {
          rect(ox + 11, oy + 14 + hopY, 3, 1, C_EYE);
          rect(ox + 18, oy + 14 + hopY, 3, 1, C_EYE);
        } else {
          rect(ox + 11, oy + 13 + hopY, eyeSize, eyeSize, C_EYE);
          rect(ox + 18, oy + 13 + hopY, eyeSize, eyeSize, C_EYE);
          pixel(ox + 11, oy + 13 + hopY, '#FFFFFF');
          pixel(ox + 18, oy + 13 + hopY, '#FFFFFF');
        }

        // 腮紅
        rect(ox + 9, oy + 16 + hopY, 2, 2, C_PINK);
        rect(ox + 21, oy + 16 + hopY, 2, 2, C_PINK);

        // 鼻子嘴巴
        rect(ox + 15, oy + 15 + hopY, 2, 2, '#1E272E');
        if (tongue) {
          rect(ox + 15, oy + 17 + hopY, 2, 3, C_PINK);
        }

        // 項圈與裝飾
        rect(ox + 11, oy + 20 + hopY, 10, 2, C_ACC);

        // 身體
        rect(ox + 9, oy + 22 + hopY, 14, 8, C_GOLD);
        rect(ox + 12, oy + 22 + hopY, 8, 6, C_CREAM);

        // 腳爪
        rect(ox + 11, oy + 29 + hopY - legShort, 3, 2 + legShort, C_CREAM);
        rect(ox + 18, oy + 29 + hopY - legShort, 3, 2 + legShort, C_CREAM);

      } else if (r === 2) {
        // 側面向左 (Left)
        const hopY = (frame === 1 || frame === 2) ? -3 : 0;
        const stride = frame === 1 ? 2 : (frame === 3 ? -2 : 0);

        // 尾巴
        rect(ox + 23, oy + 17 + hopY, 3, 3, C_DARK);
        rect(ox + 22, oy + 19 + hopY, 3, 3, C_GOLD);

        // 身體
        rect(ox + 11, oy + 19 + hopY, 13, 9, C_GOLD);
        rect(ox + 10, oy + 21 + hopY, 4, 6, C_CREAM);

        // 耳朵
        rect(ox + 13, oy + 8 + hopY, 4, 6, C_DARK);

        // 頭與吻部
        rect(ox + 6, oy + 11 + hopY, 11, 9, C_GOLD);
        rect(ox + 4, oy + 14 + hopY, 6, 5, C_CREAM);
        pixel(ox + 4, oy + 14 + hopY, '#1E272E');
        rect(ox + 8, oy + 13 + hopY, 2, 2, C_EYE);

        // 項圈
        rect(ox + 10, oy + 19 + hopY, 3, 3, C_ACC);

        // 雙腳
        rect(ox + 7 + stride, oy + 28 + hopY - legShort, 3, 3 + legShort, C_CREAM);
        rect(ox + 19 - stride, oy + 28 + hopY - legShort, 3, 3 + legShort, C_CREAM);

      } else if (r === 3) {
        // 側面向右 (Right)
        const hopY = (frame === 1 || frame === 2) ? -3 : 0;
        const stride = frame === 1 ? 2 : (frame === 3 ? -2 : 0);

        rect(ox + 6, oy + 17 + hopY, 3, 3, C_DARK);
        rect(ox + 7, oy + 19 + hopY, 3, 3, C_GOLD);

        rect(ox + 8, oy + 19 + hopY, 13, 9, C_GOLD);
        rect(ox + 18, oy + 21 + hopY, 4, 6, C_CREAM);

        rect(ox + 15, oy + 8 + hopY, 4, 6, C_DARK);

        rect(ox + 15, oy + 11 + hopY, 11, 9, C_GOLD);
        rect(ox + 22, oy + 14 + hopY, 6, 5, C_CREAM);
        pixel(ox + 27, oy + 14 + hopY, '#1E272E');
        rect(ox + 22, oy + 13 + hopY, 2, 2, C_EYE);

        rect(ox + 19, oy + 19 + hopY, 3, 3, C_ACC);

        rect(ox + 22 - stride, oy + 28 + hopY - legShort, 3, 3 + legShort, C_CREAM);
        rect(ox + 10 + stride, oy + 28 + hopY - legShort, 3, 3 + legShort, C_CREAM);

      } else if (r === 4) {
        // 特殊幀
        if (c === 0) {
          // 眩暈
          rect(ox + 6, oy + 18, 20, 8, C_GOLD);
          rect(ox + 10, oy + 20, 12, 5, C_CREAM);
          rect(ox + 9, oy + 19, 3, 3, C_EYE);
          rect(ox + 20, oy + 19, 3, 3, C_EYE);
          rect(ox + 14, oy + 9, 3, 3, C_STAR);
          rect(ox + 6, oy + 13, 2, 2, C_STAR);
          rect(ox + 24, oy + 12, 2, 2, C_STAR);
        } else if (c === 1) {
          // 落水
          rect(ox + 4, oy + 22, 24, 2, C_WATER);
          rect(ox + 2, oy + 24, 28, 2, C_WATER);
          rect(ox + 11, oy + 12, 10, 10, C_GOLD);
          rect(ox + 13, oy + 15, 6, 6, C_CREAM);
          rect(ox + 12, oy + 14, 3, 3, C_EYE);
          rect(ox + 18, oy + 14, 3, 3, C_EYE);
        } else if (c === 2) {
          // 勝利歡呼
          rect(ox + 9, oy + 11, 14, 11, C_GOLD);
          rect(ox + 11, oy + 15, 10, 7, C_CREAM);
          rect(ox + 11, oy + 15, 3, 1, C_EYE);
          rect(ox + 18, oy + 15, 3, 1, C_EYE);
          rect(ox + 6, oy + 9, 3, 4, C_CREAM);
          rect(ox + 23, oy + 9, 3, 4, C_CREAM);
          // 愛心
          rect(ox + 14, oy + 3, 4, 3, '#E53935');
        } else {
          // 待機小睡
          rect(ox + 8, oy + 19, 16, 8, C_GOLD);
          rect(ox + 8, oy + 21, 2, 1, C_EYE);
          rect(ox + 22, oy + 11, 4, 1, C_CREAM);
        }
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" shape-rendering="crispEdges">
  ${rects.join('\n  ')}
</svg>`;

  const outPath = path.join(outputDir, `${id}.svg`);
  fs.writeFileSync(outPath, svg, 'utf-8');
  console.log(`✅ 已生成 ${cfg.name} 精靈圖集: ${id}.svg`);
}
