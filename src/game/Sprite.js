import { playerState } from "./PlayerState.js";
import { utils } from "./utils/utils.js";

export class Sprite {
  constructor(config) {
    this.isAttackAnimation = config.isAttackAnimation || false;
    // console.log("config.repeatableImageAtPositions", config.repeatableImageAtPositions)
    this.repeatableImageAtPositions = config.repeatableImageAtPositions || {
      norepeat: [{ x: 0, y: 0 }],
    };
    this.spritePosition = {
      x: 0,
      y: 0,
    };
    this.spriteSpeed = 3;
    this.isSpriteDone = false;

    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow;
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
      // "attack-leftUp": [
      //   [0, 7],
      //   [1, 7],
      // ],
      // "attack-leftDown": [
      //   [0, 7],
      //   [1, 7],
      // ],
      // "attack-right": [
      //   [0, 5],
      //   [1, 5],
      // ],
      // "attack-rightUp": [
      //   [0, 5],
      //   [1, 5],
      // ],
      // "attack-rightDown": [
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
        // [4, 4],
        // [5, 4],
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
    // console.log(this.animations)
    // console.log(this.animations[this.currentAnimation])
    // console.log(this.animations[this.currentAnimation][this.currentAnimationFrame])
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

    // If not attack animation
    if (!this.isAttackAnimation) {
      // If someone take damage, show it
      if (
        (this.gameObject.type === "Monster" || this.gameObject.type === "Person") &&
        this.gameObject.isHittedBySomething.length > 0
      ) {
        this.gameObject.isHittedBySomething.forEach((obj) => {
          ctx.font = "6px Arial Black";
          ctx.fillStyle = "red";
          ctx.fillText(
            `-${obj.damageDealt}`,
            obj.x + utils.withGrid(10.5) - cameraPerson.x,
            obj.y + utils.withGrid(6) - cameraPerson.y - 11
          );
        });
      }

      // If someone healed, show it
      if (
        (this.gameObject.type === "Monster" || this.gameObject.type === "Person") &&
        this.gameObject.isHealedBySomething.length > 0
      ) {
        this.gameObject.isHealedBySomething.forEach((obj) => {
          ctx.font = "6px Arial Black";
          ctx.fillStyle = "green";
          ctx.fillText(
            `+${obj.healAmount}`,
            obj.x + utils.withGrid(10.5) - cameraPerson.x,
            obj.y + utils.withGrid(6) - cameraPerson.y - 11
          );
        });
      }

      // If is mouse over above monster
      // show it
      if (this.gameObject.isMouseover) {
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.rect(x + 8, y + 17, 16, 16);
        ctx.stroke();
      }

      // If monster is selected target
      // show it
      if (this.gameObject.isAim) {
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(x + 8, y + 17, 16, 16);
        ctx.stroke();
      }

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

      // Shadow animation
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

      // Behavior animation
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

      // If its monster death animation,
      // show it once
      if (
        this.gameObject.type === "Monster" &&
        this.currentAnimation === "death" &&
        this.currentAnimationFrame ===
          this.animations[this.currentAnimation].length - 1
      )
        return (this.gameObject.deathAnimationEnd = true);
    }
    // If attack animation
    else if (this.isAttackAnimation) {
      // Slash animation
      const [slashY, slashX] = this.slashFrame;
      if (this.isSlashLoaded) {
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
      }

      // Areas spells with no target needed
      if (
        this.isLoaded &&
        !this.gameObject.attack.selectedAttack.needMarkedTarget
      ) {
        // If not repeatable spell just do once loop
        let isDir = Object.keys(this.repeatableImageAtPositions).includes(
          "norepeat"
        )
          ? "norepeat"
          : this.gameObject.direction;

        if (isDir == "leftUp" || isDir == "leftDown") isDir = "left";
        if (isDir == "rightUp" || isDir == "rightDown") isDir = "right";

        // If spell is reapatable repeat as much is needed
        const [frameX, frameY] = this.frame;
        this.repeatableImageAtPositions[isDir].forEach((position) => {
          const { x: shiftX, y: shiftY } = position;
          ctx.drawImage(
            this.image,
            frameX.frame * 32,
            frameY.frame * 32,
            32,
            32,
            x + frameX.offset + shiftX,
            y + frameY.offset + shiftY,
            32,
            32
          );
        });
      }
      // console.log(this.gameObject.attack)
      
      // If spell need market target, 
      if (
        this.isLoaded &&
        this.gameObject.attack.selectedAttack.needMarkedTarget &&
        this.gameObject.name !== playerState.name
        ){

        }


      // If spell need marked target, and have target
      if (
        this.isLoaded &&
        this.gameObject.attack.selectedAttack.needMarkedTarget &&
        this.gameObject.attack.isMarkedTarget
      ) {
        // Moving sprite angle direction
        const { x: xSpeed, y: ySpeed } = this.gameObject.attack.attackAngle;

        // Moving sprite speed
        this.spritePosition.x += xSpeed * this.spriteSpeed;
        this.spritePosition.y += ySpeed * this.spriteSpeed;

        // Moving sprite position
        const movingSprite = {
          x: x + this.gameObject.center.offsetX + this.spritePosition.x,
          y: y + this.gameObject.center.offsetY + this.spritePosition.y,
        };

        // Target positon
        const targetPosition = {
          x:
            this.gameObject.attack.targetObject.x +
            utils.withGrid(10.5) -
            cameraPerson.x +
            8,
          y:
            this.gameObject.attack.targetObject.y +
            utils.withGrid(6) -
            cameraPerson.y +
            6,
        };

        // Distance moving sprite to target
        const distance = utils.getDistanceToObject(
          movingSprite,
          targetPosition
        );

        // Draw attack sprite on target
        const [frameX, frameY] = this.frame;
        ctx.drawImage(
          this.image,
          frameX.frame * 32,
          frameY.frame * 32,
          32,
          32,
          this.gameObject.attack.targetObject.x +
            utils.withGrid(10.5) -
            cameraPerson.x -
            6,
          this.gameObject.attack.targetObject.y +
            utils.withGrid(6) -
            cameraPerson.y -
            8,
          32,
          32
        );

        // If distance lower than 10 (its at target),
        // stop moving attack sprite
        if (distance < 10) this.isSpriteDone = true;

        if (this.isSpriteDone) return;

        // Draw moving attack sprite
        ctx.drawImage(
          this.image,
          0,
          0,
          32,
          32,
          x + this.spritePosition.x + 2,
          y + this.spritePosition.y + 8,
          32,
          32
        );
      }

      // Draw damage dealt above person etc
      // TODO: change to drawImage with numbers pixels
      if (this.gameObject.attack.hittedTargetsPositions.length > 0) {
        this.gameObject.attack.hittedTargetsPositions.forEach((target) => {
          ctx.font = "6px Arial Black";
          ctx.fillStyle = "red";
          ctx.fillText(
            `-${target.damageDealt}`,
            target.x + utils.withGrid(10.5) - cameraPerson.x,
            target.y + utils.withGrid(6) - cameraPerson.y - 11
          );
        });
      }
    }

    this.updateAnimationProgress();
  }
}
