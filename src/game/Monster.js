import { Person } from "./Person.js";
import { utils } from "./utils/utils.js";

// TODO: Monsters must have db connection to see all players (gameObjects)

export class Monster extends Person {
  constructor(config) {
    super(config);
    // this.type = config.type || "monster";
    this.hp = config.hp;
    this.radius = 50;
    this.validTargets = [];
  }

  update(state) {
    super.update(state);
    // console.log(this.validTargets);
    // this.possibleTargets = state.map.gameObjects;

    this.findTarget(state);
  }

  findTarget(state) {
    // TODO: Stop valid targets, extend radius, add one target permamently,
    // until he died
    // or escape extended radius (or in future u random change target),
    // reset all, back to position, start valid targets again.

    // Mark targets that will enter your radius
    this.validTargets = Object.values(state.map.gameObjects).filter(
      (target) => {
        // const targetObj = {
        //   x: target.x,
        //   centerOffsetX: target.center.offsetX,
        //   offsetX: target.offsetX,
        //   y: target.y,
        //   centerOffsetY: target.center.offsetY,
        //   offsetY: target.offsetY
        // }
        // const monsterObj = {
        //   x: this.x,
        //   centerOffsetX: this.center.offsetX,
        //   offsetX: this.offsetX,
        //   y: this.y,
        //   centerOffsetY: this.center.offsetY,
        //   offsetY: this.offsetY
        // }
        const targetObj = {
          x: target.x,
          y: target.y,
        };
        const monsterObj = {
          x: this.x,
          y: this.y,
        };

        const distance = this.getDistanceToTarget(monsterObj, targetObj);

        return (
          target.type === "Person" && distance < target.radius + this.radius
        );
      }
    );

    this.createPathToTarget(state);
  }

  getDistanceToTarget(from, to) {
    const gapX = from.x - to.x;
    const gapY = from.y - to.y;
    // const gapX =
    //   from.x +
    //   from.centerOffsetX -
    //   from.offsetX -
    //   (to.x + to.centerOffsetX - to.offsetX);
    // const gapY =
    //   from.y +
    //   from.centerOffsetY -
    //   from.offsetY -
    //   (to.y + to.centerOffsetY - to.offsetY);
    return Math.hypot(gapX, gapY);
  }

  createPathToTarget(state) {
    // TODO: if we have target
    // find free spot around target (NEED TO IMPROVE TO 8 SPOT)
    // create path to first free spot around target
    // (path must check walls)
    // if not free spot try again untill spot will be free
    if (!this.validTargets) return;
    // if (this.validTargets[0]?.movingProgressReaming !== 0
    //   && this.movingProgressReaming !== 0
    //   ) return;
    const target = {
      x: this.validTargets[0]?.x,
      y: this.validTargets[0]?.y,
      aroundFreeSpace: {
        up: { isFree: null, position: null, distance: null },
        down: { isFree: null, position: null, distance: null },
        left: { isFree: null, position: null, distance: null },
        right: { isFree: null, position: null, distance: null },
      },
    };

    // Clear free spaces if target disappear
    if (!target.x || !target.y) {
      target.aroundFreeSpace = {
        up: { isFree: null, position: null, distance: null },
        down: { isFree: null, position: null, distance: null },
        left: { isFree: null, position: null, distance: null },
        right: { isFree: null, position: null, distance: null },
      };
      return;
    }

    if (this.movingProgressReaming > 0) return;

    // Check free spaces around target
    Object.keys(target.aroundFreeSpace).forEach((direction) => {
      const result = state.map.isSpaceTaken(target.x, target.y, direction);
      const pos = utils.nextPosition(target.x, target.y, direction);
      if (result) {
        target.aroundFreeSpace[direction].isFree = false;
      } else {
        target.aroundFreeSpace[direction].isFree = true;
      }
      target.aroundFreeSpace[direction].position = pos;
      target.aroundFreeSpace[direction].distance = this.getDistanceToTarget(
        { x: pos.x, y: pos.y },
        { x: this.x, y: this.y }
      );
    });
    console.log(target.aroundFreeSpace);

    // TODO: stop if u are in free space around player
    let inFreeSpace = false;
    for (const obj in target.aroundFreeSpace) {
      if (
        target.aroundFreeSpace[obj].position.x === this.x &&
        target.aroundFreeSpace[obj].position.y === this.y
      ) {
        console.log("im in free spot");
        inFreeSpace = true;
        return;
      }
    }

    if (inFreeSpace) return;
    // target.aroundFreeSpace["up"].isFree = false;
    console.log(target.aroundFreeSpace);
    // Choose one free space (actually first)
    // TODO: choose close position, check distance
    const freeDirection = Object.keys(target.aroundFreeSpace)
      .sort(
        (a, b) =>
          target.aroundFreeSpace[a].distance -
          target.aroundFreeSpace[b].distance
      )
      .find((key) => {
        return target.aroundFreeSpace[key].isFree;
      });
    const waypoint = utils.nextPosition(target.x, target.y, freeDirection);

    // Convert amount of square, axis x and y,
    // needed to approach player
    const gapX = waypoint.x - this.x;
    const gapY = waypoint.y - this.y;
    console.log("x = ", gapX, "y = ", gapY, freeDirection);

    const monsterWaypoints = [];
    let dir, square;
    if (gapX < 0) {
      dir = "left";
      // gapX < 16 ? 16 : gapX;
      square = Math.abs(Math.trunc(gapX / 16));
      for (let i = 0; i < square; i++) {
        monsterWaypoints.push(dir);
      }
    }
    if (gapX > 0) {
      dir = "right";
      // gapX < 16 ? 16 : gapX;
      square = Math.abs(Math.trunc(gapX / 16));
      for (let i = 0; i < square; i++) {
        monsterWaypoints.push(dir);
      }
    }
    if (gapY < 0) {
      dir = "up";
      // gapY < 16 ? 16 : gapY;
      square = Math.abs(Math.trunc(gapY / 16));

      console.log("gapy", gapY / 16);
      console.log(square);
      for (let i = 0; i < square; i++) {
        monsterWaypoints.push(dir);
      }
    }
    if (gapY > 0) {
      dir = "down";
      // gapY < 16 ? 16 : gapY;
      square = Math.abs(Math.trunc(gapY / 16));
      for (let i = 0; i < square; i++) {
        monsterWaypoints.push(dir);
      }
    }
    console.log("player ", waypoint.x, waypoint.y);
    console.log("monster ", this.x, this.y);
    console.log(monsterWaypoints);

    monsterWaypoints.forEach((direction) => {
      this.startBehavior(
        { arrow: direction, map: state.map },
        { type: "walk", direction: direction }
      );
    });
  }

  attack() {
    // TODO: if we are at free spot around target
    // start attack him
  }

  // TODO: if target die return to your behaviour (need db connection)
  // if monster die, dissaper him and put on this spot loot bag
  // (db connection need, positions of loot bags, i think)
}
