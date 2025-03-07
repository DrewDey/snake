export class Particle {
  constructor(x, y, color, size, speedX, speedY, life = 1000) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.initialSize = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.life = life;
    this.initialLife = life;
    this.alpha = 1;
  }

  update(deltaTime) {
    // Update position
    this.x += this.speedX * (deltaTime / 16);
    this.y += this.speedY * (deltaTime / 16);
    
    // Update life
    this.life -= deltaTime;
    
    // Update alpha and size based on remaining life
    this.alpha = this.life / this.initialLife;
    this.size = this.initialSize * this.alpha;
    
    return this.life > 0;
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createFoodParticles(x, y, gridSize, color, count = 10) {
    const centerX = x * gridSize + gridSize / 2;
    const centerY = y * gridSize + gridSize / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;
      const size = Math.random() * 3 + 2;
      const life = Math.random() * 500 + 500;
      
      this.particles.push(new Particle(
        centerX,
        centerY,
        color,
        size,
        speedX,
        speedY,
        life
      ));
    }
  }

  createExplosionParticles(x, y, gridSize, color, count = 20) {
    const centerX = x * gridSize + gridSize / 2;
    const centerY = y * gridSize + gridSize / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;
      const size = Math.random() * 4 + 3;
      const life = Math.random() * 800 + 700;
      
      this.particles.push(new Particle(
        centerX,
        centerY,
        color,
        size,
        speedX,
        speedY,
        life
      ));
    }
  }

  update(deltaTime) {
    this.particles = this.particles.filter(particle => particle.update(deltaTime));
  }

  draw(ctx) {
    this.particles.forEach(particle => particle.draw(ctx));
  }
}
