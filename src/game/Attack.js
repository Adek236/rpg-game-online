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
      useSlash: dataAttacks[config.name].useSlash,
      isAttackAnimation: true,
    });

    // Reference to game object
    this.gameObject = config.gameObject;
  }

  init() {
    // Add attack to attacks array
    this.gameObject.attacks.push(dataAttacks[this.name]);
    // TODO: \/ without this is error WHY?
    if (this.gameObject.type === "Monster") {
      this.gameObject.attack.sprite.currentAnimation =
        dataAttacks[this.name].animateName + this.gameObject.direction;
    }

    setTimeout(() => {
      // Remove attack from attacks array
      this.gameObject.attacks = this.gameObject.attacks.filter((el) => {
        return el !== dataAttacks[this.name];
      });
    }, dataAttacks[this.name].time);
  }
}
