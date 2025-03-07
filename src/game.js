export class Game {
  constructor(canvas, ctx, soundManager) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.soundManager = soundManager;
    this.gridSize = 20;
    this.snake = null;
    this.food = null;
    this.obstacles = [];
    this.powerups = [];
    this.particles = [];
    this.score = 0;
    this.highScore = localStorage.getItem('snakeHighScore') || 0;
    this.level = 1;
    this.speed = 150; // Default speed (ms)
    this.gameOver = false;
    this.paused = false;
    this.gameStarted = false;
    this.lastTime = 0;
    this.accumulator = 0;
  }

  init() {
    // Set up event listeners
    this.setupEventListeners();
    
    // Load high score from local storage
    this.highScore = localStorage.getItem('snakeHighScore') || 0;
    
    // Initial render of the game (menu state)
    this.render();
  }

  setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (this.snake && this.snake.direction !== 'down') {
            this.snake.changeDirection('up');
          }
          break;
        case 'ArrowDown':
        case 's':
          if (this.snake && this.snake.direction !== 'up') {
            this.snake.changeDirection('down');
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (this.snake && this.snake.direction !== 'right') {
            this.snake.changeDirection('left');
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (this.snake && this.snake.direction !== 'left') {
            this.snake.changeDirection('right');
          }
          break;
        case 'p':
        case 'Escape':
          this.togglePause();
          break;
      }
    });
  }

  start(speed = 150) {
    // Reset game state
    this.gameOver = false;
    this.paused = false;
    this.gameStarted = true;
    this.score = 0;
    this.level = 1;
    this.speed = speed;
    
    // Initialize game objects
    this.initializeGameObjects();
    
    // Start game loop
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
    
    // Play background music
    this.soundManager.playBackgroundMusic();
  }

  initializeGameObjects() {
    // Initialize snake, food, obstacles, etc.
    // These would be imported from their respective modules
    this.snake = {
      body: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ],
      direction: 'right',
      changeDirection(newDirection) {
        this.direction = newDirection;
      },
      move() {
        const head = { ...this.body[0] };
        
        switch (this.direction) {
          case 'up': head.y--; break;
          case 'down': head.y++; break;
          case 'left': head.x--; break;
          case 'right': head.x++; break;
        }
        
        this.body.unshift(head);
        return this.body.pop();
      },
      grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ ...tail });
      }
    };
    
    // Placeholder for food
    this.food = {
      position: this.getRandomPosition(),
      value: 1
    };
  }

  getRandomPosition() {
    const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
    const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
    return { x, y };
  }

  update(deltaTime) {
    if (this.gameOver || this.paused || !this.gameStarted) return;
    
    this.accumulator += deltaTime;
    
    if (this.accumulator >= this.speed) {
      // Move snake
      const tail = this.snake.move();
      
      // Check collisions
      this.checkCollisions(tail);
      
      // Reset accumulator
      this.accumulator = 0;
    }
    
    // Update particles
    this.updateParticles(deltaTime);
  }

  checkCollisions(tail) {
    const head = this.snake.body[0];
    
    // Wall collision
    if (
      head.x < 0 || 
      head.x >= this.canvas.width / this.gridSize ||
      head.y < 0 || 
      head.y >= this.canvas.height / this.gridSize
    ) {
      this.endGame();
      return;
    }
    
    // Self collision
    for (let i = 1; i < this.snake.body.length; i++) {
      if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
        this.endGame();
        return;
      }
    }
    
    // Food collision
    if (head.x === this.food.position.x && head.y === this.food.position.y) {
      // Grow snake
      this.snake.grow();
      
      // Update score
      this.score += this.food.value;
      
      // Check for level up
      this.checkLevelUp();
      
      // Generate new food
      this.food.position = this.getRandomPosition();
      
      // Play eat sound
      this.soundManager.playEatSound();
      
      // Create particles
      this.createFoodParticles(this.food.position);
    }
  }

  checkLevelUp() {
    if (this.score > 0 && this.score % 10 === 0) {
      this.level++;
      this.speed = Math.max(50, this.speed - 10);
      
      // Play level up sound
      this.soundManager.playLevelUpSound();
    }
  }

  createFoodParticles(position) {
    // Placeholder for particle creation
    // Would be implemented with the Particle class
  }

  updateParticles(deltaTime) {
    // Update and remove dead particles
    // Would be implemented with the Particle class
  }

  endGame() {
    this.gameOver = true;
    this.gameStarted = false;
    
    // Update high score if needed
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snakeHighScore', this.highScore);
    }
    
    // Play game over sound
    this.soundManager.playGameOverSound();
    
    // Show game over screen
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').textContent = this.score;
  }

  togglePause() {
    if (!this.gameStarted || this.gameOver) return;
    
    this.paused = !this.paused;
    
    if (this.paused) {
      // Show pause menu
      document.getElementById('pause-menu').classList.remove('hidden');
      // Pause background music
      this.soundManager.pauseBackgroundMusic();
    } else {
      // Hide pause menu
      document.getElementById('pause-menu').classList.add('hidden');
      // Resume background music
      this.soundManager.resumeBackgroundMusic();
      // Resume game loop
      this.lastTime = performance.now();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    if (!this.gameOver && !this.paused) {
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid
    this.drawGrid();
    
    if (this.gameStarted) {
      // Draw game objects
      this.drawFood();
      this.drawSnake();
      this.drawParticles();
    }
  }

  drawGrid() {
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawSnake() {
    if (!this.snake) return;
    
    // Draw snake body
    this.ctx.fillStyle = '#4CAF50';
    for (let i = 1; i < this.snake.body.length; i++) {
      const segment = this.snake.body[i];
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize,
        this.gridSize
      );
    }
    
    // Draw snake head
    const head = this.snake.body[0];
    this.ctx.fillStyle = '#8BC34A';
    this.ctx.fillRect(
      head.x * this.gridSize,
      head.y * this.gridSize,
      this.gridSize,
      this.gridSize
    );
    
    // Draw eyes
    this.ctx.fillStyle = '#111';
    const eyeSize = this.gridSize / 5;
    const eyeOffset = this.gridSize / 3;
    
    // Position eyes based on direction
    let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
    
    switch (this.snake.direction) {
      case 'up':
        leftEyeX = head.x * this.gridSize + eyeOffset;
        leftEyeY = head.y * this.gridSize + eyeOffset;
        rightEyeX = head.x * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        rightEyeY = head.y * this.gridSize + eyeOffset;
        break;
      case 'down':
        leftEyeX = head.x * this.gridSize + eyeOffset;
        leftEyeY = head.y * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        rightEyeX = head.x * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        rightEyeY = head.y * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        break;
      case 'left':
        leftEyeX = head.x * this.gridSize + eyeOffset;
        leftEyeY = head.y * this.gridSize + eyeOffset;
        rightEyeX = head.x * this.gridSize + eyeOffset;
        rightEyeY = head.y * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        break;
      case 'right':
        leftEyeX = head.x * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        leftEyeY = head.y * this.gridSize + eyeOffset;
        rightEyeX = head.x * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        rightEyeY = head.y * this.gridSize + this.gridSize - eyeOffset - eyeSize;
        break;
    }
    
    this.ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
    this.ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
  }

  drawFood() {
    if (!this.food) return;
    
    // Draw food
    this.ctx.fillStyle = '#F44336';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.position.x * this.gridSize + this.gridSize / 2,
      this.food.position.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawParticles() {
    // Draw all active particles
    // Would be implemented with the Particle class
  }
}
