// NEON ORBIT — keyboard state.
// Holds which keys are down and the edge events (pause, start) the loop consumes.

export class Input {
  constructor(target = window) {
    this.target = target;
    this.left = false;
    this.right = false;
    this.pauseHeld = false;
    this.pausePressed = false;
    this.anyPressed = false;

    this._onKeyDown = (event) => {
      if (event.repeat) return;
      switch (event.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          this.left = true;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.right = true;
          break;
        case " ":
        case "p":
        case "P":
          this.pauseHeld = !this.pauseHeld;
          this.pausePressed = true;
          break;
        default:
          return;
      }
      // Keep the page from scrolling when the arrows or space bar are used.
      event.preventDefault();
      this.anyPressed = true;
    };

    this._onKeyUp = (event) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          this.left = false;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.right = false;
          break;
      }
    };

    target.addEventListener("keydown", this._onKeyDown);
    target.addEventListener("keyup", this._onKeyUp);
    this._onBlur = () => this.clear();
    target.addEventListener("blur", this._onBlur);
  }

  // Edge events are consumed once per frame by the game loop.
  consumePause() {
    const pressed = this.pausePressed;
    this.pausePressed = false;
    return pressed;
  }

  consumeAny() {
    const pressed = this.anyPressed;
    this.anyPressed = false;
    return pressed;
  }

  releaseAll() {
    this.left = false;
    this.right = false;
    this.anyPressed = false;
    this.pausePressed = false;
  }

  // Forget the pause toggle too, so a lost focus cannot leave it stuck.
  clear() {
    this.releaseAll();
    this.pauseHeld = false;
  }

  destroy() {
    this.target.removeEventListener("keydown", this._onKeyDown);
    this.target.removeEventListener("keyup", this._onKeyUp);
    this.target.removeEventListener("blur", this._onBlur);
    this.releaseAll();
  }
}
