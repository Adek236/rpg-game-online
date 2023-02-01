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
    this.useSlash = config.useSlash || false;
    this.isSlash.src = "src/game/assets/objects/slash3.png";
    if (this.useSlash) {
      this.isSlash.onload = () => {
        this.isSlashLoaded = true;
      };
    }
    // this.isSlashUsed = false;
    // this.slashTime = 0;

    this.slashDirection = {
      up: [
        { frame: 0, offset: 3 },
        { frame: 0, offset: 0 },
      ],
      down: [
        { frame: 0, offset: 15 },
        { frame: 1, offset: 0 },
      ],
      left: [
        { frame: 0, offset: 8 },
        { frame: 2, offset: -10 },
      ],
      leftUp: [
        { frame: 0, offset: 8 },
        { frame: 2, offset: -10 },
      ],
      leftDown: [
        { frame: 0, offset: 8 },
        { frame: 2, offset: -10 },
      ],
      right: [
        { frame: 0, offset: 8 },
        { frame: 3, offset: 10 },
      ],
      rightUp: [
        { frame: 0, offset: 8 },
        { frame: 3, offset: 10 },
      ],
      rightDown: [
        { frame: 0, offset: 8 },
        { frame: 3, offset: 10 },
      ],
    };

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
      "attack-leftUp": [
        [1, 3],
        [0, 3],
      ],
      "attack-leftDown": [
        [1, 3],
        [0, 3],
      ],
      "attack-right": [
        [1, 1],
        [0, 1],
      ],
      "attack-rightUp": [
        [1, 1],
        [0, 1],
      ],
      "attack-rightDown": [
        [1, 1],
        [0, 1],
      ],
      death: [
        [0, 4],
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
      ],
    };

    this.currentAnimation = config.currentAnimation || "idle-up"; // "walk-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 10;
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  get slashFrame() {
    return this.slashDirection[this.gameObject.direction];
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
    // ctx.font = '1da0px Arial Black';
    // ctx.fillStyle = 'red';
    // ctx.fillText("-10", 208, 208);

    if (!this.isAttackAnimation) {
      // If person, or monster have valid target show hp bar
      if (
        (this.gameObject.type === "Monster" &&
          this.gameObject.validTargets.length > 0 &&
          !this.currentAnimation.includes("death")) ||
        this.gameObject.type === "Person"
      ) {
        ctx.fillStyle = "rgb(245,245,245, 0.6)";
        ctx.fillRect(x + 10, y + 8, 12, 3);

        ctx.fillStyle = "silver";
        ctx.fillRect(x + 11, y + 9, 10, 1);

        ctx.fillStyle = "red";
        ctx.fillRect(
          x + 11,
          y + 9,
          // Calculate hp
          utils.hpConverter({
            currentHp: this.gameObject.currentHp,
            maxHp: this.gameObject.maxHp,
            scale: 10,
          }),
          1
        );
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
        ctx.drawImage(
          this.image,
          frameX * 32,
          frameY * 32,
          32,
          32,
          x,
          y,
          32,
          32
        );

      // If its person walk animation,
      // if (
      //   this.gameObject.type === "Person" &&
      //   this.currentAnimation.includes("walk") &&
      //   this.currentAnimationFrame === 3
      // ) {
      //   return (this.gameObject.walkAnimationEnd = true);
      // }

      // If its monster death animation,
      // show it once
      if (
        this.gameObject.type === "Monster" &&
        this.currentAnimation === "death" &&
        this.currentAnimationFrame === 5
      )
        return (this.gameObject.deathAnimationEnd = true);
    } else {
      // TODO: like above, no timeout just max 2 frame

      const [slashY, slashX] = this.slashFrame;

      if (
        this.isSlashLoaded
        // && !this.isSlashUsed
      ) {
        ctx.drawImage(
          this.isSlash,
          slashX.frame * 32,
          slashY.frame * 32,
          32,
          32,
          x + slashX.offset,
          y + slashY.offset,
          32,
          32
        );

        //   this.slashTime++;
        //  console.log(this.slashTime % 10 === 0)
        //   if (this.slashTime % 20 === 0) this.isSlashUsed = true;
      }

      const [frameX, frameY] = this.frame;

      this.isLoaded &&
        ctx.drawImage(
          this.image,
          frameX.frame * 32,
          frameY.frame * 32,
          32,
          32,
          x + frameX.offset,
          y + frameY.offset,
          32,
          32
        );

      // Draw damage dealt above person etc
      // TODO: change to drawImage with numbers pixels
      if (this.gameObject.attack.hittedTargets.length > 0) {
        this.gameObject.attack.hittedTargets.forEach((target) => {
          ctx.font = "6px Arial Black";
          ctx.fillStyle = "red";
          ctx.fillText(
            `-${target.damageDealt}`,
            target.x + utils.withGrid(10.5) - cameraPerson.x,
            target.y + utils.withGrid(6) - cameraPerson.y - 11
          );
        });
      }

      // if (
      //   this.currentAnimationFrame === 1
      // )
      //   return this.gameObject.attack.clearAttack();
    }

    this.updateAnimationProgress();
  }
}
