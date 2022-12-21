import { GameObject } from "./GameObject.js";
import { OverworldMap, OverworldMaps } from "./OverworldMap.js";

export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {

    // Clear off the canvas  
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.heigth);  

    // Draw Lower layer
    this.map.drawLowerImage(this.ctx);
    
    // Draw Game Objects
    Object.values(this.map.gameObjects).forEach(object => {
      // object.x += 0.02;
      object.sprite.draw(this.ctx);
    })

    // Draw Upper layer
    this.map.drawUpperImage(this.ctx);




      requestAnimationFrame(()=> {
        step();
      })
    }
    step();
  }

  init() {
    this.map = new OverworldMap(OverworldMaps.outsideMap);
    this.startGameLoop();





    // const image = new Image();
    // image.src = "src/game/assets/maps/testMapOutside.png";
    // image.onload = () => {
    //   this.ctx.drawImage(image, 0, 0);
    // };

    // // Place some Game Object
    // const hero = new GameObject({
    //   x: 7,
    //   y: 4,
    //   offsetX: 9,
    //   shadowOffsetX: 1,
    // });
    
    // const hero2 = new GameObject({
    //   x: 6,
    //   y: 4,
    //   offsetX: 9,
    //   shadowOffsetX: 1
    // });

    // setTimeout(() => {
    //   hero.sprite.draw(this.ctx);
    //   hero2.sprite.draw(this.ctx);
    // }, 200);

    // const x = 6;
    // const y = 11;
    // const hero = new Image();
    // hero.src = 'src/game/assets/characters/hero.png';
    // hero.onload = () => {
    //     this.ctx.drawImage(
    //         hero,
    //         0,
    //         0,
    //         32,
    //         32,
    //         x*16-10,
    //         y*16-18,
    //         32,
    //         32);
    // };

    // const shadow = new Image();
    // shadow.src = 'src/game/assets/objects/shadow.png';
    // shadow.onload = () => {
    //     this.ctx.drawImage(
    //         shadow,
    //         0,
    //         0,
    //         32,
    //         32,
    //         x*16-9,
    //         y*16-18,
    //         32,
    //         32);
    // };
  }
}
