// NEON ORBIT — simulation: the star, the ship on its ring, the rocks and the cells.
import { STAR, SHIP, ASTEROID, CELL, RULES } from "./config.js";

const TAU = Math.PI * 2;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export class World {
  constructor() {
    this.state = "title"; // title | play | pause | over
    this.time = 0;
    this.score = 0;
    this.lives = RULES.lives;
    this.level = 1;
    this.shipAngle = SHIP.startAngle;
    this.shipVel = 0;
    this.asteroids = [];
    this.cells = [];
    this.particles = [];
    this._rockTimer = ASTEROID.firstSpawn;
    this._cellTimer = CELL.spawnEvery;
    this._levelTimer = 0;
    this._shake = 0;
  }

  start() {
    this.state = "play";
    this.time = 0;
    this.score = 0;
    this.lives = RULES.lives;
    this.level = 1;
    this.shipAngle = SHIP.startAngle;
    this.shipVel = 0;
    this.asteroids = [];
    this.cells = [];
    this.particles = [];
    this._rockTimer = ASTEROID.firstSpawn;
    this._cellTimer = CELL.spawnEvery;
    this._levelTimer = 0;
    this._shake = 0;
  }

  togglePause() {
    if (this.state === "play") this.state = "pause";
    else if (this.state === "pause") this.state = "play";
  }

  update(dt, input) {
    if (this.state !== "play") return;
    this.time += dt;
    this._shake = Math.max(0, this._shake - dt * 2.5);

    let steer = 0;
    if (input.left) steer -= 1;
    if (input.right) steer += 1;
    this.shipVel += steer * SHIP.accel * dt;
    this.shipVel -= this.shipVel * SHIP.damping * dt;
    this.shipAngle = (this.shipAngle + this.shipVel * dt) % TAU;

    this._levelTimer += dt;
    if (this._levelTimer >= RULES.levelEvery) {
      this._levelTimer -= RULES.levelEvery;
      this.level += 1;
    }

    this._rockTimer -= dt;
    if (this._rockTimer <= 0) {
      this._rockTimer = Math.max(ASTEROID.minSpawn, ASTEROID.firstSpawn - this.level * 0.12);
      this.spawnRock();
    }

    this._cellTimer -= dt;
    if (this._cellTimer <= 0) {
      this._cellTimer = CELL.spawnEvery;
      this.spawnCell();
    }

    this.stepRocks(dt);
    this.stepCells();
    this.stepParticles(dt);
    this.collide();
  }

  spawnRock() {
    const angle = rand(0, TAU);
    const reach = Math.max(STAR.x, STAR.y) + 90;
    const speed = (ASTEROID.baseSpeed + this.level * 0.05) * rand(0.8, 1.3);
    this.asteroids.push({
      x: STAR.x + Math.cos(angle) * reach,
      y: STAR.y + Math.sin(angle) * reach,
      vx: -Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      r: ASTEROID.radius * rand(0.8, 1.5),
      rot: rand(0, TAU),
      spin: rand(-1.5, 1.5),
    });
  }

  spawnCell() {
    const angle = rand(0, TAU);
    this.cells.push({
      x: STAR.x + Math.cos(angle) * STAR.ringRadius,
      y: STAR.y + Math.sin(angle) * STAR.ringRadius,
      born: this.time,
    });
  }

  stepRocks(dt) {
    for (const rock of this.asteroids) {
      rock.x += rock.vx * dt * 60;
      rock.y += rock.vy * dt * 60;
      rock.rot += rock.spin * dt;
    }
    const limit = Math.max(STAR.x, STAR.y) + 150;
    this.asteroids = this.asteroids.filter(
      (rock) => Math.hypot(rock.x - STAR.x, rock.y - STAR.y) < limit,
    );
  }

  stepCells() {
    this.cells = this.cells.filter((cell) => this.time - cell.born < CELL.lifetime);
  }

  stepParticles(dt) {
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  collide() {
    const sx = STAR.x + Math.cos(this.shipAngle) * STAR.ringRadius;
    const sy = STAR.y + Math.sin(this.shipAngle) * STAR.ringRadius;

    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const rock = this.asteroids[i];
      if (Math.hypot(rock.x - sx, rock.y - sy) < rock.r + SHIP.radius) {
        this.asteroids.splice(i, 1);
        this.burst(sx, sy, "#ff5a6e");
        this.lives -= 1;
        this._shake = 1;
        if (this.lives <= 0) this.state = "over";
        return;
      }
    }

    for (let i = this.cells.length - 1; i >= 0; i--) {
      const cell = this.cells[i];
      if (Math.hypot(cell.x - sx, cell.y - sy) < CELL.radius + SHIP.radius + 2) {
        this.cells.splice(i, 1);
        this.burst(cell.x, cell.y, "#ffe74c");
        this.score += CELL.score;
      }
    }
  }

  burst(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = rand(0, TAU);
      const speed = rand(40, 180);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: rand(0.3, 0.7),
        color,
      });
    }
  }

  get shake() {
    return this._shake;
  }
}
