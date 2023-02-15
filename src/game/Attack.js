import { Sprite } from "./Sprite.js";
import { dataAttacks } from "./data/attack/dataAttacks.js";
import { playerState } from "./PlayerState.js";
import { combatAreas, comparativeCombatAreas } from "./data/attack/areas.js";
import { utils } from "./utils/utils.js";
export class Attack {
  constructor(config) {
    // Reference to selected attack
    this.selectedAttack = dataAttacks[config.name];
    // Reference to game object
    this.gameObject = config.gameObject;
    // Reference to target object
    this.targetObject = config.object || null;

    this.sprite = new Sprite({
      gameObject: this.gameObject,
      src: this.selectedAttack.src,
      useShadow: false,
      animations: this.selectedAttack.animations,
      useSlash: this.selectedAttack.useSlash,
      isAttackAnimation: true,
      repeatableImageAtPositions:
        this.selectedAttack.repeatableImageAtPositions || false,
    });

    this.hittedTargetsPositions = [];
    this.isAnimationEnd = false;
    this.isAttackByOtherPlayer = config.isAttackByOtherPlayer || false;

    this.attackAngle = {
      x: 0,
      y: 0,
    };
    this.isMarkedTarget = false;
  }

  doDamageToTargetInAttackArea(state, isAttackByOtherPlayer) {
    if (isAttackByOtherPlayer) return;

    // Attacker position
    const attacker = {
      x: this.gameObject.x,
      y: this.gameObject.y,
    };

    if (
      this.gameObject.direction == "leftUp" ||
      this.gameObject.direction == "leftDown"
    )
      this.gameObject.direction = "left";
    if (
      this.gameObject.direction == "rightUp" ||
      this.gameObject.direction == "rightDown"
    )
      this.gameObject.direction = "right";

    // Area of selected attack
    const scaningArea = combatAreas[this.selectedAttack.combatAreaName];
    // Area of position change
    const comparativeArea =
      comparativeCombatAreas[this.selectedAttack.combatAreaName];

    const checkForTargetAtThisPositions = [];

    // Compare both attack area,
    // return position to check if target is there
    comparativeArea.forEach((row, i) => {
      Array.from(row).forEach((pos, j) => {
        if (scaningArea[this.gameObject.direction][i][j] === 1) {
          checkForTargetAtThisPositions.push({
            x: attacker.x + pos.x,
            y: attacker.y + pos.y,
          });
        }
      });
    });

    // Check for possible targets
    checkForTargetAtThisPositions.forEach((position) => {
      const { x, y } = position;

      for (const possibleTarget in state.gameObjects) {
        const target = state.gameObjects[possibleTarget];
        
        // If target is dead, stop here
        if (target.deathAnimationEnd) return;

        const xArray = utils.collectionNumbersBetweenNumbers(
          x - 8,
          x + 8,
          target.speed
        );
        const yArray = utils.collectionNumbersBetweenNumbers(
          y - 8,
          y + 8,
          target.speed
        );

        if (
          xArray.includes(target.x) &&
          yArray.includes(target.y) &&
          ((target.type === "Monster" && this.gameObject.type === "Person") ||
            (target.type === "Person" && this.gameObject.type === "Monster"))
        ) {
          // Deduct hp by value of damage
          target.currentHp -= this.selectedAttack.baseDamage;

          // Deduct monster hp by value of damage at db
          if (target.type === "Monster" && target.currentHp >= 0) {
            target.dbUpdateMonster({
              monster: {
                currentHp: target.currentHp,
              },
            });
          }
          
          // Deduct player hp by value of damage at db
          if (target.type === "Person" && target.currentHp >= 0) {
            console.log("target", target.name)
            playerState.updatePlayer({
              player: {
                currentHp: target.currentHp,
              },
            },
            target.id
            );
          }
          
          // Send hittedTargetsPositions data to sprite
          this.hittedTargetsPositions.push({
            x: target.x,
            y: target.y,
            damageDealt: this.selectedAttack.baseDamage,
          });

          return;
        }
      }
    });
  }

  async doDamageToMarkedTargetInAttackArea(state, isAttackByOtherPlayer) {
    // TODO: monsters target finder

    // Attacker position
    const attacker = {
      x: this.gameObject.x,
      y: this.gameObject.y,
      name: this.gameObject.name,
    };

    let target = null;

    // Find marked target
    if(attacker.name === playerState.name){
      target = Object.values(state.gameObjects).find(
        (target) => target.isAim
      );
    }
    if(attacker.name !== playerState.name){
      const targetId = await playerState.getSpecificPlayerData("markedTarget", attacker.name)
      console.log(targetId)
      if (!targetId) return;
      target = Object.values(state.gameObjects).find(
        (target) => target.id === targetId
      );
    }

    if (target) {
      this.targetObject = target;
      const distanceToTarget = utils.getDistanceToObject(
        { x: target.x, y: target.y },
        { x: attacker.x, y: attacker.y }
      );
      // If target is too far away, stop here
      if (distanceToTarget > this.selectedAttack.distance)
        return console.log("target too far away");

      this.isMarkedTarget = true;

      // Return angle to target
      const angle = Math.atan2(target.y - attacker.y, target.x - attacker.x);
      this.attackAngle.x = Math.cos(angle);
      this.attackAngle.y = Math.sin(angle);

      // Send hittedTargetsPositions data to sprite
      this.hittedTargetsPositions.push({
        x: target.x,
        y: target.y,
        damageDealt: this.selectedAttack.baseDamage,
      });
      
      if (isAttackByOtherPlayer) return;

      // Deduct hp by value of damage
      target.currentHp -= this.selectedAttack.baseDamage;

      if (target.type === "Monster" && target.currentHp >= 0) {
        target.dbUpdateMonster({
          monster: {
            currentHp: target.currentHp,
          },
        });
      }

    } else {
      this.isMarkedTarget = false;
      console.log("no target");
    }
  }

  init(state) {
    // If monster change state to map
    if (this.gameObject.type === "Monster") state = state.map;

    // Add attack to attacks array
    this.gameObject.attacks.push(this.selectedAttack);

    // If another player attacks, it does not deal damage, only animation
    if (!this.selectedAttack.needMarkedTarget) {
      this.doDamageToTargetInAttackArea(state, this.isAttackByOtherPlayer);
    }

    if (this.selectedAttack.needMarkedTarget) {
      this.doDamageToMarkedTargetInAttackArea(
        state,
        this.isAttackByOtherPlayer
      );
    }

    // TODO: \/ without this is error if online animation WHY?
    // first load dont have animation thats why
    this.gameObject.attack.sprite.currentAnimation =
      this.selectedAttack.animateName + this.gameObject.direction;

    setTimeout(() => {
      // Remove attack from attacks array
      this.gameObject.attacks = this.gameObject.attacks.filter((el) => {
        return el !== this.selectedAttack;
      });

      // If its a player
      if (this.gameObject.name === playerState.name) {
        // Set attack to false at db
        playerState.updatePlayer({
          player: {
            isAttack: false,
          },
        });
      }

      // If its a monster
      if (this.gameObject.type === "Monster") {
        // Set attack to false at db
        this.gameObject.dbUpdateMonster({
          monster: {
            isAttack: false,
          },
        });
      }
    }, this.selectedAttack.time);
  }
}
