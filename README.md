# 🍢 美食過街 (Food Crossy Road) 🧋

> 經典街機過馬路（Frogger / Crossy Road）台灣夜市美食題材重製版！
> 帶領勇敢可愛的小黃狗穿過車水馬龍的街道、踩著竹筏與熱騰騰的小籠包蒸籠渡河，抵達對岸夜市攤位品嚐台灣在地經典小吃！

---

## 🌟 遊戲特色

- 🐕 **靈動可愛主角**：純 Canvas 程式化向量繪製台灣小黃狗（柴犬/米克斯），具備起跳擠壓、滯空伸展與落地回彈物理手感。
- 🏮 **10 大特色漸進關卡**：
  - 穿梭車流、雙向疾速機車、平交道高鐵警報。
  - 乘載順流竹筏與漂浮小籠包蒸籠，落水與超時考驗。
  - 雨天水滴、迷霧老街、危險紅光等動態大氣環境特效。
- 🧋 **台灣夜市美食抽卡與圖鑑 (Food Dex)**：
  - 收錄 20 款在地著名小吃（大腸包小腸、珍珠奶茶、鹽酥雞、牛肉麵、芒果雪花冰等）。
  - 具備普通、稀有、傳說稀有度抽卡儀式。
  - 圖鑑內附 **Google 地圖導航連結**，隨時探索實體美味店家！
- 🏆 **星級評價與排行榜**：三顆星過關挑戰、本機與雲端擴充排行榜。
- 🔊 **Web Audio API 8-bit 音效**：純演算法合成跳躍、落水、鳴笛與過關和弦，100% 零外部音檔依賴。
- 📱 **全平台流暢操作**：支援電腦鍵盤（WASD / 方向鍵）、手機觸控滑動與虛擬 D-pad 按鈕。

---

## 🚀 部署指南 (Deployment)

### 1. GitHub Pages (全自動部署)
本專案已配置 `.github/workflows/deploy.yml`。
1. 將代碼推送到 `main` 分支後，進入 GitHub 倉庫的 **Settings** -> **Pages**。
2. 在 **Build and deployment** 下的 **Source** 選擇 **GitHub Actions**。
3. 稍候片刻即可透過 `https://<使用者名稱>.github.io/<倉庫名稱>/` 即時遊玩！

### 2. Cloudflare Pages 部署
1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ 前往 **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**。
2. 選擇此 GitHub 儲存庫，填寫建置設定：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. 點選 **Save and Deploy**，即可獲得極速 CDN 分發的 `.pages.dev` 網址！

---

## 💻 本機開發 (Local Development)

```bash
# 安裝依賴
npm install

# 啟動本地開發伺服器
npm run dev

# 建置生產版本
npm run build
```

---

## 🛠 技術棧
- **架構**：Vite + TypeScript
- **渲染引擎**：HTML5 Canvas 2D (零外鏈圖檔 Procedural Vector Rendering)
- **音效系統**：Web Audio API
- **資料持久化**：LocalStorage Local-First 架構
