import { Sprite } from "./Sprite.js";
import { dataAttacks } from "./data/attack/attacks.js";
import { playerState } from "./PlayerState.js";
import { combatAreas, comparativeCombatAreas } from "./data/attack/areas.js";
import { utils } from "./utils/utils.js";
export class Attack {
  constructor(config) {
    // Reference to selected attack
    this.selectedAttack = dataAttacks[config.name];

    // Reference to game object
    this.gameObject = config.gameObject;

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
  }

  doDamageToTargetInAttackArea(state) {
    // console.log("scaning for targets...", this.selectedAttack.combatArea.up);

    // Attacker position
    const attacker = {
      x: this.gameObject.x,
      y: this.gameObject.y,
    };

    // If attack dont need marked target
    if (!this.selectedAttack.needMarkedTarget) {
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

      // if (this.gameObject.type === "Person"){

      //   console.log(checkForTargetAtThisPositions)
      // }

      // Check for possible targets
      checkForTargetAtThisPositions.forEach((position) => {
        const { x, y } = position;
        // console.log(state)
        for (const possibleTarget in state.gameObjects) {
          const target = state.gameObjects[possibleTarget];
          const xArray = utils.collectionNumbersBetweenNumbers(
            x - 15,
            x + 15,
            target.speed
          );
          const yArray = utils.collectionNumbersBetweenNumbers(
            y - 15,
            y + 15,
            target.speed
          );

          if (this.gameObject.type === "Person") {
            // console.log(xArray);
            // console.log(yArray);
            // console.log("target", target);
          }

          if (
            xArray.includes(target.x) &&
            yArray.includes(target.y) &&
            // target.x === x &&
            // target.y === y &&
            ((target.type === "Monster" && this.gameObject.type === "Person") ||
              (target.type === "Person" && this.gameObject.type === "Monster"))
          ) {
            // If target is found, deal damage to it
            // TODO: if target moving deals 2x damage BROKE 
            // if (this.gameObject.type === "Person") console.log("target TRUE", target);
            if (this.gameObject.type === "Person")
              console.log("target TRUE", this.hittedTargetsPositions);
            // if (target.type === "Monster") console.log("xArray", xArray);
            target.currentHp -= this.selectedAttack.baseDamage;

            // Send hittedTargetsPositions data to sprite
            this.hittedTargetsPositions.push({
              x: target.x,
              y: target.y,
              damageDealt: this.selectedAttack.baseDamage,
            });
            // console.log(this.gameObject.attacks)

            return;
          }
        }
      });
    }
  }

  init(state) {
    // If monster change state to map
    if (this.gameObject.type === "Monster") state = state.map;

    // Add attack to attacks array
    this.gameObject.attacks.push(this.selectedAttack);
    this.doDamageToTargetInAttackArea(state);

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
