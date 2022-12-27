import { GameObject } from "./GameObject.js";
import { utils } from "./utils/utils.js";
import { Person } from "./Person.js";
import { convertedOutisdeMapWalls } from "./data/testMapOutsideCollision.js";
import { OverworldEvent } from "./OverworldEvent.js";

export class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
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
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      // TODO: determine if this object should acctually mount
      object.mount(this);
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
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
        behaviorLoop: [
          {type: "stand", direction: "down", time: 800},
          {type: "stand", direction: "right", time: 1200},
        ]
      }),
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(9),
        y: utils.withGrid(4),
        src: "src/game/assets/characters/hero2.png",
      }),
      hero3: new Person({
        x: utils.withGrid(12),
        y: utils.withGrid(7),
        offsetX: 8,
        src: 'src/game/assets/characters/hero3.png',
        behaviorLoop: [
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "right"},
          {type: "stand", direction: "down", time: 2800},
          {type: "walk", direction: "down"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "left"},
          {type: "walk", direction: "up"}
        ]
      })
    },
    walls: convertedOutisdeMapWalls,
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
      hero3: new Person({
        x: utils.withGrid(12),
        y: utils.withGrid(7),
        offsetX: 9,
        shadowOffsetX: 1,
        src: 'src/game/assets/characters/hero3.png'
      }),
    },
  },
};
