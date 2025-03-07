export class Snake {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.body = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.growing = false;
  }

  changeDirection(newDirection) {
    // Prevent 180-degree turns
    if (
      (this.direction === 'up' && newDirection === 'down') ||
      (this.direction === 'down' && newDirection === 'up') ||
      (this.direction === 'left' && newDirection === 'right') ||
      (this.direction === 'right' && newDirection === 'left')
    ) {
      return;
    }
    
    this.nextDirection = newDirection;
  }

  update() {
    // Update direction
    this.direction = this.nextDirection;
    
    // Create new head based on direction
    const head = { ...this.body[0] };
    
    switch (this.direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }
    
    // Add new head to the beginning of the body
    this.body.unshift(head);
    
    // If not growing, remove the tail
    if (!this.growing) {
      return this.body.pop();
    } else {
      this.growing = false;
      return null;
    }
  }

  grow() {
    this.growing = true;
  }

  checkCollision(x, y) {
    // Check if coordinates collide with any part of the snake
    return this.body.some(segment => segment.x === x && segment.y === y);
  }

  checkSelfCollision() {
    const head = this.body[0];
    // Check if head collides with any part of the body (excluding the head)
    return this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  checkWallCollision(width, height) {
    const head = this.body[0];
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= width / this.gridSize ||
      head.y >= height / this.gridSize
    );
  }

  reset() {
    this.body = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.growing = false;
  }
}
