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
    this.mapName = config.mapName;

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

  mountObjectsFromConfig(objects = this.configObjects) {
    Object.keys(objects).forEach((key) => {
      let object = this.configObjects[key];
      object.name = key;

      let instace;

      if (object.type === "Person") {
        instace = new Person(object);
      }
      if (object.type === "NPC") {
        instace = new Person(object);
      }
      // object.type === monster np

      this.gameObjects[key] = instace;
      this.gameObjects[key].name = key;
      instace.mount(this);
    });
  }

  mountGameObject(object, resolve = null) {
    // console.log("moungameobj ", object);
    console.log("mountGameObject", object.name);
    let instace;

    if (object.type === "Person") {
      instace = new Person(object);
    }
    if (object.type === "NPC") {
      instace = new Person(object);
    }

    this.gameObjects[object.name] = instace;
    instace.mount(this);

    if (resolve !== null) resolve();
  }

  unmountGameObject(name) {
    delete this.gameObjects[name];
    delete window.OverworldMaps[playerState.currentMap].playersPosition[name];
    // console.log("delete", name);
    console.log("unmountGameObject", name);
  }

  // objectListener() {
  //   onValue(playersRef, (snapshot) => {
  //     console.log("listen ", this.overworld.listen)
  //     const players = snapshot.val();
  //     Object.values(players).forEach((player) => {
  //       // If player its me skip
  //       if (player.name === playerState.name) return;
  //       // console.log("db up", this);
  //       let playerObj;
  //       if (this.mapName === playerState.currentMap){
  //         console.log("UPPER PLAYER")
  //         playerObj = this.gameObjects[player.name];
  //       }else {
  //         console.log("DOWN PLAYER")
  //         playerObj = this.overworld.map.gameObjects[player.name];
  //       }
  //       console.log("db up window ", window.OverworldMaps[player.currentMap].playersPosition[
  //         player.name
  //       ])
  //       console.log("db up", playerObj, this);

  //       // If player is online at your map and exist in game objects
  //       // do something
  //       if (
  //         player.online &&
  //         player.currentMap === playerState.currentMap &&
  //         playerObj
  //       ) {
  //         console.log(
  //           "If player is online at your map and exist in game objects, do something"
  //         );
  //         // If player change position, update his game object
  //         const currentPlayerState =
  //           window.OverworldMaps[player.currentMap].playersPosition[
  //             player.name
  //           ];
  //         console.log("currentPlayerState", currentPlayerState);

  //         // Update position at playersPosition
  //         window.OverworldMaps[player.currentMap].playersPosition[player.name] =
  //           {
  //             direction: player.direction,
  //             x: utils.withGrid(player.x),
  //             y: utils.withGrid(player.y),
  //           };

  //         const newPlayerState =
  //           window.OverworldMaps[player.currentMap].playersPosition[
  //             player.name
  //           ];
  //         console.log("newPlayerState", newPlayerState);

  //         if (
  //           currentPlayerState.x !== newPlayerState.x ||
  //           currentPlayerState.y !== newPlayerState.y
  //         ) {
  //             console.log("diffrent x,y - go!!");
  //             // if (player.direction !== playerObj.direction) playerObj.direction = player.direction;
  //             playerObj.direction = newPlayerState.direction;
  //             console.log("dir changed!");
  //             // if (playerObj.x !== currentPlayerState.x)
  //             //   playerObj.x = currentPlayerState.x;
  //             // if (playerObj.y !== currentPlayerState.y)
  //             //   playerObj.y = currentPlayerState.y;
  //             console.log("diffrent gameobj with currentplstat checked!");

  //             // console.log("before this.gameObjects", this.gameObjects);
  //             // playerObj.x = newPlayerState.x;
  //             // playerObj.y = newPlayerState.y;
  //             playerObj.movingProgressReaming = 16;
  //             // playerObj.sprite.animationFrameLimit = 3;
  //             // playerObj.sprite.animations = {
  //             //   "idle-up": [[0, 2]],
  //             //   "idle-down": [[0, 0]],
  //             //   "idle-left": [[0, 3]],
  //             //   "idle-right": [[0, 1]],
  //             //   "walk-left": [
  //             //     [1, 3],
  //             //     [1, 3],
  //             //     [0, 3],
  //             //     [3, 3],
  //             //     [3, 3],
  //             //     [0, 3],
  //             //   ],
  //             //   "walk-down": [
  //             //     [1, 0],
  //             //     [1, 0],
  //             //     [0, 0],
  //             //     [3, 0],
  //             //     [3, 0],
  //             //     [0, 0],
  //             //   ],
  //             //   "walk-up": [
  //             //     [1, 2],
  //             //     [1, 2],
  //             //     [0, 2],
  //             //     [3, 2],
  //             //     [3, 2],
  //             //     [0, 2],
  //             //   ],
  //             //   "walk-right": [
  //             //     [1, 1],
  //             //     [1, 1],
  //             //     [0, 1],
  //             //     [3, 1],
  //             //     [3, 1],
  //             //     [0, 1],
  //             //   ],
  //             // };
  //             console.log("moving 16 added");
  //             // for (let i = 0; i < 16; i++) {
  //             // console.log("for looop!")
  //             // const [property, change] =
  //             //   playerObj.directionUpdate[playerObj.direction];
  //             // playerObj[property] += change;
  //             // playerObj.movingProgressReaming -= 1;

  //             // if (playerObj.movingProgressReaming > 0) {
  //             // console.log("walk sprite !")
  //             // playerObj.updateSprite();
  //             playerObj.sprite.setAnimation("walk-" + playerObj.direction);
  //             // return;
  //             // }
  //             // }
  //             // playerObj.sprite.draw(this.overworld.ctx, playerObj);
  //             console.log(playerObj);   
  //         }

  //         // If player not moving but change direction, update his game obj
  //         if (
  //           playerObj.movingProgressReaming === 0 &&
  //           player.direction !== playerObj.direction
  //         ) {
  //           console.log(
  //             "If player not moving but change direction, update his game obj"
  //           );
  //           playerObj.direction = player.direction;
  //           playerObj.sprite.setAnimation("idle-" + playerObj.direction);
  //         }
  //       }

  //       // If player is online at your map and doesn't exist in game objects,
  //       // add him
  //       if (
  //         player.online &&
  //         player.currentMap === playerState.currentMap &&
  //         !playerObj
  //       ) {
  //         console.log(
  //           "If player is online at your map and doesn't exist in game objects, add him"
  //         );
          
  //         window.OverworldMaps[player.currentMap].playersPosition[player.name] =
  //           {
  //             direction: player.direction,
  //             x: utils.withGrid(player.x),
  //             y: utils.withGrid(player.y),
  //           };

  //         // console.log("add player", player.name);
  //         const object = {
  //           name: player.name,
  //           type: "Person",
  //           direction: player.direction,
  //           currentMap: player.currentMap,
  //           x: utils.withGrid(player.x),
  //           y: utils.withGrid(player.y),
  //           outfit: player.outfit,
  //         };

  //         if (this.mapName === playerState.currentMap){
  //           this.mountGameObject(object);
  //         }else {
  //           this.overworld.map.mountGameObject(object);
  //         }

  //       }

  //       // If player exist and changed map, delete him from game objects
  //       // and playersPosition
  //       if (
  //         player.online &&
  //         playerObj &&
  //         player.currentMap !== playerState.currentMap
  //       ) {
  //         console.log(
  //           "If player exist and changed map, delete him from game object, and playersPosition"
  //         );
  //         if (this.mapName === playerState.currentMap){
  //           this.unmountGameObject(player.name);
  //         }else {
  //           this.overworld.map.unmountGameObject(player.name);
  //         }
  //       }

  //       // If player exist and went offline, delete him from game objects
  //       // and playersPosition
  //       if (
  //         !player.online &&
  //         playerObj &&
  //         player.currentMap === playerState.currentMap
  //       ) {
  //         console.log(
  //           "If player exist and went offline, delete him from game objects, and playersPosition"
  //         );
  //         if (this.mapName === playerState.currentMap){
  //           this.unmountGameObject(player.name);
  //         }else {
  //           this.overworld.map.unmountGameObject(player.name);
  //         }
  //       }

  //       //   console.log(this)
  //       //   if (
  //       //     this.gameObjects[player.name] &&
  //       //     player.online &&
  //       //     player.currentMap !== playerState.currentMap &&
  //       //     player.name !== playerState.name
  //       //     ){
  //       //       console.log("hello wolrd", player.name, player.currentMap)
  //       //       // this.gameObjects[player.name] && this.unmountObject(player);
  //       //       delete this.gameObjects[player.name];
  //       //       delete window.OverworldMaps[playerState.currentMap].configObjects[player.name];
  //       //     }

  //       //   // If player is online and its not me, add him to his current map object
  //       //   // or update him
  //       //   if (
  //       //     player.online &&
  //       //     player.currentMap === playerState.currentMap &&
  //       //     player.name !== playerState.name
  //       //   ) {
  //       //     // If player exist do something
  //       //     if (
  //       //       window.OverworldMaps[player.currentMap].configObjects[player.name]
  //       //     ) {
  //       //       console.log("player exist ", player.name);
  //       //       // Take player old values
  //       //       const currentPlayerState =
  //       //         window.OverworldMaps[player.currentMap].configObjects[
  //       //           player.name
  //       //         ];
  //       //       // Overwrite old values with new values from db
  //       //       window.OverworldMaps[player.currentMap].configObjects[player.name] =
  //       //         {
  //       //           type: "Person",
  //       //           direction: player.direction,
  //       //           currentMap: player.currentMap,
  //       //           x: utils.withGrid(player.x),
  //       //           y: utils.withGrid(player.y),
  //       //           src: "src/game/assets/characters/hero2.png",
  //       //           // behaviorLoop: [
  //       //           //   {type: "walk", direction: "down"}
  //       //           // ]
  //       //         };
  //       //       // Take player new values
  //       //       const newPlayerState =
  //       //         window.OverworldMaps[player.currentMap].configObjects[
  //       //           player.name
  //       //         ];
  //       //       // console.log(
  //       //       //   "currentPlayerState ",
  //       //       //   currentPlayerState,
  //       //       //   // currentPlayerState.y
  //       //       // );
  //       //       // console.log("newPlayerState ",
  //       //       // newPlayerState,
  //       //       // // newPlayerState.y
  //       //       // );
  //       //       let that = null;
  //       //       if (!this.gameObjects[player.name]) {
  //       //         console.log(window.OverworldMaps[player.currentMap].configObjects)
  //       //         console.log('not game player')
  //       //         // this.mountObjectsFromConfig();
  //       //         that = this.overworld.map.gameObjects[player.name];

  //       //         // this.overworld.map.gameObjects[player.name].direction = newPlayerState.direction;
  //       //       } else {
  //       //         that = this.gameObjects[player.name];
  //       //         console.log("gameobject ", this.gameObjects)
  //       //       }
  //       //       console.log("that ", that)
  //       //       // if(!that) {
  //       //       //   console.log("tath false")
  //       //       //   const notMountedObj = this.checkForNotMountedObjects();
  //       //       //   this.mountObjectsFromConfig(notMountedObj);
  //       //       // }
  //       //       // console.log("that2 ", that)
  //       //       if (
  //       //         currentPlayerState.x !== newPlayerState.x ||
  //       //         currentPlayerState.y !== newPlayerState.y
  //       //         ) {
  //       //           // this.gameObjects[player.name].startBehavior({arrow: newPlayerState.direction, map:this},{type: "walk", direction: newPlayerState.direction})
  //       //           that.direction = newPlayerState.direction;

  //       //         if (that.x !== currentPlayerState.x) that.x = currentPlayerState.x;
  //       //         if (that.y !== currentPlayerState.y) that.y = currentPlayerState.y;

  //       //         that.movingProgressReaming = 16;
  //       //         for(let i=0; i<16 ; i++){
  //       //           const [property, change] = that.directionUpdate[that.direction];
  //       //           that[property] += change;
  //       //           that.movingProgressReaming -= 1;

  //       //           if (that.movingProgressReaming > 0) {
  //       //             that.sprite.setAnimation("walk-" + that.direction);
  //       //             return;
  //       //           }
  //       //           // that.sprite.setAnimation("idle-" + that.direction);
  //       //         }
  //       //       }
  //       //       // if (
  //       //       //   // currentPlayerState.x === newPlayerState.x ||
  //       //       //   // currentPlayerState.y === newPlayerState.y ||
  //       //       //   // that &&
  //       //       //   that.movingProgressReaming === 0 &&
  //       //       //   currentPlayerState.direction !== newPlayerState.direction
  //       //       //   ) {
  //       //       //     that.direction = newPlayerState.direction;
  //       //       //     that.sprite.setAnimation("idle-" + that.direction);
  //       //       // }
  //       //     }
  //       //     // If player doesn't exist add him
  //       //     else {
  //       //       console.log("player not exist - player added ", player.name);
  //       //       window.OverworldMaps[player.currentMap].configObjects[player.name] =
  //       //         {
  //       //           type: "Person",
  //       //           direction: player.direction,
  //       //           currentMap: player.currentMap,
  //       //           x: utils.withGrid(player.x),
  //       //           y: utils.withGrid(player.y),
  //       //           src: "src/game/assets/characters/hero2.png",
  //       //           // behaviorLoop: [
  //       //           //   {type: "walk", direction: "down"}
  //       //           // ]
  //       //         };
  //       //     }
  //       //   }
  //       //   // If player goes offline and its not me, delete him from map and game objects
  //       //   else if (
  //       //     !player.online &&
  //       //     player.currentMap === playerState.currentMap &&
  //       //     player.name !== playerState.name &&
  //       //     window.OverworldMaps[player.currentMap].configObjects[player.name]
  //       //   ) {
  //       //     this.unmountObject(player);
  //       //   }
  //     });

  //     // console.log("this before check unmount", this)
  //     // // Check for unmounted players if appear add to game objects
  //     // if (
  //     //   Object.keys(this.gameObjects).length !==
  //     //   Object.keys(this.configObjects).length
  //     // ) {
  //     //   console.log("enter check unmount")
  //     //   const notMountedObj = this.checkForNotMountedObjects();
  //     //   this.mountObjectsFromConfig(notMountedObj);
  //     // }
  //   });
  // }

  checkForNotMountedObjects() {
    const objects = {};
    Object.keys(this.configObjects).forEach((key) => {
      const objIsHere = Object.keys(this.gameObjects).includes(key);
      if (!objIsHere) {
        objects[key] = { toMounted: true };
      }
    });
    return objects;
  }

  // unmountObject(player, map = player.currentMap) {
  //   delete this.gameObjects[player.name];
  //   delete window.OverworldMaps[map].configObjects[player.name];
  //   console.log("delete", player.name);
  // }

  // addPlayerObject(player, { isPlayerControlled = false }) {
  //   window.OverworldMaps[player.currentMap].configObjects[player.name] = {
  //     type: "Person",
  //     isPlayerControlled,
  //     currentMap: player.currentMap,
  //     direction: player.direction,
  //     x: player.x,
  //     // x: utils.withGrid(player.x),
  //     y: player.y,
  //     // y: utils.withGrid(player.y),
  //     src: "src/game/assets/characters/hero2.png",
  //     // behaviorLoop: [
  //     //   {type: "walk", direction: "down"}
  //     // ]
  //   };
  // }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (let i = 0; i < events.length; i++) {
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
    const hero = this.gameObjects[playerState.name];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((sf) => {
          return playerState.storyFlags[sf];
        });
      });

      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects[playerState.name];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
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
    mapName: "outsideMap",
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
        outfit: "src/game/assets/characters/hero3.png",
        behaviorLoop: [
          // { type: "walk", direction: "right" },
          // { type: "walk", direction: "right" },
          // { type: "stand", direction: "down", time: 2800 },
          // { type: "walk", direction: "down" },
          // { type: "walk", direction: "down" },
          // { type: "walk", direction: "down" },
          // { type: "walk", direction: "down" },
          // { type: "walk", direction: "down" },
          // { type: "walk", direction: "left" },
          // { type: "walk", direction: "left" },
          // { type: "walk", direction: "up" },
          // { type: "walk", direction: "up" },
          // { type: "walk", direction: "up" },
          // { type: "walk", direction: "up" },
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
      [utils.asGridCoords(6, 11)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "insideMap",
              x: utils.withGrid(6),
              y: utils.withGrid(6),
              direction: "up",
            },
          ],
        },
      ],
    },
    playersPosition: {},
  },
  insideMap: {
    mapName: "insideMap",
    lowerSrc: "src/game/assets/maps/testMap.png",
    upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
    configObjects: {
      // Teddy: {
      //     type: "Person",
      //     isPlayerControlled: true,
      //     x: utils.withGrid(9),
      //     y: utils.withGrid(4),
      //     src: "src/game/assets/characters/hero2.png",
      //   },
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
    },
    cutsceneSpaces: {
      [utils.asGridCoords(3, 5)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "outsideMap",
              x: utils.withGrid(6),
              y: utils.withGrid(12),
              direction: "up",
            },
          ],
        },
      ],
    },
    playersPosition: {},
  },
};
