// import { GameObject } from "./GameObject.js";
import {
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { dbRef } from "../config/firebase.js";
import { utils } from "./utils/utils.js";
import { Person } from "./Person.js";
import { convertedOutisdeMapWalls } from "./data/testMapOutsideCollision.js";
import { OverworldEvent } from "./OverworldEvent.js";
import { playerState } from "./PlayerState.js";
import { Monster } from "./Monster.js";
import { OverworldMaps } from "./data/OverworldMaps.js";
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
      
      let instace;
      
      if (object.type === "Person") {
        instace = new Person(object);
      }
      if (object.type === "NPC") {
        object.name = key;
        instace = new Person(object);
      }
      if (object.type === "Monster") {
        instace = new Monster(object);
      }
      // object.type === monster np

      this.gameObjects[key] = instace;
      // this.gameObjects[key].name = key;
      instace.mount(this);
    });
  }

  mountGameObject(object
    // ,resolve = null
    ) {
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

    // if (resolve !== null) resolve();
  }

  unmountGameObject(name) {
    delete this.gameObjects[name];
    delete OverworldMaps[playerState.currentMap].playersPosition[name];
    // console.log("delete", name);
    console.log("unmountGameObject", name);
  }

  // checkForNotMountedObjects() {
  //   const objects = {};
  //   Object.keys(this.configObjects).forEach((key) => {
  //     const objIsHere = Object.keys(this.gameObjects).includes(key);
  //     if (!objIsHere) {
  //       objects[key] = { toMounted: true };
  //     }
  //   });
  //   return objects;
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

  async loadMonsters(mapName, resolve) {
      await get(child(dbRef, `monsters/${mapName}`))
        .then((snapshot) => {
          if (!snapshot.exists()) return;
          snapshot.forEach((monster) => {
            const monsterData = monster.val();

            OverworldMaps[mapName].configObjects[monsterData.id] = {
              type: "Monster",
              currentMap: monsterData.currentMap,
              currentTarget: monsterData.currentTarget,
              direction: monsterData.direction,
              isAlive: monsterData.isAlive,
              name: monsterData.name,
              id: monsterData.id,
              outfit: monsterData.outfit,
              x: utils.withGrid(monsterData.x),
              y: utils.withGrid(monsterData.y),
              initialX: utils.withGrid(monsterData.initialX),
              initialY: utils.withGrid(monsterData.initialY),
            };
          });
          
        })
        .catch((error) => {
          console.log("loadMonsters error:", error);
        });
        resolve();
  }
}

// window.OverworldMaps = {
//   outsideMap: {
//     mapName: "outsideMap",
//     lowerSrc: "src/game/assets/maps/testMapOutside.png",
//     upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
//     configObjects: {
//       // skeleton: {
//       //   type: "Monster",
//       //   x: utils.withGrid(13),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       // skeleton2: {
//       //   type: "Monster",
//       //   x: utils.withGrid(15),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       // skeleton3: {
//       //   type: "Monster",
//       //   x: utils.withGrid(15),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       // skeleton4: {
//       //   type: "Monster",
//       //   x: utils.withGrid(15),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       // skeleton5: {
//       //   type: "Monster",
//       //   x: utils.withGrid(15),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       // skeleton6: {
//       //   type: "Monster",
//       //   x: utils.withGrid(15),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       // skeleton7: {
//       //   type: "Monster",
//       //   x: utils.withGrid(15),
//       //   y: utils.withGrid(16),
//       //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
//       //   hp: 100,
//       //   behaviorLoop: [
//       //     // { type: "stand", direction: "down", time: 800 }
//       //     // { type: "walk", direction: "right" },
//       //     // { type: "stand", direction: "down", time: 2800 },
//       //     // { type: "walk", direction: "left" },
//       //   ],
//       // },
//       hero2: {
//         type: "NPC",
//         x: utils.withGrid(8),
//         y: utils.withGrid(4),
//         offsetX: 9,
//         shadowOffsetX: 1,
//         behaviorLoop: [
//           // { type: "stand", direction: "down", time: 800 },
//           // { type: "stand", direction: "right", time: 1200 },
//         ],
//         talking: [
//           {
//             required: ["next_talk"],
//             events: [
//               {
//                 type: "textMessage",
//                 text: "Its next_talk ",
//                 faceHero: "hero2",
//               },
//               { who: "hero", type: "walk", direction: "down" },
//             ],
//           },
//           {
//             required: ["something_to_do"],
//             events: [
//               { type: "textMessage", text: "Its working" },
//               { type: "addStoryFlag", flag: "next_talk" },
//             ],
//           },
//           {
//             events: [
//               { type: "textMessage", text: "hella", faceHero: "hero2" },
//               { type: "textMessage", text: "emalla" },
//             ],
//           },
//         ],
//       },
//       hero3: {
//         type: "NPC",
//         x: utils.withGrid(12),
//         y: utils.withGrid(7),
//         offsetX: 8,
//         outfit: "src/game/assets/characters/hero3.png",
//         behaviorLoop: [
//           // { type: "walk", direction: "right" },
//           // { type: "walk", direction: "right" },
//           // { type: "stand", direction: "down", time: 2800 },
//           // { type: "walk", direction: "down" },
//           // { type: "walk", direction: "down" },
//           // { type: "walk", direction: "down" },
//           // { type: "walk", direction: "down" },
//           // { type: "walk", direction: "down" },
//           // { type: "walk", direction: "left" },
//           // { type: "walk", direction: "left" },
//           // { type: "walk", direction: "up" },
//           // { type: "walk", direction: "up" },
//           // { type: "walk", direction: "up" },
//           // { type: "walk", direction: "up" },
//           // { type: "walk", direction: "up" },
//         ],
//       },
//     },
//     walls: convertedOutisdeMapWalls,
//     cutsceneSpaces: {
//       [utils.asGridCoords(7, 4)]: [
//         {
//           events: [
//             { who: "hero", type: "walk", direction: "down" },
//             { who: "hero", type: "walk", direction: "down" },
//             { type: "textMessage", text: "You cant go there" },
//           ],
//         },
//       ],
//       [utils.asGridCoords(6, 11)]: [
//         {
//           events: [
//             {
//               type: "changeMap",
//               map: "insideMap",
//               x: utils.withGrid(6),
//               y: utils.withGrid(6),
//               direction: "up",
//             },
//           ],
//         },
//       ],
//     },
//     playersPosition: {},
//   },
//   insideMap: {
//     mapName: "insideMap",
//     lowerSrc: "src/game/assets/maps/testMap.png",
//     upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
//     configObjects: {
//       hero2: {
//         type: "NPC",
//         x: utils.withGrid(8),
//         y: utils.withGrid(4),
//         offsetX: 9,
//         shadowOffsetX: 1,
//         behaviorLoop: [
//           // { type: "stand", direction: "down", time: 800 },
//           // { type: "stand", direction: "right", time: 1200 },
//         ],
//         talking: [
//           {
//             required: ["next_talk"],
//             events: [
//               {
//                 type: "textMessage",
//                 text: "Its next_talk ",
//                 faceHero: "hero2",
//               },
//               { who: "hero", type: "walk", direction: "down" },
//             ],
//           },
//           {
//             required: ["something_to_do"],
//             events: [
//               { type: "textMessage", text: "Its working" },
//               { type: "addStoryFlag", flag: "next_talk" },
//             ],
//           },
//           {
//             events: [
//               { type: "textMessage", text: "hella", faceHero: "hero2" },
//               { type: "textMessage", text: "emalla" },
//             ],
//           },
//         ],
//       },
//     },
//     cutsceneSpaces: {
//       [utils.asGridCoords(3, 5)]: [
//         {
//           events: [
//             {
//               type: "changeMap",
//               map: "outsideMap",
//               x: utils.withGrid(6),
//               y: utils.withGrid(12),
//               direction: "up",
//             },
//           ],
//         },
//       ],
//     },
//     playersPosition: {},
//   },
// };
