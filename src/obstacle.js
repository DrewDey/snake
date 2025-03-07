export class Obstacle {
  constructor(gridSize, x, y, width = 1, height = 1) {
    this.gridSize = gridSize;
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.color = '#795548'; // Brown color for obstacles
  }

  checkCollision(x, y) {
    return (
      x >= this.position.x &&
      x < this.position.x + this.width &&
      y >= this.position.y &&
      y < this.position.y + this.height
    );
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x * this.gridSize,
      this.position.y * this.gridSize,
      this.width * this.gridSize,
      this.height * this.gridSize
    );
    
    // Add some texture to the obstacle
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y < this.height; y++) {
      ctx.beginPath();
      ctx.moveTo(this.position.x * this.gridSize, (this.position.y + y) * this.gridSize + this.gridSize / 2);
      ctx.lineTo((this.position.x + this.width) * this.gridSize, (this.position.y + y) * this.gridSize + this.gridSize / 2);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x < this.width; x++) {
      ctx.beginPath();
      ctx.moveTo((this.position.x + x) * this.gridSize + this.gridSize / 2, this.position.y * this.gridSize);
      ctx.lineTo((this.position.x + x) * this.gridSize + this.gridSize / 2, (this.position.y + this.height) * this.gridSize);
      ctx.stroke();
    }
  }
}

export class ObstacleManager {
  constructor(gridSize, canvasWidth, canvasHeight) {
    this.gridSize = gridSize;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.obstacles = [];
  }

  generateLevel(level) {
    this.obstacles = [];
    
    // Different obstacle patterns based on level
    switch (level) {
      case 1:
        // No obstacles in level 1
        break;
      case 2:
        // Simple obstacles in the middle
        this.addObstacle(14, 14, 2, 2);
        break;
      case 3:
        // Cross pattern
        this.addObstacle(14, 0, 2, 10);
        this.addObstacle(14, 20, 2, 10);
        this.addObstacle(0, 14, 10, 2);
        this.addObstacle(20, 14, 10, 2);
        break;
      case 4:
        // Box pattern
        this.addObstacle(5, 5, 2, 20);
        this.addObstacle(23, 5, 2, 20);
        this.addObstacle(7, 5, 16, 2);
        this.addObstacle(7, 23, 16, 2);
        break;
      case 5:
        // Maze-like pattern
        this.addObstacle(5, 5, 20, 2);
        this.addObstacle(5, 15, 15, 2);
        this.addObstacle(5, 5, 2, 12);
        this.addObstacle(23, 7, 2, 18);
        break;
      default:
        // Random obstacles for higher levels
        const numObstacles = Math.min(10, level);
        for (let i = 0; i < numObstacles; i++) {
          const x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize - 2)) + 1;
          const y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize - 2)) + 1;
          const width = Math.floor(Math.random() * 3) + 1;
          const height = Math.floor(Math.random() * 3) + 1;
          
          // Ensure obstacles don't spawn on the initial snake position
          if (!(x < 12 && x > 7 && y === 10)) {
            this.addObstacle(x, y, width, height);
          }
        }
        break;
    }
  }

  addObstacle(x, y, width, height) {
    this.obstacles.push(new Obstacle(this.gridSize, x, y, width, height));
  }

  checkCollision(x, y) {
    return this.obstacles.some(obstacle => obstacle.checkCollision(x, y));
  }

  draw(ctx) {
    this.obstacles.forEach(obstacle => obstacle.draw(ctx));
  }
}
