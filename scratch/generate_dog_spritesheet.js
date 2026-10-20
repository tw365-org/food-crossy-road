// 產生 CC0 經典像素小黃狗精靈圖集 (Pixel Art Dog Spritesheet)
// 尺寸：128x160 (5 列 x 4 欄，每格 32x32 像素)
import fs from 'fs';
import path from 'path';

const FRAME_SIZE = 32;
const COLS = 4;
const ROWS = 5;
const WIDTH = COLS * FRAME_SIZE;
const HEIGHT = ROWS * FRAME_SIZE;

let rects = [];

function pixel(x, y, color) {
  rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`);
}

function rect(x, y, w, h, color) {
  rects.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" />`);
}

// 顏色常數 (柴犬/台灣黃狗夜市配色)
const C_GOLD = '#E58E26';    // 主毛色
const C_DARK = '#B35400';    // 深毛色/耳背
const C_CREAM = '#FFF4E0';   // 臉頰胸腹白毛
const C_EYE = '#1E272E';     // 眼睛鼻子
const C_RED = '#E53935';     // 項圈
const C_BELL = '#F1C40F';    // 項圈鈴鐺
const C_PINK = '#FF7675';    // 腮紅/舌頭
const C_WATER = '#00CEC9';   // 水花
const C_STAR = '#FDCB6E';    // 眩暈星星

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const ox = c * FRAME_SIZE;
    const oy = r * FRAME_SIZE;
    const frame = c;

    if (r === 0) {
      // 背面 (面向上方 North / Up)
      // 腳步與尾巴擺動
      const tailWiggle = frame % 2 === 0 ? 0 : (frame === 1 ? -2 : 2);
      const hopY = frame === 1 || frame === 2 ? -2 : 0;

      // 耳朵 (背面深色)
      rect(ox + 8, oy + 7 + hopY, 4, 6, C_DARK);
      rect(ox + 20, oy + 7 + hopY, 4, 6, C_DARK);
      // 頭部
      rect(ox + 10, oy + 9 + hopY, 12, 10, C_GOLD);
      // 項圈
      rect(ox + 11, oy + 19 + hopY, 10, 2, C_RED);
      // 身體
      rect(ox + 9, oy + 21 + hopY, 14, 9, C_GOLD);
      // 尾巴 (捲尾搖擺)
      rect(ox + 15 + tailWiggle, oy + 18 + hopY, 3, 3, C_GOLD);
      rect(ox + 17 + tailWiggle, oy + 16 + hopY, 3, 3, C_DARK);
      // 腳
      rect(ox + 10, oy + 29 + hopY, 3, 2, C_CREAM);
      rect(ox + 19, oy + 29 + hopY, 3, 2, C_CREAM);

    } else if (r === 1) {
      // 正面 (面向下方 South / Down)
      const hopY = frame === 1 || frame === 2 ? -2 : 0;
      const blink = frame === 3;
      const tongue = frame === 1 || frame === 2;

      // 耳朵
      rect(ox + 7, oy + 7 + hopY, 4, 5, C_DARK);
      rect(ox + 21, oy + 7 + hopY, 4, 5, C_DARK);
      rect(ox + 8, oy + 8 + hopY, 2, 3, C_PINK);
      rect(ox + 22, oy + 8 + hopY, 2, 3, C_PINK);

      // 頭部
      rect(ox + 9, oy + 9 + hopY, 14, 11, C_GOLD);
      // 臉頰與口吻白毛
      rect(ox + 11, oy + 13 + hopY, 10, 7, C_CREAM);
      rect(ox + 13, oy + 11 + hopY, 6, 2, C_CREAM);

      // 眼睛
      if (blink) {
        rect(ox + 11, oy + 14 + hopY, 3, 1, C_EYE);
        rect(ox + 18, oy + 14 + hopY, 3, 1, C_EYE);
      } else {
        rect(ox + 11, oy + 13 + hopY, 3, 3, C_EYE);
        rect(ox + 18, oy + 13 + hopY, 3, 3, C_EYE);
        pixel(ox + 11, oy + 13 + hopY, '#FFFFFF');
        pixel(ox + 18, oy + 13 + hopY, '#FFFFFF');
      }

      // 腮紅
      rect(ox + 9, oy + 16 + hopY, 2, 2, C_PINK);
      rect(ox + 21, oy + 16 + hopY, 2, 2, C_PINK);

      // 鼻子與嘴巴
      rect(ox + 15, oy + 15 + hopY, 2, 2, C_EYE);
      if (tongue) {
        rect(ox + 15, oy + 17 + hopY, 2, 3, C_PINK);
      }

      // 項圈與鈴鐺
      rect(ox + 11, oy + 20 + hopY, 10, 2, C_RED);
      rect(ox + 15, oy + 21 + hopY, 2, 2, C_BELL);

      // 身體與白肚皮
      rect(ox + 9, oy + 22 + hopY, 14, 8, C_GOLD);
      rect(ox + 12, oy + 22 + hopY, 8, 6, C_CREAM);

      // 前腳爪
      rect(ox + 11, oy + 29 + hopY, 3, 2, C_CREAM);
      rect(ox + 18, oy + 29 + hopY, 3, 2, C_CREAM);

    } else if (r === 2) {
      // 側面向左 (West / Left)
      const hopY = frame === 1 || frame === 2 ? -3 : 0;
      const legStride = frame === 1 ? 2 : (frame === 3 ? -2 : 0);

      // 尾巴
      rect(ox + 23, oy + 17 + hopY, 3, 3, C_DARK);
      rect(ox + 22, oy + 19 + hopY, 3, 3, C_GOLD);

      // 身體
      rect(ox + 11, oy + 19 + hopY, 13, 9, C_GOLD);
      rect(ox + 10, oy + 21 + hopY, 4, 6, C_CREAM);

      // 耳朵
      rect(ox + 13, oy + 8 + hopY, 4, 6, C_DARK);
      rect(ox + 14, oy + 9 + hopY, 2, 4, C_PINK);

      // 頭與嘴唇
      rect(ox + 6, oy + 11 + hopY, 11, 9, C_GOLD);
      rect(ox + 4, oy + 14 + hopY, 6, 5, C_CREAM);
      // 鼻子與眼
      pixel(ox + 4, oy + 14 + hopY, C_EYE);
      rect(ox + 8, oy + 13 + hopY, 2, 2, C_EYE);
      pixel(ox + 8, oy + 13 + hopY, '#FFFFFF');

      // 項圈
      rect(ox + 10, oy + 19 + hopY, 3, 3, C_RED);

      // 雙腳
      rect(ox + 7 + legStride, oy + 28 + hopY, 3, 3, C_CREAM);
      rect(ox + 19 - legStride, oy + 28 + hopY, 3, 3, C_CREAM);

    } else if (r === 3) {
      // 側面向右 (East / Right - 水平鏡像)
      const hopY = frame === 1 || frame === 2 ? -3 : 0;
      const legStride = frame === 1 ? 2 : (frame === 3 ? -2 : 0);

      // 尾巴
      rect(ox + 6, oy + 17 + hopY, 3, 3, C_DARK);
      rect(ox + 7, oy + 19 + hopY, 3, 3, C_GOLD);

      // 身體
      rect(ox + 8, oy + 19 + hopY, 13, 9, C_GOLD);
      rect(ox + 18, oy + 21 + hopY, 4, 6, C_CREAM);

      // 耳朵
      rect(ox + 15, oy + 8 + hopY, 4, 6, C_DARK);
      rect(ox + 16, oy + 9 + hopY, 2, 4, C_PINK);

      // 頭與嘴唇
      rect(ox + 15, oy + 11 + hopY, 11, 9, C_GOLD);
      rect(ox + 22, oy + 14 + hopY, 6, 5, C_CREAM);
      // 鼻子與眼
      pixel(ox + 27, oy + 14 + hopY, C_EYE);
      rect(ox + 22, oy + 13 + hopY, 2, 2, C_EYE);
      pixel(ox + 23, oy + 13 + hopY, '#FFFFFF');

      // 項圈
      rect(ox + 19, oy + 19 + hopY, 3, 3, C_RED);

      // 雙腳
      rect(ox + 22 - legStride, oy + 28 + hopY, 3, 3, C_CREAM);
      rect(ox + 10 + legStride, oy + 28 + hopY, 3, 3, C_CREAM);

    } else if (r === 4) {
      // 特殊動作
      if (c === 0) {
        // 1. 被撞眩暈 (Hurt) - 扁平貼地、蚊香眼
        rect(ox + 6, oy + 18, 20, 8, C_GOLD);
        rect(ox + 10, oy + 20, 12, 5, C_CREAM);
        // 蚊香眼 @_@
        rect(ox + 9, oy + 19, 3, 3, C_EYE);
        pixel(ox + 10, oy + 20, '#FFFFFF');
        rect(ox + 20, oy + 19, 3, 3, C_EYE);
        pixel(ox + 21, oy + 20, '#FFFFFF');
        // 星星
        rect(ox + 14, oy + 9, 3, 3, C_STAR);
        rect(ox + 6, oy + 13, 2, 2, C_STAR);
        rect(ox + 24, oy + 12, 2, 2, C_STAR);

      } else if (c === 1) {
        // 2. 落水撲通 (Splash) - 露出小狗頭、水波環
        // 水波
        rect(ox + 4, oy + 22, 24, 2, C_WATER);
        rect(ox + 2, oy + 24, 28, 2, C_WATER);
        // 水花水珠
        rect(ox + 5, oy + 15, 2, 3, C_WATER);
        rect(ox + 25, oy + 14, 2, 3, C_WATER);
        // 慌張的狗頭
        rect(ox + 11, oy + 12, 10, 10, C_GOLD);
        rect(ox + 13, oy + 15, 6, 6, C_CREAM);
        // 圓圓的驚嚇大眼
        rect(ox + 12, oy + 14, 3, 3, C_EYE);
        pixel(ox + 13, oy + 14, '#FFFFFF');
        rect(ox + 18, oy + 14, 3, 3, C_EYE);
        pixel(ox + 19, oy + 14, '#FFFFFF');

      } else if (c === 2) {
        // 3. 通關勝利 (Victory) - 歡呼高舉雙手雙爪、愛心
        // 狗身
        rect(ox + 9, oy + 11, 14, 11, C_GOLD);
        rect(ox + 11, oy + 15, 10, 7, C_CREAM);
        // 微笑眼
        rect(ox + 11, oy + 15, 3, 1, C_EYE);
        rect(ox + 18, oy + 15, 3, 1, C_EYE);
        rect(ox + 15, oy + 16, 2, 2, C_PINK);
        // 高舉前爪
        rect(ox + 6, oy + 9, 3, 4, C_CREAM);
        rect(ox + 23, oy + 9, 3, 4, C_CREAM);
        // 愛心
        rect(ox + 14, oy + 3, 4, 3, C_RED);
        pixel(ox + 13, oy + 3, C_RED);
        pixel(ox + 18, oy + 3, C_RED);
        rect(ox + 15, oy + 6, 2, 2, C_RED);

      } else {
        // 4. 趴下待機 (Sleep / Relax)
        rect(ox + 8, oy + 19, 16, 8, C_GOLD);
        rect(ox + 6, oy + 17, 8, 8, C_GOLD);
        rect(ox + 8, oy + 21, 2, 1, C_EYE);
        rect(ox + 10, oy + 22, 2, 2, C_EYE);
        // 鼾聲 Zzz
        rect(ox + 22, oy + 11, 4, 1, C_CREAM);
        rect(ox + 24, oy + 12, 1, 1, C_CREAM);
        rect(ox + 22, oy + 13, 4, 1, C_CREAM);
      }
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" shape-rendering="crispEdges">
  ${rects.join('\n  ')}
</svg>`;

const outputPath = path.resolve('public/assets/dog/dog_spritesheet.svg');
fs.writeFileSync(outputPath, svg, 'utf-8');
console.log('✅ 像素小黃狗精靈圖集已生成：', outputPath);
