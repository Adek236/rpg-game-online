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
        const gapX =
          target.x +
          target.center.offsetX -
          target.offsetX -
          (this.x + this.center.offsetX - this.offsetX);
        const gapY =
          target.y +
          target.center.offsetY -
          target.offsetY -
          (this.y + this.center.offsetY - this.offsetY);
        const distance = Math.hypot(gapX, gapY);
        return (
          target.type === "Person" && distance < target.radius + this.radius
        );
      }
    );

    this.createPathToTarget(state);
  }

  createPathToTarget(state) {
    // TODO: if we have target
    // find free spot around target (NEED TO IMPROVE TO 8 SPOT)
    // create path to first free spot around target
    // (path must check walls)
    // if not free spot try again untill spot will be free
    if (!this.validTargets) return;
    const target = {
      x: this.validTargets[0]?.x,
      y: this.validTargets[0]?.y,
      aroundFreeSpace: {
        up: null,
        down: null,
        left: null,
        right: null,
      },
    };

    // Clear free spaces if target disappear
    if (!target.x || !target.y) {
      target.aroundFreeSpace = {
        up: null,
        down: null,
        left: null,
        right: null,
      };
      return;
    }

    // Check free spaces around target
    Object.keys(target.aroundFreeSpace).forEach((direction) => {
      const result = state.map.isSpaceTaken(target.x, target.y, direction);
      result
        ? (target.aroundFreeSpace[direction] = false)
        : (target.aroundFreeSpace[direction] = true);

      console.log(target.aroundFreeSpace);
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
