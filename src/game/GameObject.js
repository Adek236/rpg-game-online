import { Sprite } from "./Sprite.js";
import { OverworldEvent } from "./OverworldEvent.js";

export class GameObject {
  constructor(config) {
    this.name = config.name;
    this.type = config.type;
    this.currentMap = config.currentMap || null;
    this.isMounted = false;
    this.isWalkable = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.center = {
      offsetX: 16,
      offsetY: 24,
    }
    this.offsetX = config.offsetX || 8;
    this.offsetY = config.offsetY || 18;
    this.shadowOffsetX = config.shadowOffsetX || 0;
    this.shadowOffsetY = config.shadowOffsetY || 0;
    this.direction = config.direction || "down";

    this.sprite = new Sprite({
      gameObject: this,
      src: config.outfit || "src/game/assets/characters/hero.png",
      useShadow: true,
      // animations: config.animations
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];

    this.retryTimeout = null;
  }

  mount(map) {
    this.isMounted = true;
    // map.addWall(this.x, this.y);

    // If wwe have a behavior, kick off after short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  update() {}

  async doBehaviorEvent(map) {
    // Dont do anything if there is a more important cutscene or i dont have config to do anything
    if (this.behaviorLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }

      this.retryTimeout = setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 1000);
      return;
    }
    
    // if (this.type && this.type === "monster") {
    //   this.behaviorLoop = this.newBehav;
    //   this.time();
    // }

    // Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.name;

    // Create an event instace out of our next config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }
    
    // Do it again
    this.doBehaviorEvent(map);
  }
}
