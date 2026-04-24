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
  },

  difficultyPresets: {
    easy: {
      greenSizeMultiplier: 1.1,
      spawner: {
        initialInterval: 1500,
        minInterval: 500,
        intervalDecrease: 60,
        levelUpTime: 12000
      },
      difficulty: {
        initialBallSpeed: 1.5,
        speedIncrease: 0.3,
        speedIncreaseInterval: 18000
      },
      spawnChances: {
        red: 0.45,
        gold: 0.35,
        green: 0.20
      },
      playerSpeed: 5
    },
    normal: {
      greenSizeMultiplier: 1.2,
      spawner: {
        initialInterval: 1200,
        minInterval: 350,
        intervalDecrease: 80,
        levelUpTime: 10000
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
      },
      playerSpeed: 5
    },
    hard: {
      greenSizeMultiplier: 1.3,
      spawner: {
        initialInterval: 900,
        minInterval: 200,
        intervalDecrease: 100,
        levelUpTime: 8000
      },
      difficulty: {
        initialBallSpeed: 2.5,
        speedIncrease: 0.5,
        speedIncreaseInterval: 12000
      },
      spawnChances: {
        red: 0.65,
        gold: 0.25,
        green: 0.10
      },
      playerSpeed: 4.5
    }
  }
};
