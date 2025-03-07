export class Food {
  constructor(gridSize, canvasWidth, canvasHeight) {
    this.gridSize = gridSize;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.position = this.getRandomPosition();
    this.value = 1;
    this.type = 'normal'; // normal, bonus, special
    this.color = '#F44336'; // red for normal food
  }

  getRandomPosition() {
    const x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize));
    const y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize));
    return { x, y };
  }

  relocate(snake, obstacles = []) {
    let newPosition;
    let validPosition = false;
    
    // Keep generating positions until we find one that doesn't collide with the snake or obstacles
    while (!validPosition) {
      newPosition = this.getRandomPosition();
      validPosition = true;
      
      // Check collision with snake
      if (snake.checkCollision(newPosition.x, newPosition.y)) {
        validPosition = false;
        continue;
      }
      
      // Check collision with obstacles
      for (const obstacle of obstacles) {
        if (obstacle.checkCollision(newPosition.x, newPosition.y)) {
          validPosition = false;
          break;
        }
      }
    }
    
    this.position = newPosition;
    
    // Occasionally spawn special food
    if (Math.random() < 0.2) {
      this.type = 'bonus';
      this.value = 3;
      this.color = '#FFC107'; // yellow for bonus food
    } else if (Math.random() < 0.05) {
      this.type = 'special';
      this.value = 5;
      this.color = '#9C27B0'; // purple for special food
    } else {
      this.type = 'normal';
      this.value = 1;
      this.color = '#F44336'; // red for normal food
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    
    // Different shapes for different food types
    if (this.type === 'normal') {
      // Circle for normal food
      ctx.beginPath();
      ctx.arc(
        this.position.x * this.gridSize + this.gridSize / 2,
        this.position.y * this.gridSize + this.gridSize / 2,
        this.gridSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else if (this.type === 'bonus') {
      // Star for bonus food
      this.drawStar(
        ctx,
        this.position.x * this.gridSize + this.gridSize / 2,
        this.position.y * this.gridSize + this.gridSize / 2,
        5,
        this.gridSize / 2,
        this.gridSize / 4
      );
    } else if (this.type === 'special') {
      // Diamond for special food
      ctx.beginPath();
      ctx.moveTo(this.position.x * this.gridSize + this.gridSize / 2, this.position.y * this.gridSize);
      ctx.lineTo(this.position.x * this.gridSize + this.gridSize, this.position.y * this.gridSize + this.gridSize / 2);
      ctx.lineTo(this.position.x * this.gridSize + this.gridSize / 2, this.position.y * this.gridSize + this.gridSize);
      ctx.lineTo(this.position.x * this.gridSize, this.position.y * this.gridSize + this.gridSize / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}
