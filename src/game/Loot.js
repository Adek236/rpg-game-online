import { GameObject } from "./GameObject.js";
import { Sprite } from "./Sprite.js";

export class Loot extends GameObject {
    constructor(config){
        super(config);
        this.type = "Loot";
        this.isWalkable = true;
        this.rank = config.rank || 1;

        this.outfit = `src/game/assets/objects/chest${config.rank}.png`;

        this.sprite = new Sprite({
            useShadow: false,
            gameObject: this,
            src: this.outfit || "src/game/assets/objects/chest1.png",
            animations: {
                "close": [[0,0]],
                "open": [[2,0]]
            },
            currentAnimation: "open",
          });
    }


}