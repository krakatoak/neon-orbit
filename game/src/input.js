// NEON ORBIT - keyboard input
export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.any = false;
    this._handler = (e) => {
      if (e.type === "keydown") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.left = true;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.right = true;
        this.any = true;
      } else if (e.type === "keyup") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.left = false;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.right = false;
      }
    };
    window.addEventListener("keydown", this._handler);
    window.addEventListener("keyup", this._handler);
  }
  reset() { this.left = false; this.right = false; this.any = false; }
}
