export class Sprite {
    constructor(config) {

        // Set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // Shadow
        this.shadow = new Image();
        this.useShadow = true; // config.useShadow || false
        this.shadow.src = 'src/game/assets/objects/shadow.png';
        if (this.useShadow) {
            this.shadow.onload = () => {
                this.isShadowLoaded = true;
            }
        }

        // Configure Animation & Initial State
        this.animations = config.animations || {
            idleDown: [
                [0,0]
            ]
        }
        this.currentAnimation = config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;

        // Reference the game object
        this.gameObject = config.gameObject;
    }

    draw(ctx) {
        const x = this.gameObject.x - this.gameObject.offsetX;
        const y = this.gameObject.y - this.gameObject.offsetY;

        this.isShadowLoaded && ctx.drawImage(this.shadow,
            0,0,
            32,32,
            x + this.gameObject.shadowOffsetX, 
            y + this.gameObject.shadowOffsetY, 
            32,32
            )

        this.isLoaded && ctx.drawImage(this.image,
            0,0,
            32,32,
            x, y,
            32,32
            )
    }
}