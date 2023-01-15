export const utils = {
  withGrid(n) {
    return n * 16;
  },
  withGridReverse(n) {
    return n / 16;
  },
  asGridCoords(x, y) {
    return `${x * 16},${y * 16}`;
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    } else if (direction === "leftUp") {
      x -= size;
      y -= size;
    } else if (direction === "leftDown") {
      x -= size;
      y += size;
    } else if (direction === "rightUp") {
      x += size;
      y -= size;
    } else if (direction === "rightDown") {
      x += size;
      y += size;
    }
    return { x, y };
  },
  oppositeDirection(direction) {
    if (direction === "left") {
      return "right";
    }
    if (direction === "leftUp") {
      return "rightDown";
    }
    if (direction === "leftDown") {
      return "rightUp";
    }
    if (direction === "right") {
      return "left";
    }
    if (direction === "rightUp") {
      return "leftDown";
    }
    if (direction === "rightDown") {
      return "leftUp";
    }
    if (direction === "up") {
      return "down";
    }
    return "up";
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
};
