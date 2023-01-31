import { TextMessage } from "./TextMessage.js";
import { utils } from "./utils/utils.js";
import { playerState } from "./PlayerState.js";
import { OverworldMaps } from "./data/OverworldMaps.js";
export class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    // TODO: Need to change globaly here \/
    const who =
      this.map.gameObjects[
        this.event.who === "hero" ? playerState.name : this.event.who
      ];
    // const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    // Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      // TODO: Need to change globaly here who.id \/
      if (e.detail.who === who.name) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk(resolve) {
    // TODO: Need to change globaly here \/
    const who =
      this.map.gameObjects[
        this.event.who === "hero" ? playerState.name : this.event.who
      ];
    // const who = this.map.gameObjects[this.event.who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    );

    // Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      // TODO: Need to change globaly here who.id \/
      if (e.detail.who === who.name) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(
        this.map.gameObjects[playerState.name].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector(".game-page"));
  }

  addStoryFlag(resolve) {
    playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  changeMap(resolve) {
    let object;
    Object.values(this.map.gameObjects).forEach((obj) => {
      // Deactive old objects
      if (obj.type !== "Monster") {
        obj.isMounted = false;
      }
      
      // Update player to new map
      if (obj.name === playerState.name) {
        console.log("change map ", obj.name);

        // Game object player state update
        object = {
          name: playerState.name,
          type: "Person",
          currentMap: this.event.map,
          isPlayerControlled: true,
          outfit: playerState.outfit,
        };

        // Player state map update
        playerState.currentMap = this.event.map;

        // Add position at window playersPosition
        OverworldMaps[playerState.currentMap].playersPosition[playerState.name] = {
          direction: this.event.direction,
          x : this.event.x,
          y : this.event.y
         };

        // Firebase db update
        const player = {
          currentMap: this.event.map,
          x: utils.withGridReverse(this.event.x),
          y: utils.withGridReverse(this.event.y),
          direction: this.event.direction,
        };
        playerState.updatePlayer({ player });
        
      }
    });
    this.map.overworld.startMap(object, {
      x: this.event.x,
      y: this.event.y,
      direction: this.event.direction,
    });
    resolve();
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
