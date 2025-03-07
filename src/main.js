import { Game } from './game.js';
import { UI } from './ui.js';
import { SoundManager } from './sound.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to match container
  canvas.width = 600;
  canvas.height = 600;
  
  // Initialize sound manager
  const soundManager = new SoundManager();
  
  // Initialize game
  const game = new Game(canvas, ctx, soundManager);
  
  // Initialize UI
  const ui = new UI(game, soundManager);
  
  // Start the game loop
  game.init();
});
