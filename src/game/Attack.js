import { Sprite } from "./Sprite.js";
import { dataAttacks } from "./data/attacks.js";

export class Attack {
  constructor(config) {
    this.name = config.name;
    this.sprite = new Sprite({
      gameObject: config.gameObject,
      src: dataAttacks[config.name].src,
      useShadow: false,
      animations: dataAttacks[config.name].animations,
      useSlash: config.useSlash || { active: false, direction: "down" },
      isAttackAnimation: true,
    });

    // Reference to game object 
    this.gameObject = config.gameObject;
  }

  init() {
    // Add attack to attacks array
    this.gameObject.attacks.push(dataAttacks[this.name].name);
    setTimeout(() => {
        // Remove attack from attacks array
      this.gameObject.attacks = this.gameObject.attacks.filter((el) => {
        return el !== dataAttacks[this.name].name;
      });
    }, dataAttacks[this.name].time);
  }
}
