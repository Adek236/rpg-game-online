import { getGamePage } from "../app.js";
import { DirectionInput } from "./DirectonInput.js";
import { GameObject } from "./GameObject.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { OverworldMap } from "./OverworldMap.js";
import { playerState } from "./PlayerState.js";
import { utils } from "./utils/utils.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { playersRef, monstersRef, dbRef, db } from "../config/firebase.js";

export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    // this.isObjectsListens = true;
  }

  startGameLoop() {
    const step = () => {
      // Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Establish the camera person
      const cameraPerson = this.map.gameObjects[playerState.name];
      // Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });
      // console.log(this.directionInput.heldDirections)
      // Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(step);
    };
    step();
  }

  bindChangeDirectionInput() {
    document.addEventListener("keydown", (e)=>{
      if (e.code === "ShiftLeft") {
        playerState.isShiftPressed = true;
      }
    });
    document.addEventListener("keyup", (e)=>{
      if (e.code === "ShiftLeft") {
        playerState.isShiftPressed = false;
      }
    });
  }

  bindHotKeysInput() {
    new KeyPressListener("Digit1", () => {
      console.log("1")
    });
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      console.log("enter")
      // Is there a person here to talk to
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.who === playerState.name) {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(object, mapInitialConfig = null) {
    this.map = new OverworldMap(window.OverworldMaps[object.currentMap]);
    this.map.overworld = this;
    this.map.loadMonsters(object.currentMap, () => {
      this.map.mountObjectsFromConfig();
    });
    this.map.mountGameObject(
      object
      //   , () => {
      //   this.isObjectsListens = true;
      // }
    );

    if (mapInitialConfig) {
      this.map.gameObjects[object.name].x = mapInitialConfig.x;
      this.map.gameObjects[object.name].y = mapInitialConfig.y;
      this.map.gameObjects[object.name].direction = mapInitialConfig.direction;
    }
  }

  init(object) {
    // this.canvas.width = this.canvas.getBoundingClientRect().width;
    // this.canvas.height = this.canvas.getBoundingClientRect().height;
    // this.canvas.width = 936;
    // this.canvas.height = 435;   
    // window.devicePixelRatio=1;
    // const ratio = Math.ceil(window.devicePixelRatio);
    // this.canvas.width = 704 * ratio;
    // this.canvas.height = 396 * ratio;
    // this.canvas.style.width = `${704}px`;
    // this.canvas.style.height = `${396}px`;
    // this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    // this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    this.startMap(object);
    // this.objectListener();
    this.objectListener();
    // this.monstersObjectListener();

    this.bindChangeDirectionInput();
    this.bindHotKeysInput();
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
    // getGamePage();

    // this.map.startCutscene([
    //   { type: "textMessage", text: "hello"}

    //   // {who: "hero2", type: "walk", direction: "down"},
    //   // {who: "hero2", type: "walk", direction: "right"},
    //   // {who: "hero2", type: "walk", direction: "right"},
    //   // {who: "hero2", type: "stand", direction: "up", time: 2800},
    //   // {who: "hero", type: "walk", direction: "down"},
    // ]
    // )
  }



  objectListener() {
    onValue(dbRef, (snapshot) => {
      console.log(this)
      const players = snapshot.val().players;
      Object.values(players).forEach((player) => {
        // if (!this.isObjectsListens) return;
        // If player its me skip
        if (player.name === playerState.name) return;

        const playerObj = this.map.gameObjects[player.name];

        // console.log("db up", this);

        // If player is online at your map and exist in game objects
        // do something
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          playerObj
        ) {
          // console.log(
          //   "If player is online at your map and exist in game objects, do something"
          // );
          // If player change position, update his game object
          const currentPlayerState =
            window.OverworldMaps[player.currentMap].playersPosition[
              player.name
            ];

          // Update position at playersPosition
          window.OverworldMaps[player.currentMap].playersPosition[player.name] =
            {
              direction: player.direction,
              x: utils.withGrid(player.x),
              y: utils.withGrid(player.y),
            };

          const newPlayerState =
            window.OverworldMaps[player.currentMap].playersPosition[
              player.name
            ];

          if (
            currentPlayerState.x !== newPlayerState.x ||
            currentPlayerState.y !== newPlayerState.y
          ) {
            // TODO: need to improve animations
            playerObj.direction = newPlayerState.direction;
            if (playerObj.x !== currentPlayerState.x)
              playerObj.x = currentPlayerState.x;
            if (playerObj.y !== currentPlayerState.y)
              playerObj.y = currentPlayerState.y;
            // playerObj.startBehavior({arrow: newPlayerState.direction, map:this.map},{type: "walk", direction: newPlayerState.direction})

            playerObj.movingProgressReaming =
              playerObj.movingProgressReamingMax;
            // // playerObj.sprite.animationFrameLimit = 7.2;
            // // playerObj.updateSprite();
            // if (this.movingProgressReaming > 0) {
            // for (let i = 0; i < 16; i++) {
            // const [property, change] =
            // playerObj.directionUpdate[playerObj.direction];
            // playerObj[property] += change;
            // playerObj.movingProgressReaming -= 1;

            // }
            // } else {
            // playerObj.sprite.setAnimation("walk-" + playerObj.direction);

            playerObj.updateSprite();
            // }
          }

          // If player not moving but change direction, update his game obj
          if (
            playerObj.movingProgressReaming === 0 &&
            player.direction !== playerObj.direction
          ) {
            // console.log(
            //   "If player not moving but change direction, update his game obj"
            // );
            playerObj.direction = player.direction;
            // playerObj.sprite.setAnimation("idle-" + playerObj.direction);
          }
        }

        // If player is online at your map and doesn't exist in game objects,
        // add him
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          !playerObj
          // && this.isObjectsListens
        ) {
          // console.log(
          //   "If player is online at your map and doesn't exist in game objects, add him"
          // );

          window.OverworldMaps[player.currentMap].playersPosition[player.name] =
            {
              direction: player.direction,
              x: utils.withGrid(player.x),
              y: utils.withGrid(player.y),
            };

          const object = {
            name: player.name,
            type: "Person",
            direction: player.direction,
            currentMap: player.currentMap,
            x: utils.withGrid(player.x),
            y: utils.withGrid(player.y),
            outfit: player.outfit,
          };

          setTimeout(() => {
            this.map.mountGameObject(object);
          }, 200);
        }

        // If player exist and changed map, delete him from game objects
        // and playersPosition
        if (
          player.online &&
          playerObj &&
          player.currentMap !== playerState.currentMap
        ) {
          // console.log(
          //   "If player exist and changed map, delete him from game object, and playersPosition"
          // );

          this.map.unmountGameObject(player.name);
        }

        // If player exist and went offline, delete him from game objects
        // and playersPosition
        if (
          !player.online &&
          playerObj &&
          player.currentMap === playerState.currentMap
        ) {
          // console.log(
          //   "If player exist and went offline, delete him from game objects, and playersPosition"
          // );

          this.map.unmountGameObject(player.name);
        }
      });



      const monsters = snapshot.val().monsters[playerState.currentMap];
      if (!monsters) return;
      Object.values(monsters).forEach((monster) => {
        const monsterObj = this.map.gameObjects[monster.id];

        // If monster is alive at your map, exist in game objects
        // and you are not the current target
        // do something
        if (
          monster.isAlive &&
          monster.currentMap === playerState.currentMap &&
          monster.currentTarget !== playerState.name &&
          monsterObj
        ) {

          const currentMonsterState =
            window.OverworldMaps[monster.currentMap].configObjects[monster.id];

          // Update position at playersPosition
          window.OverworldMaps[monster.currentMap].configObjects[monster.id] = {
            direction: monster.direction,
            x: utils.withGrid(monster.x),
            y: utils.withGrid(monster.y),
          };

          const newMonsterState =
            window.OverworldMaps[monster.currentMap].configObjects[monster.id];

          if (
            currentMonsterState.x !== newMonsterState.x ||
            currentMonsterState.y !== newMonsterState.y
          ) {

            // Deactive monster movement scripts if someone else controll
            monsterObj.isPlayerControlledMonster = false;
            
            monsterObj.direction = newMonsterState.direction;
            if (monsterObj.x !== currentMonsterState.x)
              monsterObj.x = currentMonsterState.x;
            if (monsterObj.y !== currentMonsterState.y)
              monsterObj.y = currentMonsterState.y;

            monsterObj.movingProgressReaming =
              monsterObj.movingProgressReamingMax;

            monsterObj.updateSprite();
          }
        }

        // If monster is alive at your map, exist in game objects
        // and you are the current target
        if (
          monster.isAlive &&
          monster.currentMap === playerState.currentMap &&
          monster.currentTarget === playerState.name &&
          monsterObj
        ) {
          // Active monster movement control scrips by you 
          monsterObj.isPlayerControlledMonster = true;
        }
      });
    });
  }

  
}
