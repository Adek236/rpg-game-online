import { Person } from "./Person.js";
import { utils } from "./utils/utils.js";
export class Monster extends Person {
  constructor(config) {
    super(config);
    // this.type = config.type || "monster";
    this.hp = config.hp;
    this.radius = 50;
    this.possibleTargets = null;
    // this.newBehav = [
    //   { type: "walk", direction: "right" },
    //   { type: "walk", direction: "right" },
    //   { type: "walk", direction: "right" },
    //   { type: "walk", direction: "left" },
    //   { type: "walk", direction: "left" },
    //   { type: "walk", direction: "left" },
    // ];
  }

  update(state){
    super.update(state);

    this.possibleTargets = state.map.gameObjects;

    this.findTarget();
  }

  // time() {
  //   setTimeout(() => {
  //     this.newBehav = [
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "left" },
  //     ];
  //   }, 5000);
    
  // }

  // draw(ctx, cameraPerson){
  //   const x = this.x - this.offsetX + utils.withGrid(10.5) - cameraPerson.x + 16;
  //   const y = this.y - this.offsetY + utils.withGrid(6) - cameraPerson.y + 24;
  //   // console.log("hi")
  //   ctx.beginPath()
  //   ctx.arc(x, y, 50, 0, Math.PI * 2)
  //   ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'
  //   ctx.fill()
  // }

  findTarget(){
    if (this.possibleTargets);
    
    // TODO: find distance between monster and target
    // add collision
    // if collision add this player to target 
    // attack him
    Object.values(this.possibleTargets).forEach((target) => {
      if (target.name === "Teddy"){
        // console.log(target.x, target.y);
      }
    });

  }

  createPathToTarget(){
    // TODO: if we have target 
    // create path to first free spot around target
    // (path must check walls)
    // if not free spot try again untill spot will be free
  }

  attack(){
    // TODO: if we are at free spot around target
    // start attack him

  }

// TODO: if target die return to your behaviour (need db connection)
// if monster die, dissaper him and put on this spot loot bag
// (db connection need, positions of loot bags, i think)




}
