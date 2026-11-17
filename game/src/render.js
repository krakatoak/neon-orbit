// NEON ORBIT — every pixel on screen. One small function per thing drawn.
import { VIEW, STAR, SHIP, CELL } from "./config.js";

const PALETTE = {
  void: "#05010d",
  ring: "#2a0a4a",
  core: "#3a1a6a",
  coreLit: "#5a2a9a",
  coreHot: "#e8e0f8",
  hull: "#00f0ff",
  hullDark: "#00a0c0",
  rock: "#ff5a6e",
  rockDark: "#a02a3e",
  cell: "#ffe74c",
  cellCore: "#fff8c0",
  ink: "#e8e0f8",
  dim: "#9a8fc0",
};

let starfield = null;

function ensureStarfield() {
  if (starfield) return starfield;
  let seed = 20261117;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  starfield = [];
  for (let i = 0; i < 90; i++) {
    starfield.push({
      x: next() * VIEW.width,
      y: next() * VIEW.height,
      r: 0.6 + next() * 1.7,
      phase: next() * Math.PI * 2,
    });
  }
  return starfield;
}

export function drawFrame(ctx, world) {
  ctx.fillStyle = PALETTE.void;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);

  ctx.save();
  const shake = world.shake * 7;
  if (shake > 0.3) {
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }

  paintOrbit(ctx);
  paintStars(ctx, world.time);
  for (const cell of world.cells) paintCell(ctx, cell, world.time);
  for (const rock of world.asteroids) paintRock(ctx, rock);
  paintShip(ctx, world.shipAngle);
  paintParticles(ctx, world.particles);
  ctx.restore();

  if (world.state !== "title") paintHud(ctx, world);
}

function paintOrbit(ctx) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = PALETTE.ring;
  ctx.beginPath();
  ctx.arc(STAR.x, STAR.y, STAR.ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = PALETTE.core;
  ctx.beginPath();
  ctx.arc(STAR.x, STAR.y, STAR.coreRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.coreLit;
  ctx.beginPath();
  ctx.arc(STAR.x, STAR.y, STAR.coreRadius * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.coreHot;
  ctx.beginPath();
  ctx.arc(STAR.x, STAR.y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function paintStars(ctx, t) {
  ctx.fillStyle = "#3a2a5a";
  for (const star of ensureStarfield()) {
    ctx.globalAlpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.7 + star.phase));
    ctx.fillRect(star.x, star.y, star.r, star.r);
  }
  ctx.globalAlpha = 1;
}

function paintShip(ctx, angle) {
  const x = STAR.x + Math.cos(angle) * STAR.ringRadius;
  const y = STAR.y + Math.sin(angle) * STAR.ringRadius;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.fillStyle = PALETTE.hullDark;
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(-9, -8);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-9, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PALETTE.hull;
  ctx.beginPath();
  ctx.moveTo(11, 0);
  ctx.lineTo(-7, -6);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-7, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function paintRock(ctx, rock) {
  ctx.save();
  ctx.translate(rock.x, rock.y);
  ctx.rotate(rock.rot);
  ctx.fillStyle = PALETTE.rock;
  ctx.beginPath();
  const spikes = 9;
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * Math.PI * 2;
    const r = i % 2 === 0 ? rock.r : rock.r * 0.7;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PALETTE.rockDark;
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();
}

function paintCell(ctx, cell, t) {
  const pulse = 0.72 + 0.28 * Math.sin(t * 6 + cell.born);
  ctx.save();
  ctx.translate(cell.x, cell.y);
  ctx.fillStyle = PALETTE.cell;
  ctx.beginPath();
  ctx.arc(0, 0, CELL.radius * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.cellCore;
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();
}

function paintParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  }
  ctx.globalAlpha = 1;
}

export function drawText(ctx, str, x, y, size, color, align = "center") {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px ui-monospace, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(str, x, y);
}

function paintHud(ctx, world) {
  ctx.font = "bold 14px ui-monospace, monospace";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE.dim;
  ctx.fillText(`SCORE ${world.score}`, 14, 12);
  ctx.fillText(`LEVEL ${world.level}`, 14, 32);
  ctx.textAlign = "right";
  ctx.fillText(`LIVES ${world.lives}`, VIEW.width - 14, 12);
  ctx.fillStyle = PALETTE.hull;
  ctx.beginPath();
  ctx.arc(VIEW.width - 24, 46, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawTitle(ctx) {
  drawText(ctx, "NEON ORBIT", VIEW.width / 2, 120, 34, PALETTE.hull);
  drawText(ctx, "hold the ring around the star", VIEW.width / 2, 172, 13, PALETTE.dim);
  drawText(ctx, "arrows or A/D to steer", VIEW.width / 2, 470, 15, PALETTE.ink);
  drawText(ctx, "grab yellow cells", VIEW.width / 2, 496, 13, PALETTE.cell);
  drawText(ctx, "dodge the rocks", VIEW.width / 2, 520, 13, PALETTE.rock);
  drawText(ctx, "P pauses", VIEW.width / 2, 544, 12, PALETTE.dim);
  drawText(ctx, "press any key", VIEW.width / 2, 590, 18, "#ffffff");
}

export function drawPause(ctx) {
  ctx.fillStyle = "rgba(5,1,13,0.72)";
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  drawText(ctx, "PAUSED", VIEW.width / 2, 300, 32, PALETTE.hull);
  drawText(ctx, "P to resume", VIEW.width / 2, 350, 15, PALETTE.ink);
}

export function drawOver(ctx, world) {
  ctx.fillStyle = "rgba(5,1,13,0.78)";
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  drawText(ctx, "RUN ENDED", VIEW.width / 2, 220, 38, PALETTE.rock);
  drawText(ctx, `score ${world.score}   level ${world.level}`, VIEW.width / 2, 286, 19, PALETTE.ink);
  drawText(ctx, "press any key to fly again", VIEW.width / 2, 470, 15, "#ffffff");
}
