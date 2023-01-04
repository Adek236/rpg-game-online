import { getGamePage } from "../app.js";
import { DirectionInput } from "./DirectonInput.js";
import { GameObject } from "./GameObject.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { OverworldMap } from "./OverworldMap.js";
import { playerState } from "./PlayerState.js";

export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.hero = null;
    this.heroId = null;
  }

  startGameLoop() {
    this.hero = playerState.name;
    this.heroId = playerState.id;
    console.log(this)
    const step = () => {
      // Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // console.log("3-overworld")
      // Establish the camera person
      const cameraPerson = this.map.gameObjects[this.hero];
      // console.log(cameraPerson)
      // Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      // console.log(OverworldMaps.outsideMap.walls)

      requestAnimationFrame(step);
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to
      this.map.checkForActionCutscene();
    });
  }
  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === this.hero) {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
    this.map.objectListener();
  }

  init(map) {
    this.startMap(window.OverworldMaps[map]);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
    // getGamePage();

    // this.map.startCutscene([
    //   { type: "textMessage", text: "hello"}

    //   // {who: "hero2", type: "walk", direction: "down"},
    //   // {who: "hero2", type: "walk", direction: "right"},
    //   // {who: "hero2", type: "walk", direction: "right"},
    //   // {who: "hero2", type: "stand", direction: "up", time: 2800},
    //   // {who: "hero", type: "walk", direction: "down"},
    // ]
    // )
  }
}
