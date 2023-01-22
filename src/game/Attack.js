import { Sprite } from "./Sprite.js";
export class Attack {
    constructor(config) {
        this.name = config.name;
        this.sprite = new Sprite({
            gameObject: config.gameObject,
            src: "src/game/assets/objects/sword2.png",
            useShadow: false,
            animations: config.animations,
            useSlash: config.useSlash || {active: false, direction: "down"},
            isAttackAnimation: true
        });

        // Reference to game object
        this.gameObject = config.gameObject;
    }

    init(){
        this.gameObject.attacks.push(this.name);
        setTimeout(()=>{
          this.gameObject.attacks = [];
        },300)
    }
}