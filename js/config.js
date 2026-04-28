DodgeBall.CONFIG = {
  canvas: { width: 800, height: 600 },

  players: {
    p1: {
      size: 28, speed: 5, color: '#4da6ff',
      keys: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' }
    },
    p2: {
      size: 28, speed: 5, color: '#ffffff',
      keys: { left: 'a', right: 'd', up: 'w', down: 's' }
    },
    maxSize: 120, maxHP: 5
  },

  balls: {
    red: { minRadius: 8, maxRadius: 45, color: '#ff4444' },
    gold: { radius: 14, color: '#ffd700', points: 10 },
    green: { radius: 14, color: '#44ff44', points: 60, sizeMultiplier: 1.2 },
    tracking: { radius: 14, color: '#ff8800', speed: 1.5 },
    split: { radius: 18, color: '#ff00ff', speed: 2.5, splitTime: 2000, splitCount: 3, childRadius: 10 }
  },

  spawner: {
    initialInterval: 1200, minInterval: 350, intervalDecrease: 80,
    levelUpTime: 10000, minSpawnDistance: 120
  },

  difficulty: {
    initialBallSpeed: 2, speedIncrease: 0.4, speedIncreaseInterval: 15000,
    ballSpeedCap: 0.8,
    trackingSpeedBase: 1.5, trackingSpeedIncrease: 0.3, trackingSpeedInterval: 15000
  },

  spawnChances: {
    red: 0.45, gold: 0.25, green: 0.15, tracking: 0.10, split: 0.05
  },

  powerups: {
    spawnInterval: 8000, maxSpawnInterval: 22000, rampTime: 300000,
    shieldDropTime: 240000, shieldDropDuration: 6000,
    types: {
      shield: { duration: 10000, color: '#44aaff', label: 'S' },
      speed:  { duration: 4500, multiplier: 1.5, color: '#ffff44', label: 'Z' },
      shrink: { duration: 0, factor: 0.65, color: '#44ff88', label: 'V' }
    },
    weights: { shield: 0.35, speed: 0.35, shrink: 0.30 }
  },

  difficultyPresets: {
    easy: {
      greenSizeMultiplier: 1.1,
      spawner: { initialInterval: 1500, minInterval: 500, intervalDecrease: 60, levelUpTime: 12000 },
      difficulty: {
        initialBallSpeed: 1.5, speedIncrease: 0.3, speedIncreaseInterval: 18000,
        ballSpeedCap: 0.7, trackingSpeedBase: 1.2, trackingSpeedIncrease: 0.2, trackingSpeedInterval: 18000
      },
      spawnChances: { red: 0.40, gold: 0.35, green: 0.15, tracking: 0.08, split: 0.02 },
      powerups: { spawnInterval: 10000, maxSpawnInterval: 25000, shieldDropTime: 300000, shieldDropDuration: 8000 },
      playerSpeed: 5
    },
    normal: {
      greenSizeMultiplier: 1.2,
      spawner: { initialInterval: 1200, minInterval: 350, intervalDecrease: 80, levelUpTime: 10000 },
      difficulty: {
        initialBallSpeed: 2, speedIncrease: 0.4, speedIncreaseInterval: 15000,
        ballSpeedCap: 0.8, trackingSpeedBase: 1.5, trackingSpeedIncrease: 0.3, trackingSpeedInterval: 15000
      },
      spawnChances: { red: 0.45, gold: 0.25, green: 0.15, tracking: 0.10, split: 0.05 },
      powerups: { spawnInterval: 8000, maxSpawnInterval: 22000, shieldDropTime: 240000, shieldDropDuration: 6000 },
      playerSpeed: 5
    },
    hard: {
      greenSizeMultiplier: 1.3,
      spawner: { initialInterval: 900, minInterval: 200, intervalDecrease: 100, levelUpTime: 8000 },
      difficulty: {
        initialBallSpeed: 2.5, speedIncrease: 0.5, speedIncreaseInterval: 12000,
        ballSpeedCap: 0.85, trackingSpeedBase: 1.8, trackingSpeedIncrease: 0.4, trackingSpeedInterval: 12000
      },
      spawnChances: { red: 0.55, gold: 0.15, green: 0.10, tracking: 0.12, split: 0.08 },
      powerups: { spawnInterval: 6000, maxSpawnInterval: 18000, shieldDropTime: 180000, shieldDropDuration: 5000 },
      playerSpeed: 4.5
    }
  },

  combo: { timeout: 2200, step: 5, max: 5 },
  timeAttack: { duration: 60 },
  particles: { collect: 8, hit: 15, death: 30, speed: 4 },
  backgroundStars: { count: 60, speed: 0.2, maxRadius: 1.5 },
  screenShake: { hitDuration: 150, hitIntensity: 6, deathDuration: 350, deathIntensity: 12 }
};
