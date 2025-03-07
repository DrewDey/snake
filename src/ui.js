export class UI {
  constructor(game, soundManager) {
    this.game = game;
    this.soundManager = soundManager;
    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('high-score');
    this.levelElement = document.getElementById('level');
    this.finalScoreElement = document.getElementById('final-score');
    this.gameMenu = document.getElementById('game-menu');
    this.gameOverScreen = document.getElementById('game-over');
    this.pauseMenu = document.getElementById('pause-menu');
    
    this.init();
  }

  init() {
    // Set up event listeners for UI elements
    document.getElementById('start-button').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('restart-button').addEventListener('click', () => {
      this.restartGame();
    });
    
    document.getElementById('resume-button').addEventListener('click', () => {
      this.resumeGame();
    });
    
    // Set up difficulty buttons
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove selected class from all buttons
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        // Add selected class to clicked button
        button.classList.add('selected');
      });
    });
    
    // Update high score from local storage
    this.updateHighScore();
  }

  startGame() {
    // Hide menu
    this.gameMenu.style.display = 'none';
    this.gameOverScreen.classList.add('hidden');
    
    // Get selected difficulty
    const selectedDifficulty = document.querySelector('.difficulty-btn.selected');
    const speed = parseInt(selectedDifficulty.dataset.speed);
    
    // Start the game
    this.game.start(speed);
    
    // Play start sound
    this.soundManager.playStartSound();
  }

  restartGame() {
    // Hide game over screen
    this.gameOverScreen.classList.add('hidden');
    
    // Get selected difficulty
    const selectedDifficulty = document.querySelector('.difficulty-btn.selected');
    const speed = parseInt(selectedDifficulty.dataset.speed);
    
    // Start the game
    this.game.start(speed);
    
    // Play start sound
    this.soundManager.playStartSound();
  }

  resumeGame() {
    this.game.togglePause();
  }

  updateScore(score) {
    this.scoreElement.textContent = score;
    this.finalScoreElement.textContent = score;
  }

  updateHighScore() {
    const highScore = localStorage.getItem('snakeHighScore') || 0;
    this.highScoreElement.textContent = highScore;
  }

  updateLevel(level) {
    this.levelElement.textContent = level;
  }

  showGameOver(score) {
    this.finalScoreElement.textContent = score;
    this.gameOverScreen.classList.remove('hidden');
    this.updateHighScore();
  }
}
