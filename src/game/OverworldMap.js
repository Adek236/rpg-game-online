import { GameObject } from "./GameObject.js";
import { utils } from "./utils/utils.js";
import { Person } from "./Person.js";

export class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects(){
    Object.values(this.gameObjects).forEach(o => {
      // TODO: determine if this object should acctually mount
      o.mount(this);
    })
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

export const OverworldMaps = {
  outsideMap: {
    lowerSrc: "src/game/assets/maps/testMapOutside.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    gameObjects: {
      hero2: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        offsetX: 9,
        shadowOffsetX: 1,
      }),
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(9),
        y: utils.withGrid(4),
        src: "src/game/assets/characters/hero2.png",
      }),
    },
    walls: {
      [utils.asGridCoords(7, 4)]: true,
    },
  },
  insideMap: {
    lowerSrc: "src/game/assets/maps/testMap.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(4),
        offsetX: 9,
        shadowOffsetX: 1,
      }),
      hero2: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(9),
        y: utils.withGrid(4),
        offsetX: 9,
        shadowOffsetX: 1,
      }),
    },
  },
};
