import { utils } from "./utils/utils.js";


export class Sprite {
  constructor(config) {
    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = true; // config.useShadow || false
    this.shadow.src = "src/game/assets/objects/shadow.png";
    if (this.useShadow) {
      this.shadow.onload = () => {
        this.isShadowLoaded = true;
      };
    }

    // Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-up": [[0, 2]],
      "idle-down": [[0, 0]],
      "idle-left": [[0, 3]],
      "idle-right": [[0, 1]],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      "walk-up": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2]
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
    };
    this.currentAnimation = config.currentAnimation || "idle-down"; // "walk-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 10;
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
    
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key){
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    // Dowtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - this.gameObject.offsetX + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - this.gameObject.offsetY + utils.withGrid(6) - cameraPerson.y;
    
    if (this.isLoaded) {
      ctx.beginPath()
      ctx.arc(x+this.gameObject.center.offsetX, y+this.gameObject.center.offsetY, this.gameObject.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'
      ctx.fill()
    }
    
    this.isShadowLoaded &&
      ctx.drawImage(
        this.shadow,
        0,
        0,
        32,
        32,
        x + this.gameObject.shadowOffsetX,
        y + this.gameObject.shadowOffsetY,
        32,
        32
        );
        
        const [frameX, frameY] = this.frame;
        
        this.isLoaded &&
        ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);
        

    this.updateAnimationProgress();
  }
}
