DodgeBall.CONFIG = {
  canvas: { width: 800, height: 600 },

  players: {
    p1: {
      size: 28,
      speed: 5,
      color: '#4da6ff',
      keys: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' }
    },
    p2: {
      size: 28,
      speed: 5,
      color: '#ffffff',
      keys: { left: 'a', right: 'd', up: 'w', down: 's' }
    },
    maxSize: 120
  },

  balls: {
    red: {
      minRadius: 8,
      maxRadius: 45,
      color: '#ff4444'
    },
    gold: {
      radius: 14,
      color: '#ffd700',
      points: 10
    },
    green: {
      radius: 14,
      color: '#44ff44',
      points: 100,
      sizeMultiplier: 1.2
    }
  },

  spawner: {
    initialInterval: 1200,
    minInterval: 350,
    intervalDecrease: 80,
    levelUpTime: 10000,
    minSpawnDistance: 120
  },

  difficulty: {
    initialBallSpeed: 2,
    speedIncrease: 0.4,
    speedIncreaseInterval: 15000
  },

  spawnChances: {
    red: 0.55,
    gold: 0.30,
    green: 0.15
  }
};
