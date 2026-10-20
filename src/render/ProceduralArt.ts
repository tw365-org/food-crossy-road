import { DogBreed } from '../entities/DogBreeds';

/**
 * 純 Canvas 2D 程式化向量繪圖庫 (Procedural Vector Art)
 * 支援 10 種真實狗狗外觀、車輛、河道浮台與夜市攤販
 */
export class ProceduralArt {
  /**
   * 繪製 10 大犬種 (支援大中小體型、專屬毛色、耳朵與配件)
   */
  public static drawDog(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    direction: 'up' | 'down' | 'left' | 'right',
    jumpHeight: number = 0,
    squashX: number = 1,
    squashY: number = 1,
    breed?: DogBreed,
    hasShield: boolean = false
  ) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2 - jumpHeight);
    ctx.scale(squashX, squashY);

    if (direction === 'down') ctx.rotate(Math.PI);
    else if (direction === 'left') ctx.rotate(-Math.PI / 2);
    else if (direction === 'right') ctx.rotate(Math.PI / 2);

    const r = size * 0.38;

    // 毛色設定
    const cPrimary = breed?.themeColors.primary || '#E58E26';
    const cSecondary = breed?.themeColors.secondary || '#FFF4E0';
    const cEars = breed?.themeColors.ears || '#B35400';
    const cDetails = breed?.themeColors.details || '#E53935';

    // 1. 影子
    ctx.save();
    ctx.translate(0, jumpHeight);
    ctx.scale(1 - jumpHeight / 50, 0.4);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. 狗尾巴
    const tailWiggle = Math.sin(Date.now() / 150) * 0.25;
    ctx.save();
    ctx.translate(0, r * 0.7);
    ctx.rotate(tailWiggle);

    if (breed?.id === 'dog_corgi') {
      // 柯基蜜桃愛心屁屁短尾
      ctx.fillStyle = cPrimary;
      ctx.beginPath();
      ctx.arc(-2, 3, 3, 0, Math.PI * 2);
      ctx.arc(2, 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = cEars;
      ctx.beginPath();
      ctx.ellipse(0, 4, 3, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. 身體主幹
    ctx.fillStyle = cPrimary;
    ctx.beginPath();
    ctx.ellipse(0, 2, r * 0.85, r * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. 耳朵
    ctx.fillStyle = cEars;
    if (breed?.id === 'dog_chihuahua' || breed?.id === 'dog_frenchie') {
      // 大立耳 / 蝙蝠耳
      ctx.beginPath();
      ctx.ellipse(-r * 0.7, -r * 0.6, 4, 8, -0.3, 0, Math.PI * 2);
      ctx.ellipse(r * 0.7, -r * 0.6, 4, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 垂耳 / 三角折耳
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.3);
      ctx.lineTo(-r * 0.95, -r * 0.95);
      ctx.lineTo(-r * 0.2, -r * 0.8);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.7, -r * 0.3);
      ctx.lineTo(r * 0.95, -r * 0.95);
      ctx.lineTo(r * 0.2, -r * 0.8);
      ctx.closePath();
      ctx.fill();
    }

    // 5. 臉頰與胸腹部斑紋
    ctx.fillStyle = cSecondary;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.2, r * 0.52, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. 眼睛
    const eyeColor = breed?.id === 'dog_husky' ? '#00CEC9' : '#1E272E'; // 哈士奇冰藍眼
    ctx.fillStyle = eyeColor;
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
    ctx.fillStyle = '#1E272E';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.1, 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 8. 舌頭吐出
    ctx.fillStyle = '#FEB2B2';
    ctx.beginPath();
    ctx.ellipse(0, 1, 3, 4, 0, 0, Math.PI);
    ctx.fill();

    // 9. 項圈與胸背飾品
    ctx.fillStyle = cDetails;
    ctx.beginPath();
    ctx.roundRect(-r * 0.55, r * 0.22, r * 1.1, 3.5, 2);
    ctx.fill();

    // 10. 黃金獵犬專屬聖盾光環 (Shield)
    if (hasShield) {
      ctx.strokeStyle = '#F1C40F';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#F39C12';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * 繪製台灣道路車輛
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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(2, h - 3, w - 4, 5);

    if (type === 'scooter') {
      ctx.fillStyle = '#3182CE';
      ctx.beginPath();
      ctx.roundRect(4, 6, w - 8, h - 12, 6);
      ctx.fill();

      ctx.fillStyle = '#ECC94B';
      ctx.beginPath();
      ctx.arc(w * 0.45, h / 2, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FAF089';
      ctx.fillRect(w - 6, h / 2 - 3, 5, 6);

      ctx.fillStyle = '#E53E3E';
      ctx.fillRect(1, h / 2 - 2, 3, 4);

    } else if (type === 'taxi') {
      ctx.fillStyle = '#ECC94B';
      ctx.beginPath();
      ctx.roundRect(0, 4, w, h - 8, 8);
      ctx.fill();

      ctx.fillStyle = '#2B6CB0';
      ctx.fillRect(w * 0.25, 7, w * 0.45, h - 14);

      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(w * 0.45, 0, w * 0.18, 4);

      ctx.fillStyle = '#FFF5B8';
      ctx.fillRect(w - 4, 6, 3, 4);
      ctx.fillRect(w - 4, h - 10, 3, 4);
      ctx.fillStyle = '#E53E3E';
      ctx.fillRect(1, 6, 2, 4);
      ctx.fillRect(1, h - 10, 2, 4);

    } else if (type === 'truck') {
      ctx.fillStyle = '#2B6CB0';
      ctx.beginPath();
      ctx.roundRect(w * 0.55, 3, w * 0.45, h - 6, 6);
      ctx.fill();

      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(w * 0.65, 6, w * 0.22, h - 12);

      ctx.fillStyle = '#4A5568';
      ctx.beginPath();
      ctx.roundRect(2, 4, w * 0.52, h - 8, 4);
      ctx.fill();

      ctx.fillStyle = '#D69E2E';
      ctx.fillRect(6, 7, w * 0.42, h - 14);

    } else {
      ctx.fillStyle = '#E53E3E';
      ctx.beginPath();
      ctx.roundRect(0, 4, w, h - 8, 8);
      ctx.fill();

      ctx.fillStyle = '#CBD5E0';
      ctx.fillRect(w * 0.22, 6, w * 0.5, h - 12);

      ctx.fillStyle = '#FEFCBF';
      ctx.fillRect(w - 3, 6, 3, 4);
      ctx.fillRect(w - 3, h - 10, 3, 4);
    }

    ctx.restore();
  }

  /**
   * 繪製河流竹筏
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

    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fillRect(-2, -1, w + 4, h + 2);

    const numLogs = 4;
    const logHeight = h / numLogs;

    for (let i = 0; i < numLogs; i++) {
      const logY = i * logHeight;
      ctx.fillStyle = i % 2 === 0 ? '#48BB78' : '#38A169';
      ctx.beginPath();
      ctx.roundRect(0, logY + 1, w, logHeight - 2, 4);
      ctx.fill();

      ctx.fillStyle = '#22543D';
      ctx.fillRect(w * 0.25, logY + 1, 2, logHeight - 2);
      ctx.fillRect(w * 0.55, logY + 1, 2, logHeight - 2);
      ctx.fillRect(w * 0.8, logY + 1, 2, logHeight - 2);
    }

    ctx.fillStyle = '#744210';
    ctx.fillRect(w * 0.18, 0, 3, h);
    ctx.fillRect(w * 0.82, 0, 3, h);

    ctx.restore();
  }

  /**
   * 繪製傳統點心蒸籠 (浮島)
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

    ctx.fillStyle = '#D69E2E';
    ctx.beginPath();
    ctx.roundRect(0, 2, w, h - 4, 8);
    ctx.fill();

    ctx.fillStyle = '#F6E05E';
    ctx.beginPath();
    ctx.roundRect(3, 4, w - 6, h - 8, 6);
    ctx.fill();

    const buns = Math.max(2, Math.floor(w / 28));
    const step = (w - 12) / buns;
    for (let i = 0; i < buns; i++) {
      const bunX = 8 + i * step + step / 2;
      const bunY = h / 2;

      ctx.fillStyle = '#FFFAF0';
      ctx.beginPath();
      ctx.arc(bunX, bunY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(bunX, bunY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const steamDrift = (Date.now() / 300) % 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.2 - steamDrift, 3, 0, Math.PI * 2);
    ctx.arc(w * 0.65, h * 0.3 - steamDrift, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 繪製夜市攤販
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

    ctx.fillStyle = '#744210';
    ctx.fillRect(4, h * 0.45, w - 8, h * 0.5);

    ctx.fillStyle = '#CBD5E0';
    ctx.fillRect(6, h * 0.4, w - 12, h * 0.15);

    const stripeCount = 6;
    const stripeW = w / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#E53E3E' : '#FFFFFF';
      ctx.fillRect(i * stripeW, 0, stripeW, h * 0.38);
    }

    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#E53E3E' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(i * stripeW + stripeW / 2, h * 0.38, stripeW / 2, 0, Math.PI);
      ctx.fill();
    }

    ctx.fillStyle = '#E53E3E';
    ctx.beginPath();
    ctx.ellipse(8, h * 0.28, 5, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(w - 8, h * 0.28, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FEFCBF';
    ctx.beginPath();
    ctx.arc(8, h * 0.28, 2, 0, Math.PI * 2);
    ctx.arc(w - 8, h * 0.28, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, w / 2, h * 0.72);

    ctx.restore();
  }

  /**
   * 繪製高鐵列車
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

    ctx.fillStyle = '#EDF2F7';
    ctx.beginPath();
    ctx.roundRect(0, 4, w, h - 8, 8);
    ctx.fill();

    ctx.fillStyle = '#DD6B20';
    ctx.fillRect(0, h / 2 - 2, w, 5);

    const windowCount = Math.floor(w / 22);
    ctx.fillStyle = '#2D3748';
    for (let i = 0; i < windowCount; i++) {
      ctx.fillRect(10 + i * 22, 7, 14, h - 14);
    }

    ctx.fillStyle = '#4A5568';
    ctx.beginPath();
    ctx.roundRect(w - 18, 6, 14, h - 12, 4);
    ctx.fill();

    ctx.fillStyle = '#FFF5B8';
    ctx.shadowColor = '#FAF089';
    ctx.shadowBlur = 12;
    ctx.fillRect(w - 4, 7, 3, 5);
    ctx.fillRect(w - 4, h - 12, 3, 5);

    ctx.restore();
  }
}
