// NEON ORBIT — tuning constants. Every number the game plays with lives here.

export const VIEW = { width: 480, height: 640 };

export const STAR = {
  x: VIEW.width / 2,
  y: 330,
  ringRadius: 170,
  coreRadius: 26,
};

export const SHIP = {
  startAngle: -Math.PI / 2,
  radius: 9,
  accel: 6.0, // radians/s^2 of tilt when a key is held
  damping: 4.0, // how quickly the tilt coasts back to neutral
};

export const ASTEROID = {
  radius: 11,
  baseSpeed: 0.35,
  firstSpawn: 2.2, // seconds between spawns at level 1
  minSpawn: 0.55, // floor the spawn interval reaches
};

export const CELL = {
  radius: 6,
  spawnEvery: 5.5,
  score: 25,
  lifetime: 9, // seconds a cell stays on the ring
};

export const RULES = {
  lives: 3,
  levelEvery: 12, // seconds of survival per level
};
