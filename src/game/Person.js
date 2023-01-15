import { GameObject } from "./GameObject.js";
import { utils } from "./utils/utils.js";
import { playerState } from "./PlayerState.js";

export class Person extends GameObject {
  constructor(config) {
    super(config);
    this.type = config.type;
    this.movingProgressReaming = 0;
    this.movingProgressReamingMax = 16;
    this.isStanding = false;
    this.intentPos = null; // [x,y]
    this.radius = config.radius || 12;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
      leftUp: [ ["x","y"], [-1,-1] ],
      leftDown: [ ["x","y"], [-1,1] ],
      rightUp: [ ["x","y"], [1,-1] ],
      rightDown: [ ["x","y"], [1,1] ],
    };
  }

  update(state) {
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
      // Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        // Check direction and add to db
        if (state && this.name === playerState.name) {
        const player = {
          direction: this.direction,
        };
        playerState.updatePlayer({ player });
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

      // Update position at firebase
      if (state && this.name === playerState.name) {
        const player = {
          x: utils.withGridReverse(this.intentPos[0]),
          y: utils.withGridReverse(this.intentPos[1]),
          direction: this.direction,
        };
        playerState.updatePlayer({ player });

         // Update position at playersPosition
         window.OverworldMaps[playerState.currentMap].playersPosition[playerState.name] = {
          direction: this.direction,
          x : this.intentPos[0],
          y : this.intentPos[1]
         };
        //  console.log("players position", window.OverworldMaps[playerState.currentMap].playersPosition)
        //  console.log("players position 2", this)
        //  window.OverworldMaps[playerState.currentMap].playersPosition[playerState.name].y = this.intentPos[1];
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
    if (this.direction === "leftUp" || this.direction === "leftDown" ||this.direction === "rightDown" ||this.direction === "rightUp"){
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

  updateSprite(obj = this) {
    if (obj.movingProgressReaming > 0) {
      obj.sprite.setAnimation("walk-" + obj.direction);
      return;
    }
    obj.sprite.setAnimation("idle-" + obj.direction);
  }
}
