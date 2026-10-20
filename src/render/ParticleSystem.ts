export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'dust' | 'splash' | 'heart' | 'star';
}

export class ParticleSystem {
  private particles: Particle[] = [];

  public emitDust(x: number, y: number, count: number = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 25 + 10;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.5 - 15,
        size: Math.random() * 4 + 3,
        color: '#E2E8F0',
        alpha: 0.8,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.2,
        type: 'dust'
      });
    }
  }

  public emitSplash(x: number, y: number, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 4) + Math.random() * (Math.PI / 2);
      const speed = Math.random() * 80 + 30;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y,
        vx: (Math.random() - 0.5) * 70,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color: '#EBF8FF',
        alpha: 0.9,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
        type: 'splash'
      });
    }
  }

  public emitVictory(x: number, y: number, count: number = 10) {
    const colors = ['#F6E05E', '#FC8181', '#68D391', '#63B3ED'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 90 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.4,
        type: Math.random() > 0.5 ? 'heart' : 'star'
      });
    }
  }

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // 重力與阻力
      if (p.type === 'splash') {
        p.vy += 220 * dt; // 重力下落
      } else if (p.type === 'dust') {
        p.vx *= 0.92;
        p.vy *= 0.92;
      }

      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'heart') {
        ctx.font = `${Math.floor(p.size * 2)}px sans-serif`;
        ctx.fillText('💖', p.x, p.y);
      } else if (p.type === 'star') {
        ctx.font = `${Math.floor(p.size * 2)}px sans-serif`;
        ctx.fillText('⭐', p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  public clear() {
    this.particles = [];
  }
}
