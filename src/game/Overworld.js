import { getGamePage } from "../app.js";
import { DirectionInput } from "./DirectonInput.js";
import { GameObject } from "./GameObject.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { OverworldMap } from "./OverworldMap.js";
import { playerState } from "./PlayerState.js";
import { utils } from "./utils/utils.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { playersRef } from "../config/firebase.js";

export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.isObjectsListens = true;
  }

  startGameLoop() {
    // this.hero = playerState.name;
    // this.heroId = playerState.id;
    const step = () => {
      // Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // console.log("3-overworld")
      // Establish the camera person
      const cameraPerson = this.map.gameObjects[playerState.name];
      // Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

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

      // console.log(this.map.gameObjects["Merry"]?.movingProgressReaming)
      requestAnimationFrame(step);
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
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
    this.map.mountObjectsFromConfig();
    this.map.mountGameObject(object, ()=>{
      this.isObjectsListens = true;
    });
    console.log(this);

    if (mapInitialConfig) {
      // const player = {
      //   x: utils.withGridReverse(mapInitialConfig.x),
      //   y: utils.withGridReverse(mapInitialConfig.y),
      //   direction: mapInitialConfig.direction,
      // };
      // playerState.updatePlayer({ player });
      this.map.gameObjects[object.name].x = mapInitialConfig.x;
      this.map.gameObjects[object.name].y = mapInitialConfig.y;
      this.map.gameObjects[object.name].direction = mapInitialConfig.direction;
    }
  }

  init(object) {
    this.startMap(object);
    this.objectListener();

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
    onValue(playersRef, (snapshot) => {
      const players = snapshot.val();
      Object.values(players).forEach((player) => {
        console.log("LISTENING!!!", this.isObjectsListens)
        if (!this.isObjectsListens) return;
        // If player its me skip
        if (player.name === playerState.name) return;
        // console.log("db up", this);
        
        const playerObj = this.map.gameObjects[player.name];
        
        console.log("db up window ", window.OverworldMaps[player.currentMap].playersPosition[
          player.name
        ])
        console.log("db up", playerObj, this);

        // If player is online at your map and exist in game objects
        // do something
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          playerObj
        ) {
          console.log(
            "If player is online at your map and exist in game objects, do something"
          );
          // If player change position, update his game object
          const currentPlayerState =
            window.OverworldMaps[player.currentMap].playersPosition[
              player.name
            ];
          console.log("currentPlayerState", currentPlayerState);

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
          console.log("newPlayerState", newPlayerState);

          if (
            currentPlayerState.x !== newPlayerState.x ||
            currentPlayerState.y !== newPlayerState.y
          ) {
              console.log("diffrent x,y - go!!");
              // if (player.direction !== playerObj.direction) playerObj.direction = player.direction;
              playerObj.direction = newPlayerState.direction;
              console.log("dir changed!");
              // if (playerObj.x !== currentPlayerState.x)
              //   playerObj.x = currentPlayerState.x;
              // if (playerObj.y !== currentPlayerState.y)
              //   playerObj.y = currentPlayerState.y;
              console.log("diffrent gameobj with currentplstat checked!");

              // console.log("before this.gameObjects", this.gameObjects);
              // playerObj.x = newPlayerState.x;
              // playerObj.y = newPlayerState.y;
              playerObj.movingProgressReaming = 16;
              // playerObj.sprite.animationFrameLimit = 3;
              // playerObj.sprite.animations = {
              //   "idle-up": [[0, 2]],
              //   "idle-down": [[0, 0]],
              //   "idle-left": [[0, 3]],
              //   "idle-right": [[0, 1]],
              //   "walk-left": [
              //     [1, 3],
              //     [1, 3],
              //     [0, 3],
              //     [3, 3],
              //     [3, 3],
              //     [0, 3],
              //   ],
              //   "walk-down": [
              //     [1, 0],
              //     [1, 0],
              //     [0, 0],
              //     [3, 0],
              //     [3, 0],
              //     [0, 0],
              //   ],
              //   "walk-up": [
              //     [1, 2],
              //     [1, 2],
              //     [0, 2],
              //     [3, 2],
              //     [3, 2],
              //     [0, 2],
              //   ],
              //   "walk-right": [
              //     [1, 1],
              //     [1, 1],
              //     [0, 1],
              //     [3, 1],
              //     [3, 1],
              //     [0, 1],
              //   ],
              // };
              console.log("moving 16 added");
              // for (let i = 0; i < 16; i++) {
              // console.log("for looop!")
              // const [property, change] =
              //   playerObj.directionUpdate[playerObj.direction];
              // playerObj[property] += change;
              // playerObj.movingProgressReaming -= 1;

              // if (playerObj.movingProgressReaming > 0) {
              // console.log("walk sprite !")
              // playerObj.updateSprite();
              playerObj.sprite.setAnimation("walk-" + playerObj.direction);
              // return;
              // }
              // }
              // playerObj.sprite.draw(this.overworld.ctx, playerObj);
              console.log(playerObj);   
          }

          // If player not moving but change direction, update his game obj
          if (
            playerObj.movingProgressReaming === 0 &&
            player.direction !== playerObj.direction
          ) {
            console.log(
              "If player not moving but change direction, update his game obj"
            );
            playerObj.direction = player.direction;
            playerObj.sprite.setAnimation("idle-" + playerObj.direction);
          }
        }

        // If player is online at your map and doesn't exist in game objects,
        // add him
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          !playerObj &&
          this.isObjectsListens
        ) {
          console.log(
            "If player is online at your map and doesn't exist in game objects, add him"
          );
          
          window.OverworldMaps[player.currentMap].playersPosition[player.name] =
            {
              direction: player.direction,
              x: utils.withGrid(player.x),
              y: utils.withGrid(player.y),
            };
            
          // console.log("add player", player.name);
          const object = {
            name: player.name,
            type: "Person",
            direction: player.direction,
            currentMap: player.currentMap,
            x: utils.withGrid(player.x),
            y: utils.withGrid(player.y),
            outfit: player.outfit,
          };

            this.map.mountGameObject(object);
          

        }

        // If player exist and changed map, delete him from game objects
        // and playersPosition
        if (
          player.online &&
          playerObj &&
          player.currentMap !== playerState.currentMap
        ) {
          console.log(
            "If player exist and changed map, delete him from game object, and playersPosition"
          );
         
            this.map.unmountGameObject(player.name);
          
        }

        // If player exist and went offline, delete him from game objects
        // and playersPosition
        if (
          !player.online &&
          playerObj &&
          player.currentMap === playerState.currentMap
        ) {
          console.log(
            "If player exist and went offline, delete him from game objects, and playersPosition"
          );
         
            this.map.unmountGameObject(player.name);
          
        }
      });
    });
  }
}
