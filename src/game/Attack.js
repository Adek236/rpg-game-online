import { Sprite } from "./Sprite.js";
import { dataAttacks } from "./data/attack/attacks.js";
import { playerState } from "./PlayerState.js";
import { combatAreas, comparativeCombatAreas } from "./data/attack/areas.js";

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
    });
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
          if (target.x === x && target.y === y && target.type === "Monster") {
            // If target is found, deal damage to it
            return;
          }
        }
      });

    }
  }

  init(state) {
    // Add attack to attacks array
    this.gameObject.attacks.push(this.selectedAttack);
    this.doDamageToTargetInAttackArea(state);
    // TODO: \/ without this is error WHY?
    if (this.gameObject.type === "Monster") {
      this.gameObject.attack.sprite.currentAnimation =
        this.selectedAttack.animateName + this.gameObject.direction;
    }

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