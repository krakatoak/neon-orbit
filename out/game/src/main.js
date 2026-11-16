// NEON ORBIT - entry point & game loop
import { W, H } from "./config.js";
import { Input } from "./input.js";
import { World } from "./world.js";
import { draw, drawShip, drawAsteroid, drawCell, drawText, drawHUD } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = W;
canvas.height = H;

const input = new Input();
const world = new World();

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  world.update(dt, input);

  draw(ctx);

  if (world.state === "title") {
    drawText(ctx, "NEON ORBIT", W / 2, 130, 34, "#00f0ff");
    drawText(ctx, "keep your satellite on the ring", W / 2, 180, 13, "#9a8fc0");
    drawText(ctx, "left/right or A/D to move", W / 2, 480, 15, "#e8e0f8");
    drawText(ctx, "catch yellow cells for score", W / 2, 505, 13, "#ffe74c");
    drawText(ctx, "avoid the asteroids", W / 2, 528, 13, "#ff5a6e");
    drawText(ctx, "press any key to start", W / 2, 575, 18, "#ffffff", );
    // preview ship
    drawShip(ctx, -Math.PI / 2);
    if (input.any) {
      input.reset();
      world.start();
    }
  } else if (world.state === "play") {
    drawShip(ctx, world.ang);
    for (const a of world.asteroids) drawAsteroid(ctx, a.x, a.y, a.r, a.rot);
    for (const c of world.cells) drawCell(ctx, c.x, c.y, world.time);
    drawHUD(ctx, world.score, world.lives, world.level);
  } else if (world.state === "over") {
    drawText(ctx, "GAME OVER", W / 2, 220, 40, "#ff5a6e");
    drawText(ctx, `score ${world.score}  level ${world.level}`, W / 2, 280, 20, "#e8e0f8");
    drawText(ctx, "press any key to restart", W / 2, 480, 16, "#ffffff");
    if (input.any) {
      input.reset();
      world.reset();
      world.start();
    }
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
