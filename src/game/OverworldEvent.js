import { TextMessage } from "./TextMessage.js";
import { utils } from "./utils/utils.js";
import { playerState } from "./PlayerState.js";

export class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    // TODO: Need to change globaly here \/
    const who =
      this.map.gameObjects[
        this.event.who === "hero" ? this.map.overworld.hero : this.event.who
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
      if (e.detail.whoId === who.id) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk(resolve) {
    // TODO: Need to change globaly here \/
    console.log(this.map)
    const who =
    this.map.gameObjects[
      this.event.who === "hero" ? this.map.overworld.hero : this.event.who
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
      if (e.detail.whoId === who.id) {
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
        this.map.gameObjects[this.map.overworld.hero].direction
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
    // Deactive old objects
    Object.values(this.map.gameObjects).forEach((obj) => {
      obj.isMounted = false;
    });

    this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
    resolve();
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
