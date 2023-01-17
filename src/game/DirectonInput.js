export class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
    };

    this.slant = {
      leftUp: ["left", "up"],
      rightUp: ["right", "up"],
      leftDown: ["left", "down"],
      rightDown: ["right", "down"],
    };
  }

  get direction() {
    // If player hold two keys together, go slant
    if (this.heldDirections.length > 1) {
      for (const slantDirection in this.slant) {
        const whichSlant = [this.slant[slantDirection]].filter(
          (data) =>
            data.includes(this.heldDirections[0]) &&
            data.includes(this.heldDirections[1])
        );
        if (whichSlant.length > 0) {
          return slantDirection;
        }
      }
    }
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });
    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}
