// NEON ORBIT - renderer (pixel-art canvas)
import { W, H, ORBIT_CX, ORBIT_CY, ORBIT_R } from "./config.js";

const NEO = { bg: "#05010d", orbit: "#2a0a4a", ship: "#00f0ff", shipGlow: "#00a0c0", asteroid: "#ff5a6e", cell: "#ffe74c", text: "#e8e0f8", hud: "#9a8fc0" };

export function draw(ctx) {
  ctx.fillStyle = NEO.bg;
  ctx.fillRect(0, 0, W, H);

  // orbit ring
  ctx.strokeStyle = NEO.orbit;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ORBIT_CX, ORBIT_CY, ORBIT_R, 0, Math.PI * 2);
  ctx.stroke();
  // center star
  ctx.fillStyle = "#3a1a6a";
  ctx.beginPath();
  ctx.arc(ORBIT_CX, ORBIT_CY, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5a2a9a";
  ctx.beginPath();
  ctx.arc(ORBIT_CX, ORBIT_CY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8e0f8";
  ctx.beginPath();
  ctx.arc(ORBIT_CX, ORBIT_CY, 6, 0, Math.PI * 2);
  ctx.fill();

  // starfield
  drawStars(ctx);
}

export function drawShip(ctx, ang) {
  const x = ORBIT_CX + Math.cos(ang) * ORBIT_R;
  const y = ORBIT_CY + Math.sin(ang) * ORBIT_R;
  const nose = ang + Math.PI / 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(nose);
  ctx.fillStyle = NEO.shipGlow;
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(-9, -8);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-9, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = NEO.ship;
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-7, -6);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-7, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawAsteroid(ctx, ax, ay, r, rot) {
  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(rot);
  ctx.fillStyle = NEO.asteroid;
  ctx.beginPath();
  // spiky pixel asteroid
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.72;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#a02a3e";
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();
}

export function drawCell(ctx, cx, cy, t) {
  const pulse = 0.7 + 0.3 * Math.sin(t * 6);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = NEO.cell;
  ctx.beginPath();
  ctx.arc(0, 0, 6 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff8c0";
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();
}

let stars = null;
function drawStars(ctx) {
  if (!stars) {
    stars = [];
    const seed = 1234;
    let s = seed;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 0; i < 80; i++) {
      stars.push({ x: rnd() * W, y: rnd() * H, r: 0.6 + rnd() * 1.6, tw: rnd() * 6.28 });
    }
  }
  const t = performance.now() / 1000;
  ctx.fillStyle = "#3a2a5a";
  for (const st of stars) {
    const b = 0.5 + 0.5 * Math.sin(t + st.tw);
    ctx.globalAlpha = 0.3 + 0.7 * b;
    ctx.fillRect(st.x, st.y, st.r, st.r);
  }
  ctx.globalAlpha = 1;
}

export function drawText(ctx, str, x, y, size, color, align = "center") {
  ctx.fillStyle = color || NEO.text;
  ctx.font = `bold ${size}px monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(str, x, y);
}

export function drawHUD(ctx, score, lives, level) {
  ctx.fillStyle = NEO.hud;
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`SCORE ${score}`, 14, 12);
  ctx.fillText(`LV ${level}`, 14, 32);
  ctx.textAlign = "right";
  ctx.fillText(`LIVES ${lives}`, W - 14, 12);
  // small orbit icon
  ctx.fillStyle = NEO.ship;
  ctx.beginPath();
  ctx.arc(W - 26, 44, 5, 0, Math.PI * 2);
  ctx.fill();
}
