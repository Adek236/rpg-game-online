// import { GameObject } from "./GameObject.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { playersRef } from "../config/firebase.js";
import { utils } from "./utils/utils.js";
import { Person } from "./Person.js";
import { convertedOutisdeMapWalls } from "./data/testMapOutsideCollision.js";
import { OverworldEvent } from "./OverworldEvent.js";
import { playerState } from "./PlayerState.js";

export class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // Live objects are in here
    this.configObjects = config.configObjects; // Configuration content

    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    // console.log(x, y);
    if (this.walls[`${x},${y}`]) {
      return true;
    }
    // Check for game objecs at this position
    return Object.values(this.gameObjects).find((obj) => {
      if (obj.x === x && obj.y === y) {
        return true;
      }
      if (obj.intentPos && obj.intentPos[0] === x && obj.intentPos[1] === y) {
        return true;
      }
      return false;
    });
  }

  mountObjects(objects = this.configObjects) {
    Object.keys(objects).forEach((key) => {
      let object = this.configObjects[key];
      // console.log("this", object);
      object.id = key;

      let instace;

      if (object.type === "Person") {
        instace = new Person(object);
      }
      if (object.type === "NPC") {
        instace = new Person(object);
      }
      // object.type === monster np

      this.gameObjects[key] = instace;
      this.gameObjects[key].id = key;
      instace.mount(this);
    });
  }

  objectListener() {
    onValue(playersRef, (snapshot) => {
      // console.log(snapshot.val());
      // console.log("playerstate", playerState);
      // console.log("gameObjectsgameObjects", this.gameObjects);
      const players = snapshot.val();
      console.log(playerState.name);
      // console.log(window.OverworldMaps.outsideMap.configObjects);
      Object.values(players).forEach((player) => {
        // If player is online and its not me, add him to his current map object
        // or update him
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          player.name !== playerState.name
        ) {
          // If player exist do something
          if (
            window.OverworldMaps[player.currentMap].configObjects[player.name]
          ) {
            const currentPlayerState =
              window.OverworldMaps[player.currentMap].configObjects[
                player.name
              ];
            window.OverworldMaps[player.currentMap].configObjects[player.name] =
              {
                type: "Person",
                direction: player.direction,
                x: utils.withGrid(player.x),
                y: utils.withGrid(player.y),
                src: "src/game/assets/characters/hero2.png",
                // behaviorLoop: [
                //   {type: "walk", direction: "down"}
                // ]
              };
            const newPlayerState =
              window.OverworldMaps[player.currentMap].configObjects[
                player.name
              ];
            console.log(
              "currentPlayerState ",
              currentPlayerState,
              // currentPlayerState.y
            );
            console.log("newPlayerState ", 
            newPlayerState, 
            // newPlayerState.y
            );
            if (
              currentPlayerState.x !== newPlayerState.x ||
              currentPlayerState.y !== newPlayerState.y 
              ) {
                // this.gameObjects[player.name].startBehavior({arrow: newPlayerState.direction, map:this},{type: "walk", direction: newPlayerState.direction})
                
                this.gameObjects[player.name].direction = newPlayerState.direction;
                
              console.log("DIRECTION ", this.gameObjects[player.name].direction)
              console.log("before ", this.gameObjects[player.name]);
              console.log(this)

              if (this.gameObjects[player.name].x !== currentPlayerState.x) this.gameObjects[player.name].x = currentPlayerState.x;
              if (this.gameObjects[player.name].y !== currentPlayerState.y) this.gameObjects[player.name].y = currentPlayerState.y;
              
              this.gameObjects[player.name].movingProgressReaming = 16;
              for(let i=0; i<16 ; i++){
                const [property, change] = this.gameObjects[player.name].directionUpdate[this.gameObjects[player.name].direction];
                this.gameObjects[player.name][property] += change;
                this.gameObjects[player.name].movingProgressReaming -= 1;
                               
                if (this.gameObjects[player.name].movingProgressReaming > 0) {
                  this.gameObjects[player.name].sprite.setAnimation("walk-" + this.gameObjects[player.name].direction);
                  return;
                }
                // this.gameObjects[player.name].sprite.setAnimation("idle-" + this.gameObjects[player.name].direction);
              }
            }
            if (
              // currentPlayerState.x === newPlayerState.x ||
              // currentPlayerState.y === newPlayerState.y ||
              this.gameObjects[player.name].movingProgressReaming === 0 &&
              currentPlayerState.direction !== newPlayerState.direction
              ) {
                this.gameObjects[player.name].direction = newPlayerState.direction;
                this.gameObjects[player.name].sprite.setAnimation("idle-" + this.gameObjects[player.name].direction);
            }
          } 
          // If player doesn't exist add him
          else {
            window.OverworldMaps[player.currentMap].configObjects[player.name] =
              {
                type: "Person",
                direction: player.direction,
                x: utils.withGrid(player.x),
                y: utils.withGrid(player.y),
                src: "src/game/assets/characters/hero2.png",
                // behaviorLoop: [
                //   {type: "walk", direction: "down"}
                // ]
              };
          }
          // console.log("overworld", this.overworld.map);
        }
        // If player goes offline and its not me, delete him from map and game objects
        else if (
          !player.online &&
          player.currentMap === playerState.currentMap &&
          player.name !== playerState.name &&
          window.OverworldMaps[player.currentMap].configObjects[player.name]
        ) {
          this.unmountObject(player);
        }
      });

      // Check for unmounted players if appear add to game objects
      if (
        Object.keys(this.gameObjects).length !==
        Object.keys(this.configObjects).length
      ) {
        const notMountedObj = this.checkForNotMountedObjects();
        this.mountObjects(notMountedObj);
      }
    });
  }

  checkForNotMountedObjects() {
    const objects = {};
    Object.keys(this.configObjects).forEach((key) => {
      const objIsHere = Object.keys(this.gameObjects).includes(key);
      if (!objIsHere) {
        objects[key] = { toMounted: true };
      }
    });
    // console.log("notmounterd ", objects);
    return objects;
  }

  unmountObject(player, map = player.currentMap) {
    delete window.OverworldMaps[map].configObjects[player.name];
    delete this.gameObjects[player.name];
    console.log("deletera", player, map);
    console.log("deletera window", window.OverworldMaps[map].configObjects)
    console.log("deletera gO", this.gameObjects)
  }

  addPlayerObject(player, {isPlayerControlled = false}){
    console.log("addplayer", player)
    window.OverworldMaps[player.currentMap].configObjects[player.name] =
              {
                type: "Person",
                isPlayerControlled,
                direction: player.direction,
                x: player.x,
                // x: utils.withGrid(player.x),
                y: player.y,
                // y: utils.withGrid(player.y),
                src: "src/game/assets/characters/hero2.png",
                // behaviorLoop: [
                //   {type: "walk", direction: "down"}
                // ]
              };
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (let i = 0; i < events.length; i++) {
      // console.log("events ", events[i])
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPC to do their idle behavior
    // Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this));
  }

  checkForActionCutscene() {
    // console.log(this.overworld)
    const hero = this.gameObjects[this.overworld.hero];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    // console.log({ match });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((sf) => {
          // console.log(window.playerState);
          return playerState.storyFlags[sf];
        });
      });

      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects[this.overworld.hero];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      // console.log({ match });
      this.startCutscene(match[0].events);
    }
  }

  // addWall(x, y) {
  //   this.walls[`${x},${y}`] = true;
  // }
  // removeWall(x, y) {
  //   delete this.walls[`${x},${y}`];
  // }
  // moveWall(wasX, wasY, direction) {
  //   this.removeWall(wasX, wasY);
  //   const { x, y } = utils.nextPosition(wasX, wasY, direction);
  //   this.addWall(x, y);
  // }
}

window.OverworldMaps = {
  outsideMap: {
    lowerSrc: "src/game/assets/maps/testMapOutside.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    configObjects: {
      // Teddy: {
      //   type: "Person",
      //   isPlayerControlled: true,
      //   x: utils.withGrid(9),
      //   y: utils.withGrid(4),
      //   src: "src/game/assets/characters/hero2.png",
      // },
      hero2: {
        type: "NPC",
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        offsetX: 9,
        shadowOffsetX: 1,
        behaviorLoop: [
          // { type: "stand", direction: "down", time: 800 },
          // { type: "stand", direction: "right", time: 1200 },
        ],
        talking: [
          {
            required: ["next_talk"],
            events: [
              {
                type: "textMessage",
                text: "Its next_talk ",
                faceHero: "hero2",
              },
              { who: "hero", type: "walk", direction: "down" },
            ],
          },
          {
            required: ["something_to_do"],
            events: [
              { type: "textMessage", text: "Its working" },
              { type: "addStoryFlag", flag: "next_talk" },
            ],
          },
          {
            events: [
              { type: "textMessage", text: "hella", faceHero: "hero2" },
              { type: "textMessage", text: "emalla" },
            ],
          },
        ],
      },
      hero3: {
        type: "NPC",
        x: utils.withGrid(12),
        y: utils.withGrid(7),
        offsetX: 8,
        src: "src/game/assets/characters/hero3.png",
        behaviorLoop: [
          // { type: "walk", direction: "right" },
          // { type: "walk", direction: "right" },
          // { type: "walk", direction: "right" },
          // { type: "stand", direction: "down", time: 2800 },
          // { type: "walk", direction: "down" },
          // { type: "walk", direction: "left" },
          // { type: "walk", direction: "left" },
          // { type: "walk", direction: "left" },
          // { type: "walk", direction: "up" },
        ],
      },
    },
    walls: convertedOutisdeMapWalls,
    cutsceneSpaces: {
      [utils.asGridCoords(7, 4)]: [
        {
          events: [
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "down" },
            { type: "textMessage", text: "You cant go there" },
          ],
        },
      ],
      [utils.asGridCoords(6, 4)]: [
        {
          events: [{ type: "changeMap", map: "insideMap" }],
        },
      ],
    },
  },
  insideMap: {
    lowerSrc: "src/game/assets/maps/testMap.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    configObjects: {
      hero2: {
        type: "NPC",
        x: utils.withGrid(8),
        y: utils.withGrid(4),
        offsetX: 9,
        shadowOffsetX: 1,
        behaviorLoop: [
          // { type: "stand", direction: "down", time: 800 },
          // { type: "stand", direction: "right", time: 1200 },
        ],
        talking: [
          {
            required: ["next_talk"],
            events: [
              {
                type: "textMessage",
                text: "Its next_talk ",
                faceHero: "hero2",
              },
              { who: "hero", type: "walk", direction: "down" },
            ],
          },
          {
            required: ["something_to_do"],
            events: [
              { type: "textMessage", text: "Its working" },
              { type: "addStoryFlag", flag: "next_talk" },
            ],
          },
          {
            events: [
              { type: "textMessage", text: "hella", faceHero: "hero2" },
              { type: "textMessage", text: "emalla" },
            ],
          },
        ],
      }
    },
  },
};
