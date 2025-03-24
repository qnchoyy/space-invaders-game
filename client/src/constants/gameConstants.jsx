// Game dimensions
export const GAME_WIDTH = 100;
export const GAME_HEIGHT = 100;

// Player constants
export const PLAYER_SPEED = 2;
export const PLAYER_WIDTH = 6;
export const PLAYER_HEIGHT = 3;
export const PLAYER_BULLET_SPEED = 2;
export const MAX_PLAYER_BULLETS = 3;

// Enemy constants
export const ENEMY_ROWS = 3;
export const ENEMIES_PER_ROW = 8;
export const ENEMY_SPEED = 0.2;
export const ENEMY_SHOOT_CHANCE = 0.01;
export const ENEMY_BULLET_SPEED = 2;
export const MAX_ENEMY_BULLETS = 5;

// Game states
export const GAME_STATES = {
  START: "start",
  PLAYING: "playing",
  GAME_OVER: "gameOver",
  WON: "won",
  LEVEL_COMPLETE: "levelComplete",
};

// Level constants
export const MAX_LEVEL = 3;

// Level configuration
export const LEVEL_CONFIG = {
  1: {
    enemyRows: 2,
    enemiesPerRow: 6,
    enemySpeed: 0.2,
    enemyShootChance: 0.005,
    hasBoss: false,
  },
  2: {
    enemyRows: 3,
    enemiesPerRow: 8,
    enemySpeed: 0.3,
    enemyShootChance: 0.01,
    hasBoss: false,
  },
  3: {
    enemyRows: 1,
    enemiesPerRow: 10,
    enemySpeed: 0.5,
    enemyShootChance: 0.008,
    enemySize: { width: 4, height: 2 },
    hasBoss: true,
    bossPosition: { x: 44, y: 15 },
    bossHealth: 30,
    bossSpeed: 0.4,
    bossSize: { width: 12, height: 8 },
    bossTimeLimit: 60,
  },
};
