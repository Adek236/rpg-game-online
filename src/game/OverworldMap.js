import { GameObject } from "./GameObject.js";
import { utils } from "./utils/utils.js";
import { Person } from "./Person.js";

export class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }
  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

export const OverworldMaps = {
  outsideMap: {
    lowerSrc: "src/game/assets/maps/testMapOutside.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    gameObjects: {
      // hero: new Person({
      //   x: utils.withGrid(7),
      //   y: utils.withGrid(4),
      //   offsetX: 9,
      //   shadowOffsetX: 1,
      // }),
      hero2: new Person ({
        isPlayerControlled: true,
        x: utils.withGrid(9),
        y: utils.withGrid(4),
        offsetX: 9,
        shadowOffsetX: 1,
      }),
    },
  },
  insideMap: {
    lowerSrc: "src/game/assets/maps/testMap.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 7,
        y: 4,
        offsetX: 9,
        shadowOffsetX: 1,
      }),
      hero2: new GameObject({
        x: 6,
        y: 4,
        offsetX: 9,
        shadowOffsetX: 1,
      }),
    },
  }
};
