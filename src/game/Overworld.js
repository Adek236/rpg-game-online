import { getGamePage } from "../app.js";
import { DirectionInput } from "./DirectonInput.js";
import { GameObject } from "./GameObject.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { OverworldMap } from "./OverworldMap.js";
import { playerState } from "./PlayerState.js";
import { utils } from "./utils/utils.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { playersRef, monstersRef, dbRef, db } from "../config/firebase.js";
import { OverworldMaps } from "./data/OverworldMaps.js";
import { dataAttacks } from "./data/attack/attacks.js";
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
          // if(object.attacks.length > 0){
          //   object.attack.sprite.draw(this.ctx, cameraPerson);
          // }
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw Game Objects Attacks
      Object.values(this.map.gameObjects).forEach((object) => {
        if (object.attacks.length > 0) {
          // console.log("erro obj", object)
          object.attack.sprite.draw(this.ctx, cameraPerson);
        }
      });

      // Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(step);
    };
    step();
  }

  bindChangeDirectionInput() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "ShiftLeft") {
        playerState.isShiftPressed = true;
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.code === "ShiftLeft") {
        playerState.isShiftPressed = false;
      }
    });
  }

  bindHotKeysInput() {
    new KeyPressListener("Digit1", () => {
      // console.log("x=",this.map.gameObjects[playerState.name].x,"y=",this.map.gameObjects[playerState.name].y);
      if (this.map.gameObjects[playerState.name].movingProgressReaming > 0)
        return;
      this.map.gameObjects[playerState.name].initAttack(this.map, "iceWave");
      // Set attack at db
      playerState.updatePlayer({
        player: {
          isAttack: "iceWave",
        },
      });
      // console.log(this)
    });

    new KeyPressListener("Digit2", () => {
      console.log(this);
    });
    new KeyPressListener("Space", () => {
      this.map.selectTarget();
    });
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      console.log("enter");
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
    this.map = new OverworldMap(OverworldMaps[object.currentMap]);
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
      const players = snapshot.val().players;
      Object.values(players).forEach((player) => {
        // if (!this.isObjectsListens) return;

        // If player its me skip
        if (player.name === playerState.name) return;

        const playerObj = this.map.gameObjects[player.name];

        // If player is online at your map and exist in game objects
        // do something
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          playerObj
        ) {
          // If player change position, update his game object
          const currentPlayerState =
            OverworldMaps[player.currentMap].playersPosition[player.name];

          // Update position at playersPosition
          OverworldMaps[player.currentMap].playersPosition[player.name] = {
            direction: player.direction,
            x: utils.withGrid(player.x),
            y: utils.withGrid(player.y),
          };

          const newPlayerState =
            OverworldMaps[player.currentMap].playersPosition[player.name];

          // If player current position is diffrent with new position,
          // move him
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

            playerObj.movingProgressReaming =
              playerObj.movingProgressReamingMax;

            // if (playerObj.walkAnimationEnd) {
              // playerObj.walkAnimationEnd = false;
              playerObj.updateSprite();
            // }
          }

          // If player not moving but change direction, update his game obj
          if (
            playerObj.movingProgressReaming === 0 &&
            player.direction !== playerObj.direction
          ) {
            playerObj.direction = player.direction;
          }

          // If player used skills/spells, show it
          if (playerObj.movingProgressReaming === 0 && player.isAttack) {
            if (playerObj.movingProgressReaming > 0) return;
            playerObj.initAttack(this.map, player.isAttack);
          }
        }

        // If player is online at your map and doesn't exist in game objects,
        // add him
        if (
          player.online &&
          player.currentMap === playerState.currentMap &&
          !playerObj
        ) {
          OverworldMaps[player.currentMap].playersPosition[player.name] = {
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
          this.map.unmountGameObject(player.name);
        }

        // If player exist and went offline, delete him from game objects
        // and playersPosition
        if (
          !player.online &&
          playerObj &&
          player.currentMap === playerState.currentMap
        ) {
          this.map.unmountGameObject(player.name);
        }
      });

      // MONSTERS
      const monsters = snapshot.val().monsters[playerState.currentMap];
      if (!monsters) return;
      Object.values(monsters).forEach((monster) => {
        const monsterObj = this.map.gameObjects[monster.id];

        // If monster is in game object but is not alive
        // if (monsterObj && !monster.isAlive) {
        //   // TODO: unmount
        //   monsterObj.deathAnimationEnd &&
        //   this.map.unmountGameObject(monster.id, monster.currentMap);
        //   return;
        // }

        // If monster is alive at your map, exist in game objects
        // and you are not the current target
        // do something
        if (
          monster.isAlive &&
          monster.currentMap === playerState.currentMap &&
          monster.currentTarget !== playerState.name &&
          monsterObj
        ) {
          console.log("monster listenere 2");
          // Deactive monster movement scripts if someone else control
          monsterObj.isPlayerControlledMonster = false;

          const currentMonsterState =
            OverworldMaps[monster.currentMap].configObjects[monster.id];

          // Update monster position at config objects
          OverworldMaps[monster.currentMap].configObjects[monster.id] = {
            currentMap: monster.currentMap,
            currentTarget: monster.currentTarget,
            direction: monster.direction,
            id: monster.id,
            initialX: utils.withGrid(monster.initialX),
            initialY: utils.withGrid(monster.initialY),
            isAlive: monster.isAlive,
            name: monster.name,
            outfit: monster.outfit,
            type: "Monster",
            x: utils.withGrid(monster.x),
            y: utils.withGrid(monster.y),
          };

          const newMonsterState =
            OverworldMaps[monster.currentMap].configObjects[monster.id];

          // console.log("currentMonsterState", currentMonsterState)
          // console.log("newMonsterState", newMonsterState)

          // If current position is diffrent with new position,
          // walk
          if (
            currentMonsterState.x !== newMonsterState.x ||
            currentMonsterState.y !== newMonsterState.y
          ) {
            monsterObj.direction = newMonsterState.direction;
            if (monsterObj.x !== currentMonsterState.x)
              monsterObj.x = currentMonsterState.x;
            if (monsterObj.y !== currentMonsterState.y)
              monsterObj.y = currentMonsterState.y;

            monsterObj.movingProgressReaming =
              monsterObj.movingProgressReamingMax;

            monsterObj.updateSprite();
          }

          // If monster current direction is diffrent with new direction,
          // change direction
          if (currentMonsterState.direction !== newMonsterState.direction) {
            monsterObj.direction = newMonsterState.direction;
            monsterObj.updateSprite();
          }

          // If monster used skills/spells, show it
          if (
            monsterObj &&
            monsterObj.movingProgressReaming === 0 &&
            monster.isAttack
          ) {
            monsterObj.initAttack({ map: this.map }, monster.isAttack);
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

        // If monster is alive at your map but not exist in game objects
        // respawn him
        if (
          monster.isAlive &&
          monster.currentMap === playerState.currentMap &&
          !monsterObj
        ) {
          console.log("alive!!");

          // Change isAlive at config objects
          // OverworldMaps[monster.currentMap].configObjects[monster.id].isAlive = true;
          OverworldMaps[monster.currentMap].configObjects[monster.id] = {
            currentMap: monster.currentMap,
            currentTarget: monster.currentTarget,
            direction: monster.direction,
            id: monster.id,
            initialX: utils.withGrid(monster.initialX),
            initialY: utils.withGrid(monster.initialY),
            isAlive: monster.isAlive,
            name: monster.name,
            outfit: monster.outfit,
            type: "Monster",
            x: utils.withGrid(monster.x),
            y: utils.withGrid(monster.y),
          };

          // Respawn monster
          this.map.mountObjectsFromConfig({ [monster.id]: monster.id });
        }
      });
    });
  }
}
