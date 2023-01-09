import { Person } from "./Person.js";
export class Monster extends Person {
  constructor(config) {
    super(config);
    this.type = "monster";
    this.hp = config.hp;
    this.newBehav = [
      { type: "walk", direction: "right" },
      { type: "walk", direction: "right" },
      { type: "walk", direction: "right" },
      { type: "walk", direction: "left" },
      { type: "walk", direction: "left" },
      { type: "walk", direction: "left" },
    ];
  }

  time() {
    setTimeout(() => {
      this.newBehav = [
        { type: "walk", direction: "right" },
        { type: "walk", direction: "left" },
      ];
    }, 5000);
    
  }

  findTarget(){

  }

  createPathToTarget(){

  }







}
