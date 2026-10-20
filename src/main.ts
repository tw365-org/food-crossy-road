import { Engine } from './core/Engine';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('找不到 #game-canvas 元素');
    return;
  }

  // 初始化遊戲主引擎
  new Engine(canvas);
  console.log('🍢 美食過街 (Food Crossy Road) 引擎啟動完成！');
});
