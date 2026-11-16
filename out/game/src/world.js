// NEON ORBIT - world state & logic
import { W, H, ORBIT_CX, ORBIT_CY, ORBIT_R, SHIP, ASTEROID, CELL, LIVES, START_LEVEL } from "./config.js";

export class World {
  constructor() {
    this.reset();
  }

  reset() {
    this.ang = SHIP.ang;
    this.score = 0;
    this.lives = LIVES;
    this.level = START_LEVEL;
    this.state = "title"; // title | play | over
    this.asteroids = [];
    this.cells = [];
    this.spawnTimer = 1.5;
    this.cellTimer = 6;
    this.time = 0;
    this.levelTimer = 0;
  }

  start() {
    this.state = "play";
    this.asteroids = [];
    this.cells = [];
    this.spawnTimer = 1.5;
    this.cellTimer = 5;
    this.levelTimer = 0;
  }

  addAsteroid() {
    // spawn just outside orbit, aimed inward
    const a = Math.random() * Math.PI * 2;
    const r = ORBIT_R + 40 + Math.random() * 40;
    const ax = ORBIT_CX + Math.cos(a) * r;
    const ay = ORBIT_CY + Math.sin(a) * r;
    // velocity toward center-ish
    const vx = (ORBIT_CX - ax) * 0.02 + (Math.random() - 0.5) * 0.25;
    const vy = (ORBIT_CY - ay) * 0.02 + (Math.random() - 0.5) * 0.25;
    const spd = ASTEROID.speedBase + Math.random() * 0.5 + this.level * 0.05;
    const len = Math.hypot(vx, vy) || 1;
    this.asteroids.push({
      x: ax, y: ay,
      vx: (vx / len) * spd, vy: (vy / len) * spd,
      r: ASTEROID.radius + Math.random() * 4,
      rot: Math.random() * 6.28,
      rspd: (Math.random() - 0.5) * 0.12,
    });
  }

  addCell() {
    const a = Math.random() * Math.PI * 2;
    const r = ORBIT_R * (0.4 + Math.random() * 0.5);
    this.cells.push({
      x: ORBIT_CX + Math.cos(a) * r,
      y: ORBIT_CY + Math.sin(a) * r,
      t: Math.random() * 6.28,
    });
  }

  update(dt, input) {
    this.time += dt;

    if (this.state === "play") {
      // ship movement
      if (input.left) this.ang -= SHIP.speed * dt * 60 / 60;
      if (input.right) this.ang += SHIP.speed * dt * 60 / 60;
      // wrap
      while (this.ang > Math.PI) this.ang -= Math.PI * 2;
      while (this.ang < -Math.PI) this.ang += Math.PI * 2;

      const sx = ORBIT_CX + Math.cos(this.ang) * ORBIT_R;
      const sy = ORBIT_CY + Math.sin(this.ang) * ORBIT_R;

      // spawn asteroids
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.addAsteroid();
        this.spawnTimer = Math.max(0.7, ASTEROID.spawnInt - this.level * 0.18) * (0.6 + Math.random() * 0.8);
      }
      // spawn cells
      this.cellTimer -= dt;
      if (this.cellTimer <= 0) {
        this.addCell();
        this.cellTimer = CELL.spawnInt * (0.7 + Math.random() * 0.6);
      }

      // move asteroids
      for (const ast of this.asteroids) {
        ast.x += ast.vx * dt * 60;
        ast.y += ast.vy * dt * 60;
        ast.rot += ast.rspd * dt * 60;
      }
      // remove asteroids far off screen
      this.asteroids = this.asteroids.filter((a) => {
        return a.x > -40 && a.x < W + 40 && a.y > -40 && a.y < H + 40;
      });

      // collision with ship
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const a = this.asteroids[i];
        const dx = a.x - sx, dy = a.y - sy;
        const d = Math.hypot(dx, dy);
        if (d < a.r + SHIP.radius) {
          this.asteroids.splice(i, 1);
          this.lives--;
          if (this.lives <= 0) {
            this.state = "over";
          } else {
            // brief invulnerability: reset angle
            this.ang = SHIP.ang;
          }
        }
      }

      // collect cells
      for (let i = this.cells.length - 1; i >= 0; i--) {
        const c = this.cells[i];
        const dx = c.x - sx, dy = c.y - sy;
        if (Math.hypot(dx, dy) < CELL.radius + SHIP.radius) {
          this.cells.splice(i, 1);
          this.score += 100;
        }
      }

      // level progression
      this.levelTimer += dt;
      if (this.levelTimer > 30) {
        this.level++;
        this.levelTimer = 0;
        this.addAsteroid();
      }
    }
  }
}
