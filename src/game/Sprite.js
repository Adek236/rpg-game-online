import { utils } from "./utils/utils.js";

export class Sprite {
  constructor(config) {
    this.isAttackAnimation = config.isAttackAnimation || false;

    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow || true;
    this.shadow.src = "src/game/assets/objects/shadow.png";
    if (this.useShadow) {
      this.shadow.onload = () => {
        this.isShadowLoaded = true;
      };
    }

    // Slash
    this.isSlash = new Image();
    this.useSlash = config.useSlash || {active: false, direction: "left"};
    this.isSlash.src = "src/game/assets/objects/slash3.png";
    if (this.useSlash.active) {
      this.isSlash.onload = () => {
        this.isSlashLoaded = true;
      };
    }

    this.slashDirection = {
      "up": [{frame:0, offset: 3},{frame:0, offset: 0}],
      "down": [{frame:0, offset: 15},{frame:1, offset: 0}],
      "left": [{frame:0, offset: 8},{frame:2, offset: -10}],
      "right": [{frame:0, offset: 8},{frame:3, offset: 10}],
    }

    // // Nickname
    // this.weapon = new Image();
    // this.weapon.src = "src/game/assets/objects/sword2.png";
    // if (true) {
    //   this.weapon.onload = () => {
    //     this.weaponLoaded = true;
    //   };
    // }

    // Example attack animation
    // animations: {
      // "attack-sword": [[{frame:0, offset: -15}, {frame:0, offset: -10}],{frame:1, offset: -15}, {frame:0, offset: -10}],
    // },

    // Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-up": [[0, 2]],
      "idle-down": [[0, 0]],
      "idle-left": [[0, 3]],
      "idle-leftUp": [[0, 3]],
      "idle-leftDown": [[0, 3]],
      "idle-right": [[0, 1]],
      "idle-rightUp": [[0, 1]],
      "idle-rightDown": [[0, 1]],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
      "walk-leftUp": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
      "walk-leftDown": [
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
        [0, 2],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-rightUp": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-rightDown": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      // "attack-up": [
      //   [0, 6],
      //   [1, 6],
      // ],
      // "attack-down": [
      //   [0, 4],
      //   [1, 4],
      // ],
      // "attack-left": [
      //   [0, 7],
      //   [1, 7],
      // ],
      // "attack-right": [
      //   [0, 5],
      //   [1, 5],
      // ],
      "attack-up": [
        [1, 2],
        [0, 2],
      ],
      "attack-down": [
        [1, 0],
        [0, 0],
      ],
      "attack-left": [
        [1, 3],
        [0, 3],
      ],
      "attack-right": [
        [1, 1],
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
    // console.log(this.animations[this.currentAnimation][this.currentAnimationFrame])
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  get slashFrame() {
    return this.slashDirection[this.useSlash.direction];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
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
    const x =
      this.gameObject.x -
      this.gameObject.offsetX +
      utils.withGrid(10.5) -
      cameraPerson.x;
    const y =
      this.gameObject.y -
      this.gameObject.offsetY +
      utils.withGrid(6) -
      cameraPerson.y;

    // Object area
    // if (this.isLoaded) {
    //   ctx.beginPath()
    //   ctx.arc(x+this.gameObject.center.offsetX, y+this.gameObject.center.offsetY, this.gameObject.radius, 0, Math.PI * 2)
    //   ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'
    //   ctx.fill()
    // }

    // Name above hero
    // ctx.font = '5px Arial Black';
    // ctx.fillStyle = 'red';
    // ctx.fillText("Teddy", x+8, y+5);

    const [slashY, slashX] = this.slashFrame;

      this.isSlashLoaded && ctx.drawImage(
        this.isSlash,
        slashX.frame*32,
        slashY.frame*32,
        32,
        32,
        x+slashX.offset,
        y+slashY.offset,
        32,
        32
      );

    // If person or monster have valid target show hp bar
    if (
      (this.gameObject.type === "Monster" && this.gameObject.validTargets.length > 0) ||
      this.gameObject.type === "Person"
    ) {
      ctx.fillStyle = "rgb(245,245,245, 0.6)";
      ctx.fillRect(x + 10, y + 8, 12, 3);

      ctx.fillStyle = "silver";
      ctx.fillRect(x + 11, y + 9, 10, 1);

      ctx.fillStyle = "red";
      ctx.fillRect(x + 11, y + 9, 5, 1);
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

     if (!this.isAttackAnimation) {
      const [frameX, frameY] = this.frame;

      this.isLoaded &&
        ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);
     } else {
       
       const [X, Y] = this.frame;

    this.isLoaded &&
      ctx.drawImage(this.image, X.frame * 32, Y.frame * 32, 32, 32, x + X.offset, y + Y.offset, 32, 32);
     }
    
    this.updateAnimationProgress();
  }
}
