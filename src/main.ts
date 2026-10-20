import { Engine } from './core/Engine';
import { Preloader } from './core/Preloader';

window.addEventListener('DOMContentLoaded', async () => {
  const preloader = new Preloader();

  // 1. 啟動專業遊戲載入畫面 (即時預載 10 大名犬圖集、字體，並以趣味夜市進度條平滑展示)
  await preloader.start();

  // 2. 載入完成後初始化遊戲核心引擎
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('找不到 #game-canvas 元素');
    return;
  }

  new Engine(canvas);
  console.log('🍢 美食過街 (Food Crossy Road) 引擎啟動完成！');
});
