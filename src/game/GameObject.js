import { Sprite } from "./Sprite.js";

export class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.offsetX = config.offsetX || 8;
        this.offsetY = config.offsetY || 18;
        this.shadowOffsetX = config.shadowOffsetX || 0;
        this.shadowOffsetY = config.shadowOffsetY || 0;
        this.direction = config.direction || "down";

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || 'src/game/assets/characters/hero.png',
        });
    }

    update() {

    }
}