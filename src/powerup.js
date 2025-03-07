export class PowerUp {
  constructor(gridSize, canvasWidth, canvasHeight) {
    this.gridSize = gridSize;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.active = false;
    this.position = { x: 0, y: 0 };
    this.type = 'none';
    this.duration = 0;
    this.timeRemaining = 0;
    this.color = '#FFFFFF';
  }

  spawn(snake, obstacles = [], chance = 0.05) {
    // Only spawn if not already active and by random chance
    if (this.active || Math.random() > chance) {
      return false;
    }
    
    // Choose a random power-up type
    const types = ['speed', 'slow', 'invincibility', 'shrink'];
    this.type = types[Math.floor(Math.random() * types.length)];
    
    // Set properties based on type
    switch (this.type) {
      case 'speed':
        this.color = '#2196F3'; // Blue
        this.duration = 5000; // 5 seconds
        break;
      case 'slow':
        this.color = '#9E9E9E'; // Gray
        this.duration = 5000; // 5 seconds
        break;
      case 'invincibility':
        this.color = '#FFEB3B'; // Yellow
        this.duration = 3000; // 3 seconds
        break;
      case 'shrink':
        this.color = '#4CAF50'; // Green
        this.duration = 0; // Instant effect
        break;
    }
    
    this.timeRemaining = this.duration;
    
    // Find a valid position
    let validPosition = false;
    while (!validPosition) {
      const x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize));
      const y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize));
      
      validPosition = true;
      
      // Check collision with snake
      if (snake.checkCollision(x, y)) {
        validPosition = false;
        continue;
      }
      
      // Check collision with obstacles
      if (obstacles.some(obstacle => obstacle.checkCollision(x, y))) {
        validPosition = false;
        continue;
      }
      
      this.position = { x, y };
    }
    
    this.active = true;
    return true;
  }

  collect() {
    this.active = false;
    return {
      type: this.type,
      duration: this.duration
    };
  }

  update(deltaTime) {
    if (!this.active || this.duration === 0) return;
    
    this.timeRemaining -= deltaTime;
    
    if (this.timeRemaining <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    
    // Draw power-up as a glowing hexagon
    const centerX = this.position.x * this.gridSize + this.gridSize / 2;
    const centerY = this.position.y * this.gridSize + this.gridSize / 2;
    const radius = this.gridSize / 2;
    
    // Create glow effect
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.5,
      centerX, centerY, radius * 1.2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw hexagon
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = centerX + radius * 0.8 * Math.cos(angle);
      const y = centerY + radius * 0.8 * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    // Draw icon based on power-up type
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${this.gridSize / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let icon = '';
    switch (this.type) {
      case 'speed':
        icon = '⚡';
        break;
      case 'slow':
        icon = '⏱';
        break;
      case 'invincibility':
        icon = '★';
        break;
      case 'shrink':
        icon = '↓';
        break;
    }
    
    ctx.fillText(icon, centerX, centerY);
  }
}
