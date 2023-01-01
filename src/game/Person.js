import { GameObject } from "./GameObject.js";
import { utils } from "./utils/utils.js";
import { playerState } from "./PlayerState.js";

export class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressReaming = 0;
    this.isStanding = false;
    this.intentPos = null; // [x,y]

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state) {
    if (this.movingProgressReaming > 0) {
      this.updatePosition(state);
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
      // Stop here if space is not free
      // console.log("behavior state", state);
      // console.log("behavior behavior", behavior);
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 1000);
        return;
      }

      // Ready to walk

      this.movingProgressReaming = 16;

      // Add next position intent
      const intentPos = utils.nextPosition(this.x, this.y, this.direction);
      this.intentPos = [intentPos.x, intentPos.y];

      this.updateSprite();
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id,
        });
        this.isStanding = false;
      }, behavior.time);
    }
  }

  updatePosition(state) {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressReaming -= 1;

    if (this.movingProgressReaming === 0) {
      // We finished the walk
      // console.log(this.id)
      // console.log(state);

      // Update position at firebase
      if (this.id === state.map.overworld.hero) {
        // console.log(this.intentPos);
        // console.log(this.direction);
        // console.log(playerState.playerRef)
        const player = {
          x: utils.withGridReverse(this.intentPos[0]),
          y: utils.withGridReverse(this.intentPos[1]),
          direction: this.direction
        };
        playerState.updatePlayer({ player });
        // Update position at configObjects
        window.OverworldMaps[playerState.currentMap].configObjects[playerState.name].x = this.intentPos[0];
        window.OverworldMaps[playerState.currentMap].configObjects[playerState.name].y = this.intentPos[1];
        console.log(this)
        console.log(window.OverworldMaps)

      }
      // console.log(property, change)
      this.intentPos = null;
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id,
      });
    }
  }

  updateSprite() {
    if (this.movingProgressReaming > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}
