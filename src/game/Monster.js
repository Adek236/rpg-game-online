import { Person } from "./Person.js";
import { utils } from "./utils/utils.js";
import { db } from "../config/firebase.js";
import {
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// TODO: Monsters must have db connection to see all players (gameObjects)

export class Monster extends Person {
  constructor(config) {
    super(config);
    // this.type = config.type || "monster";
    this.movingProgressReamingMax = 32;
    this.directionUpdate = {
      up: ["y", -0.5],
      down: ["y", 0.5],
      left: ["x", -0.5],
      right: ["x", 0.5],
      leftUp: [
        ["x", "y"],
        [-0.5, -0.5],
      ],
      leftDown: [
        ["x", "y"],
        [-0.5, 0.5],
      ],
      rightUp: [
        ["x", "y"],
        [0.5, -0.5],
      ],
      rightDown: [
        ["x", "y"],
        [0.5, 0.5],
      ],
    };
    this.hp = config.hp;
    this.radius = 100;
    this.validTargets = [];
    this.lastPosition = null;
    this.id = config.id;
  }

  update(state) {
    super.update(state);

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

    this.followTarget(state);
  }

  getDistanceToTarget(from, to) {
    const gapX = from.x - to.x;
    const gapY = from.y - to.y;
    return Math.hypot(gapX, gapY);
  }

  followTarget(state) {
    if (!this.validTargets) return;

    const target = {
      x: this.validTargets[0]?.x,
      y: this.validTargets[0]?.y,
      aroundFreeSpace: {
        up: { isFree: null, position: null, distance: null },
        down: { isFree: null, position: null, distance: null },
        left: { isFree: null, position: null, distance: null },
        leftUp: { isFree: null, position: null, distance: null },
        leftDown: { isFree: null, position: null, distance: null },
        right: { isFree: null, position: null, distance: null },
        rightUp: { isFree: null, position: null, distance: null },
        rightDown: { isFree: null, position: null, distance: null },
      },
    };

    // Clear free spaces if target disappear
    // TODO: loop
    if (!target.x || !target.y) {
      target.aroundFreeSpace = {
        up: { isFree: null, position: null, distance: null },
        down: { isFree: null, position: null, distance: null },
        left: { isFree: null, position: null, distance: null },
        leftUp: { isFree: null, position: null, distance: null },
        leftDown: { isFree: null, position: null, distance: null },
        right: { isFree: null, position: null, distance: null },
        rightUp: { isFree: null, position: null, distance: null },
        rightDown: { isFree: null, position: null, distance: null },
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
    // console.log(target.aroundFreeSpace);

    // Stop if monster is in free space around player
    let inFreeSpace = false;
    for (const obj in target.aroundFreeSpace) {
      if (
        target.aroundFreeSpace[obj].position.x === this.x &&
        target.aroundFreeSpace[obj].position.y === this.y
      ) {
        // console.log("im in free spot");
        inFreeSpace = true;
        return;
      }
    }

    if (inFreeSpace) return;
    // console.log(target.aroundFreeSpace);

    // Choose nearest free space by distance
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

    if (!freeDirection) return;

    const possibleMove = [];

    // Check possible move around monster
    Object.keys(this.directionUpdate).forEach((direction) => {
      possibleMove.push({
        name: direction,
        isPossible: !state.map.isSpaceTaken(this.x, this.y, direction),
        distanceToTarget: this.getDistanceToTarget(
          target.aroundFreeSpace[freeDirection].position,
          utils.nextPosition(this.x, this.y, direction)
        ),
      });
    });

    // Sort possible move around monster by distance
    // and return closest move to target
    const newDirection = possibleMove
      .sort((a, b) => a.distanceToTarget - b.distanceToTarget)
      .find((_, i) => {
        return possibleMove[i].isPossible;
      });
    //   console.log(freeDirection)
    // console.log(possibleMove);

    if (this.movingProgressReaming === 0) {
      this.startBehavior(
        { arrow: newDirection.name, map: state.map },
        { type: "walk", direction: newDirection.name }
      );
    }
  }

  dbUpdateMonster(state){
    update(ref(db, `monsters/${this.currentMap}/${this.id}`), state.monster);
  }

  attack() {
    // TODO: if we are at free spot around target
    // start attack him
  }

  // TODO: if target die return to your behaviour (need db connection)
  // if monster die, dissaper him and put on this spot loot bag
  // (db connection need, positions of loot bags, i think)
}
