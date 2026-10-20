/**
 * 純 Canvas 2D 程式化向量繪圖庫 (Procedural Vector Art)
 * 100% 零外部圖片相依，高畫質且渲染極速
 */

export class ProceduralArt {
  /**
   * 繪製可愛黃狗主角 (台灣米克斯/柴犬)
   */
  public static drawDog(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    direction: 'up' | 'down' | 'left' | 'right',
    jumpHeight: number = 0,
    squashX: number = 1,
    squashY: number = 1
  ) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2 - jumpHeight);
    ctx.scale(squashX, squashY);

    // 依朝向旋轉
    if (direction === 'down') ctx.rotate(Math.PI);
    else if (direction === 'left') ctx.rotate(-Math.PI / 2);
    else if (direction === 'right') ctx.rotate(Math.PI / 2);

    const r = size * 0.38;

    // 1. 影子 (若在空中跳躍則陰影停留在地面)
    ctx.save();
    ctx.translate(0, jumpHeight);
    ctx.scale(1 - jumpHeight / 50, 0.4);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. 狗尾巴 (輕微搖擺)
    const tailWiggle = Math.sin(Date.now() / 150) * 0.25;
    ctx.save();
    ctx.translate(0, r * 0.7);
    ctx.rotate(tailWiggle);
    ctx.fillStyle = '#DD6B20';
    ctx.beginPath();
    ctx.ellipse(0, 4, 3, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. 身體主幹
    ctx.fillStyle = '#F6AD55';
    ctx.beginPath();
    ctx.ellipse(0, 2, r * 0.85, r * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. 耳朵 (三角形折耳)
    ctx.fillStyle = '#DD6B20';
    // 左耳
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.3);
    ctx.lineTo(-r * 0.9, -r * 0.95);
    ctx.lineTo(-r * 0.2, -r * 0.8);
    ctx.closePath();
    ctx.fill();

    // 右耳
    ctx.beginPath();
    ctx.moveTo(r * 0.7, -r * 0.3);
    ctx.lineTo(r * 0.9, -r * 0.95);
    ctx.lineTo(r * 0.2, -r * 0.8);
    ctx.closePath();
    ctx.fill();

    // 5. 臉部白色/淺色毛斑
    ctx.fillStyle = '#FFFAF0';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.2, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. 眼睛
    ctx.fillStyle = '#2D3748';
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.35, 2.5, 0, Math.PI * 2);
    ctx.arc(r * 0.3, -r * 0.35, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 眼神高光
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 0.3 - 0.8, -r * 0.35 - 0.8, 1, 0, Math.PI * 2);
    ctx.arc(r * 0.3 - 0.8, -r * 0.35 - 0.8, 1, 0, Math.PI * 2);
    ctx.fill();

    // 7. 鼻子
    ctx.fillStyle = '#2D3748';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.1, 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 8. 舌頭吐出
    ctx.fillStyle = '#FEB2B2';
    ctx.beginPath();
    ctx.ellipse(0, 1, 3, 4, 0, 0, Math.PI);
    ctx.fill();

    // 9. 臉頰腮紅
    ctx.fillStyle = 'rgba(254, 178, 178, 0.6)';
    ctx.beginPath();
    ctx.arc(-r * 0.5, -r * 0.15, 3.5, 0, Math.PI * 2);
    ctx.arc(r * 0.5, -r * 0.15, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 繪製台灣道路車輛 (轎車、黃色計程車、藍色貨車、機車)
   */
  public static drawVehicle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    type: 'car' | 'taxi' | 'truck' | 'scooter',
    speed: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    const facingLeft = speed < 0;
    if (facingLeft) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    // 車輪陰影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(2, h - 3, w - 4, 5);

    if (type === 'scooter') {
      // 台灣特色機車
      // 車身
      ctx.fillStyle = '#3182CE';
      ctx.beginPath();
      ctx.roundRect(4, 6, w - 8, h - 12, 6);
      ctx.fill();

      // 安全帽騎士
      ctx.fillStyle = '#ECC94B'; // 黃色西瓜皮安全帽
      ctx.beginPath();
      ctx.arc(w * 0.45, h / 2, 7, 0, Math.PI * 2);
      ctx.fill();

      // 車頭燈與擋泥板
      ctx.fillStyle = '#FAF089';
      ctx.fillRect(w - 6, h / 2 - 3, 5, 6);

      // 車尾紅燈
      ctx.fillStyle = '#E53E3E';
      ctx.fillRect(1, h / 2 - 2, 3, 4);

    } else if (type === 'taxi') {
      // 台灣黃色計程車
      ctx.fillStyle = '#ECC94B';
      ctx.beginPath();
      ctx.roundRect(0, 4, w, h - 8, 8);
      ctx.fill();

      // 車窗
      ctx.fillStyle = '#2B6CB0';
      ctx.fillRect(w * 0.25, 7, w * 0.45, h - 14);

      // 計程車頂燈
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(w * 0.45, 0, w * 0.18, 4);
      ctx.fillStyle = '#C53030';
      ctx.font = '7px sans-serif';
      ctx.fillText('TAXI', w * 0.46, 3.5);

      // 頭燈與尾燈
      ctx.fillStyle = '#FFF5B8';
      ctx.fillRect(w - 4, 6, 3, 4);
      ctx.fillRect(w - 4, h - 10, 3, 4);
      ctx.fillStyle = '#E53E3E';
      ctx.fillRect(1, 6, 2, 4);
      ctx.fillRect(1, h - 10, 2, 4);

    } else if (type === 'truck') {
      // 藍色小發財貨車
      // 車頭
      ctx.fillStyle = '#2B6CB0';
      ctx.beginPath();
      ctx.roundRect(w * 0.55, 3, w * 0.45, h - 6, 6);
      ctx.fill();

      // 擋風玻璃
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(w * 0.65, 6, w * 0.22, h - 12);

      // 後貨斗 (木箱或帆布)
      ctx.fillStyle = '#4A5568';
      ctx.beginPath();
      ctx.roundRect(2, 4, w * 0.52, h - 8, 4);
      ctx.fill();

      // 貨物木箱
      ctx.fillStyle = '#D69E2E';
      ctx.fillRect(6, 7, w * 0.42, h - 14);

    } else {
      // 一般自小客車 (紅 / 綠 / 橘)
      ctx.fillStyle = '#E53E3E';
      ctx.beginPath();
      ctx.roundRect(0, 4, w, h - 8, 8);
      ctx.fill();

      // 車頂天窗與玻璃
      ctx.fillStyle = '#CBD5E0';
      ctx.fillRect(w * 0.22, 6, w * 0.5, h - 12);

      // 車頭燈
      ctx.fillStyle = '#FEFCBF';
      ctx.fillRect(w - 3, 6, 3, 4);
      ctx.fillRect(w - 3, h - 10, 3, 4);
    }

    ctx.restore();
  }

  /**
   * 繪製河流竹筏 (綁繩原木拼排)
   */
  public static drawRaft(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // 水波外環反光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fillRect(-2, -1, w + 4, h + 2);

    // 竹管排數
    const numLogs = 4;
    const logHeight = h / numLogs;

    for (let i = 0; i < numLogs; i++) {
      const logY = i * logHeight;
      // 竹子綠褐色漸層
      ctx.fillStyle = i % 2 === 0 ? '#48BB78' : '#38A169';
      ctx.beginPath();
      ctx.roundRect(0, logY + 1, w, logHeight - 2, 4);
      ctx.fill();

      // 竹節橫紋
      ctx.fillStyle = '#22543D';
      ctx.fillRect(w * 0.25, logY + 1, 2, logHeight - 2);
      ctx.fillRect(w * 0.55, logY + 1, 2, logHeight - 2);
      ctx.fillRect(w * 0.8, logY + 1, 2, logHeight - 2);
    }

    // 綁繩
    ctx.fillStyle = '#744210';
    ctx.fillRect(w * 0.18, 0, 3, h);
    ctx.fillRect(w * 0.82, 0, 3, h);

    ctx.restore();
  }

  /**
   * 繪製河流上的傳統點心蒸籠 (浮島)
   */
  public static drawSteamer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // 蒸籠外圈竹木
    ctx.fillStyle = '#D69E2E';
    ctx.beginPath();
    ctx.roundRect(0, 2, w, h - 4, 8);
    ctx.fill();

    // 蒸籠內裡
    ctx.fillStyle = '#F6E05E';
    ctx.beginPath();
    ctx.roundRect(3, 4, w - 6, h - 8, 6);
    ctx.fill();

    // 蒸籠裡的小籠包 / 包子
    const buns = Math.max(2, Math.floor(w / 28));
    const step = (w - 12) / buns;
    for (let i = 0; i < buns; i++) {
      const bunX = 8 + i * step + step / 2;
      const bunY = h / 2;

      // 包子白胖主體
      ctx.fillStyle = '#FFFAF0';
      ctx.beginPath();
      ctx.arc(bunX, bunY, 7, 0, Math.PI * 2);
      ctx.fill();

      // 頂部抓皺
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(bunX, bunY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 熱騰騰蒸氣動畫
    const steamDrift = (Date.now() / 300) % 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.2 - steamDrift, 3, 0, Math.PI * 2);
    ctx.arc(w * 0.65, h * 0.3 - steamDrift, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 繪製終點夜市小吃攤位 (紅黃條紋遮雨棚、大紅燈籠、熱氣美食)
   */
  public static drawFoodStall(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    name: string = '士林小吃'
  ) {
    ctx.save();
    ctx.translate(x, y);

    // 攤車木座
    ctx.fillStyle = '#744210';
    ctx.fillRect(4, h * 0.45, w - 8, h * 0.5);

    // 攤車不鏽鋼料理台
    ctx.fillStyle = '#CBD5E0';
    ctx.fillRect(6, h * 0.4, w - 12, h * 0.15);

    // 招牌紅白遮雨棚
    const stripeCount = 6;
    const stripeW = w / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#E53E3E' : '#FFFFFF';
      ctx.fillRect(i * stripeW, 0, stripeW, h * 0.38);
    }

    // 雨棚波浪下擺
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#E53E3E' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(i * stripeW + stripeW / 2, h * 0.38, stripeW / 2, 0, Math.PI);
      ctx.fill();
    }

    // 兩側燈籠 (紅燈籠微光)
    ctx.fillStyle = '#E53E3E';
    ctx.beginPath();
    ctx.ellipse(8, h * 0.28, 5, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(w - 8, h * 0.28, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 燈籠黃光芯
    ctx.fillStyle = '#FEFCBF';
    ctx.beginPath();
    ctx.arc(8, h * 0.28, 2, 0, Math.PI * 2);
    ctx.arc(w - 8, h * 0.28, 2, 0, Math.PI * 2);
    ctx.fill();

    // 攤位招牌字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, w / 2, h * 0.72);

    ctx.restore();
  }

  /**
   * 繪製鐵路與疾駛列車
   */
  public static drawTrain(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    speed: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    const facingLeft = speed < 0;
    if (facingLeft) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    // 列車車身 (台鐵/高鐵銀白+亮橘條紋)
    ctx.fillStyle = '#EDF2F7';
    ctx.beginPath();
    ctx.roundRect(0, 4, w, h - 8, 8);
    ctx.fill();

    // 車身橘色競速線
    ctx.fillStyle = '#DD6B20';
    ctx.fillRect(0, h / 2 - 2, w, 5);

    // 車窗排
    const windowCount = Math.floor(w / 22);
    ctx.fillStyle = '#2D3748';
    for (let i = 0; i < windowCount; i++) {
      ctx.fillRect(10 + i * 22, 7, 14, h - 14);
    }

    // 車頭擋風大玻璃
    ctx.fillStyle = '#4A5568';
    ctx.beginPath();
    ctx.roundRect(w - 18, 6, 14, h - 12, 4);
    ctx.fill();

    // 強光頭燈
    ctx.fillStyle = '#FFF5B8';
    ctx.shadowColor = '#FAF089';
    ctx.shadowBlur = 12;
    ctx.fillRect(w - 4, 7, 3, 5);
    ctx.fillRect(w - 4, h - 12, 3, 5);

    ctx.restore();
  }
}
