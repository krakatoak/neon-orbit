// NEON ORBIT — bootstrap and frame loop.
import { VIEW } from "./config.js";
import { Input } from "./input.js";
import { World } from "./world.js";
import { drawFrame, drawTitle, drawPause, drawOver } from "./render.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
canvas.width = VIEW.width;
canvas.height = VIEW.height;

const input = new Input(window);
const world = new World();

// A testing handle: the screenshot harness drives the page through this.
window.__neonOrbit = { world, input };

let previous = performance.now();

function frame(now) {
  const dt = Math.min((now - previous) / 1000, 0.05);
  previous = now;

  if (input.consumePause()) {
    if (world.state === "play" || world.state === "pause") world.togglePause();
  }

  if (input.consumeAny() && (world.state === "title" || world.state === "over")) {
    world.start();
  }

  world.update(dt, input);

  drawFrame(ctx, world);
  if (world.state === "title") drawTitle(ctx);
  if (world.state === "pause") drawPause(ctx);
  if (world.state === "over") drawOver(ctx, world);

  input.releaseAll();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
