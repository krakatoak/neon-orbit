// NEON ORBIT - keyboard input
export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.any = false;
    this.pause = false;
    this._handler = (e) => {
      if (e.type === "keydown") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { this.left = true; e.preventDefault(); }
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { this.right = true; e.preventDefault(); }
        if (e.key === " " || e.key === "p" || e.key === "P") { this.pause = !this.pause; e.preventDefault(); }
        this.any = true;
      } else if (e.type === "keyup") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.left = false;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.right = false;
      }
    };
    window.addEventListener("keydown", this._handler);
    window.addEventListener("keyup", this._handler);
  }
  reset() { this.left = false; this.right = false; this.any = false; this.pause = false; }
}
