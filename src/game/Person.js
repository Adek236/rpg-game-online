import { GameObject } from "./GameObject.js";
import { utils } from "./utils/utils.js";
import { playerState } from "./PlayerState.js";
import { Attack } from "./Attack.js";
import { OverworldMaps } from "./data/OverworldMaps.js";
export class Person extends GameObject {
  constructor(config) {
    super(config);
    this.id = config.id || null;
    this.isStanding = false;
    this.intentPos = null; // [x,y]
    this.radius = config.radius || 12;
    this.attacks = [];
    this.attack = null;
    this.currentHp = config.currentHp || 50;
    this.maxHp = config.maxHp || 50;
    this.speed = config.speed || 1;
    this.movingProgressReaming = 0;
    this.movingProgressReamingMax = 16 / this.speed;
    // this.isSafeMode = false;s
    this.isHittedBySomething = [];
    this.isHealedBySomething = [];
    this.markedTarget = null;

    this.count3 = null;

    this.isPlayerControlled = config.isPlayerControlled || false;
    // this.walkAnimationEnd = true;

    this.directionUpdate = {
      up: ["y", -this.speed],
      down: ["y", this.speed],
      left: ["x", -this.speed],
      right: ["x", this.speed],
      leftUp: [
        ["x", "y"],
        [-this.speed, -this.speed],
      ],
      leftDown: [
        ["x", "y"],
        [-this.speed, this.speed],
      ],
      rightUp: [
        ["x", "y"],
        [this.speed, -this.speed],
      ],
      rightDown: [
        ["x", "y"],
        [this.speed, this.speed],
      ],
    };
  }

  update(state) {
    // Player auto attack
    if (this.type==="Person" && playerState.name === this.name){
      this.autoAttack(state);
    }

    // Walk features
    if (this.movingProgressReaming > 0) {
      this.updatePosition();
    } else {
      // More cases for starting to walk will here

      // Case: We're keyboard ready and have an arrow pressed
      if (
        !state.map.isCutscenePlaying &&
        this.isPlayerControlled &&
        state.arrow
      ) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  startBehavior(state, behavior) {
    if (!this.isMounted) {
      return;
    }

    // Set character direction to whatever behavior has
    this.direction = behavior.direction;

    if (behavior.type === "walk") {
      // Stop here if shift pressed
      if (this.name === playerState.name && playerState.isShiftPressed) {
        playerState.updatePlayer({
          player: {
            direction: this.direction,
          },
        });
        return;
      }

      // Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        // Check player direction and add to db
        if (this.name === playerState.name) {
          playerState.updatePlayer({
            player: {
              direction: this.direction,
            },
          });
        }

        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 1000);
        return;
      }

      // Ready to walk
      this.movingProgressReaming = this.movingProgressReamingMax;

      // Add next position intent
      const intentPos = utils.nextPosition(this.x, this.y, this.direction);
      this.intentPos = [intentPos.x, intentPos.y];

      // Update player position at firebase
      if (this.name === playerState.name) {
        playerState.updatePlayer({
          player: {
            x: utils.withGridReverse(this.intentPos[0]),
            y: utils.withGridReverse(this.intentPos[1]),
            direction: this.direction,
          },
        });

        // Update position at playersPosition
        OverworldMaps[playerState.currentMap].playersPosition[
          playerState.name
        ] = {
          direction: this.direction,
          x: this.intentPos[0],
          y: this.intentPos[1],
        };
      }

      if (this.type === "Monster") {
        this.dbUpdateMonster({
          monster: {
            x: utils.withGridReverse(this.intentPos[0]),
            y: utils.withGridReverse(this.intentPos[1]),
            direction: this.direction,
          },
        });

        // Update position at configObjects
        OverworldMaps[this.currentMap].configObjects[this.id].direction =
          this.direction;
        OverworldMaps[this.currentMap].configObjects[this.id].x =
          this.intentPos[0];
        OverworldMaps[this.currentMap].configObjects[this.id].y =
          this.intentPos[1];

        // OverworldMaps[this.currentMap].configObjects[this.id] = {
        //   direction: this.direction,
        //   x: this.intentPos[0],
        //   y: this.intentPos[1],
        // };
      }

      this.updateSprite();
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          who: this.name,
        });
        this.isStanding = false;
      }, behavior.time);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    if (
      this.direction === "leftUp" ||
      this.direction === "leftDown" ||
      this.direction === "rightDown" ||
      this.direction === "rightUp"
    ) {
      this[property[0]] += change[0];
      this[property[1]] += change[1];
    } else {
      this[property] += change;
    }
    this.movingProgressReaming -= 1;

    if (this.movingProgressReaming === 0) {
      // We finished the walk
      this.intentPos = null;
      utils.emitEvent("PersonWalkingComplete", {
        who: this.name,
      });
    }
  }

  updateSprite() {
    if (this.movingProgressReaming > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    if (this.type === "Monster" && this.currentHp <= 0) {
      this.sprite.setAnimation("death");
      return;
    }
    if (this.attacks.length === 0) {
      this.sprite.setAnimation("idle-" + this.direction);
    }
    if (this.attacks.length > 0) {
      this.sprite.setAnimation(
        this.attacks[0].personAnimateName + this.direction
      );
      this.attack.sprite.setAnimation(
        this.attacks[0].animateName + this.direction
      );
    }
  }

  initAttack(state, attackName, isAttackByOtherPlayer = false) {
    this.attack = new Attack({
      name: attackName,
      gameObject: this,
      isAttackByOtherPlayer: isAttackByOtherPlayer,
    });
    this.attack.init(state);
  }

  
  autoAttack(state) {
    if (!this.markedTarget) return;

    this.count3++;
    if (this.count3 % 100 === 0) {
      this.initAttack(state.map, "autoAttack");
      playerState.updatePlayer({
        player: {
          isAttack: "autoAttack",
        },
      });
    }
  }

}
