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
  hpConverter({currentHp, maxHp, scale}){
    const result = currentHp/maxHp*scale;
    return result <= 0 ? 0 : result;
  },
  collectionNumbersBetweenNumbers(startNumber, lastNumber, increaseNumber){
    // -15
    // 21
    // result: 15,16,17,18,19,20,21
    // 15-21=6
    const resultArr = [startNumber];
    const distanceBeetwen = Math.abs(startNumber - lastNumber);
    
    let num = startNumber;
    for (let i = 0; i < (distanceBeetwen/increaseNumber); i++){
      num += increaseNumber;
      resultArr.push(num);
    }
    // console.log(resultArr);
    
    return resultArr;
  },
  getDistanceToObject(from, to) {
    const gapX = from.x - to.x;
    const gapY = from.y - to.y;
    return Math.hypot(gapX, gapY);
  }
};
