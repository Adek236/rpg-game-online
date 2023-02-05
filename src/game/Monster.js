import { Person } from "./Person.js";
import { utils } from "./utils/utils.js";
import { db, dbRef } from "../config/firebase.js";
import {
  ref,
  update,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { Attack } from "./Attack.js";
// TODO: Monsters must have db connection to see all players (gameObjects)

export class Monster extends Person {
  constructor(config) {
    super(config);
    // this.type = config.type || "monster";
    this.speed = config.speed || 0.5;
    this.movingProgressReamingMax = 16/this.speed;
    
    this.directionUpdate = {
      up: ["y", -this.speed],
      down: ["y", this.speed],
      left: ["x", -this.speed],
      right: ["x", this.speed],
      leftUp: [
        ["x", "y"],
        [-this.speed, -this.speed],
      ],
      leftDown: [
        ["x", "y"],
        [-this.speed, this.speed],
      ],
      rightUp: [
        ["x", "y"],
        [this.speed, -this.speed],
      ],
      rightDown: [
        ["x", "y"],
        [this.speed, this.speed],
      ],
    };
    this.initialX = config.initialX;
    this.initialY = config.initialY;
    this.radius = 100;
    this.validTargets = [];
    this.focusedTarget = null;
    // this.isTargetReachable = true;
    this.lastPosition = null;
    this.id = config.id;
    this.isPlayerControlledMonster = true;
    this.lastMoveHistory = [];
    this.lastMoveHistoryMaxLength = 8;
    
    this.isAim = false;
    this.isHittedByOtherPlayer = [];

    this.count = 0;
    this.count2 = 0;
    this.deathAnimationEnd = false;
  }

  update(state) {
    super.update(state);

    // If monster died
    if (this.currentHp <= 0) {
      // Update monster db
      // if (this.isPlayerControlledMonster){

        this.dbUpdateMonster({
          monster: { 
            isAlive: false,
            currentTarget: false,
            currentHp: this.maxHp,
            x: utils.withGridReverse(this.initialX),
            y: utils.withGridReverse(this.initialY),
          },
        });
      // }
      
      // If death animation end unmount monster
      this.deathAnimationEnd &&
      state.map.unmountGameObject(this.id, this.currentMap);

      // const loot1 = {
      //   type: "Loot",
      //   x: utils.withGrid(13),
      //   y: utils.withGrid(16),
      //   rank: 1,
      //   name: "Common"
      // }

      // state.map.mountGameObject(loot1)

      // Stop here
      return;
    }

    // If monster is too far away from initial position,
    // teleport him back to start
    const distanceFromInitialPosition = this.getDistanceToTarget(
      { x: this.initialX, y: this.initialY },
      { x: this.x, y: this.y }
    );
    if (distanceFromInitialPosition > this.radius * 2) {
      this.teleportToInitialPosition();
      return;
    }

    this.findTarget(state);
  }

  findTarget(state) {
    // TODO: need to add change target functionality

    // Mark targets that will enter your radius
    // Sort is needed?
    this.validTargets = Object.values(state.map.gameObjects).sort((a,b)=>{
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }).filter(
      (target) => {
        const targetObj = {
          x: target.x,
          y: target.y,
        };
        const monsterObj = {
          x: this.x,
          y: this.y,
        };
        const distance = this.getDistanceToTarget(monsterObj, targetObj);
        return (
          target.type === "Person" &&
          // !target.isSafeMode &&
          distance < target.radius + this.radius
        );
      }
    );

    // console.log(this.validTargets)

    // If no valid targets, and monster isn't in initial position
    // just return monster to initial position
    if (
      this.validTargets.length < 1 &&
      (this.x !== this.initialX || this.y !== this.initialY)
    )
      return this.returnToInitialPosition(state);

    // If no valid targets, and monster is in initial position
    // clear valid target
    if (
      this.validTargets.length < 1 &&
      (this.x === this.initialX || this.y === this.initialY) &&
      this.focusedTarget
    )
      return (this.focusedTarget = null);

    // If no valid targets stop here
    if (this.validTargets.length < 1) return;

    // Check current target at db, if it doesn't have,
    // add new target
    // TODO: NEED RE-WORK
    this.loadMonsterCurrentData(
      { currentMap: this.currentMap, id: this.id, findData: "currentTarget" },
      (currentTarget) => {
        // No target
        if (!currentTarget) {
          // Add new
          this.focusedTarget = this.validTargets[0];
          this.dbUpdateMonster({
            monster: { currentTarget: this.validTargets[0].name },
          });
        }
        // Target is in db
        else {
          // Check current valid targets
          // Sort is needed?
          const isTargetHere = this.validTargets.sort((a,b)=>{
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          }).find(
            (target) => target.name === currentTarget
          );
          if (isTargetHere) {
            this.focusedTarget = state.map.gameObjects[currentTarget];
          } else {
            this.focusedTarget = null;
            this.dbUpdateMonster({ monster: { currentTarget: false } });
          }
        }
      }
    );

    // If someone else control monster, 
    // stop here (you are not a target)
    if (!this.isPlayerControlledMonster) return;

      

    this.followTarget(state);
  }

  getDistanceToTarget(from, to) {
    const gapX = from.x - to.x;
    const gapY = from.y - to.y;
    return Math.hypot(gapX, gapY);
  }

  followTarget(state) {
    if (!this.focusedTarget) return;

    const target = {
      x: this.focusedTarget?.x,
      y: this.focusedTarget?.y,
      aroundFreeSpace: {
        up: { isFree: null, position: null, distance: null },
        down: { isFree: null, position: null, distance: null },
        left: { isFree: null, position: null, distance: null },
        leftUp: { isFree: null, position: null, distance: null },
        leftDown: { isFree: null, position: null, distance: null },
        right: { isFree: null, position: null, distance: null },
        rightUp: { isFree: null, position: null, distance: null },
        rightDown: { isFree: null, position: null, distance: null },
      },
    };

    // Clear free spaces if target disappear
    // TODO: loop
    if (!target.x || !target.y) {
      target.aroundFreeSpace = {
        up: { isFree: null, position: null, distance: null },
        down: { isFree: null, position: null, distance: null },
        left: { isFree: null, position: null, distance: null },
        leftUp: { isFree: null, position: null, distance: null },
        leftDown: { isFree: null, position: null, distance: null },
        right: { isFree: null, position: null, distance: null },
        rightUp: { isFree: null, position: null, distance: null },
        rightDown: { isFree: null, position: null, distance: null },
      };
      return;
    }

    

    if (this.movingProgressReaming > 0) return;

    

    // Check free spaces around target
    Object.keys(target.aroundFreeSpace).forEach((direction) => {
      const result = state.map.isSpaceTaken(target.x, target.y, direction);
      const pos = utils.nextPosition(target.x, target.y, direction);
      if (result) {
        target.aroundFreeSpace[direction].isFree = false;
      } else {
        target.aroundFreeSpace[direction].isFree = true;
      }
      target.aroundFreeSpace[direction].position = pos;
      target.aroundFreeSpace[direction].distance = this.getDistanceToTarget(
        { x: pos.x, y: pos.y },
        { x: this.x, y: this.y }
      );
    });

    // Stop if monster is in free space around player
    for (const obj in target.aroundFreeSpace) {
      if (
        target.aroundFreeSpace[obj].position.x === this.x &&
        target.aroundFreeSpace[obj].position.y === this.y
      ) {
        // Attack
        // this.count2++;
        // if (this.count2 % 100 === 0) {
        //   this.initAttack(state, "swordSlash");
        //   this.dbUpdateMonster({
        //     monster: {
        //       isAttack: "swordSlash",
        //     },
        //   });
        // }

        // Turn towards the target
        const oppositeDir = utils.oppositeDirection(obj);
        if (this.direction !== oppositeDir) {
          this.direction = oppositeDir;
          // Update dir at db
          this.dbUpdateMonster({
            monster: {
              direction: this.direction,
            },
          });
          // console.log(this.direction);
        }

        return;
      }
    }

    // Choose nearest target free space by distance
    const freeDirection = Object.keys(target.aroundFreeSpace)
      .sort(
        (a, b) =>
          target.aroundFreeSpace[a].distance -
          target.aroundFreeSpace[b].distance
      )
      .find((key) => {
        return target.aroundFreeSpace[key].isFree;
      });

    if (!freeDirection) return;

    // Check possible move around monster
    const possibleMove = this.checkPossibleMoveAround(
      state,
      target.aroundFreeSpace[freeDirection].position
    );

    // Sort possible move around monster by distance
    // and return closest move to target
    const newDirection = this.sortPossibleMoveByDistance(possibleMove);

    if (this.movingProgressReaming === 0) {
      // Attack while moving,
      // only if last dir is equal to new dir (for no sprite bugs)
      // TODO: time
      this.count++;
      if (this.count % 5 === 0 && this.direction === newDirection.name) {
        this.initAttack(state, "iceWave");
        // if (target.isPlayerControlledMonster){
          this.dbUpdateMonster({
            monster: {
              isAttack: "iceWave",
            },
          });
        // }
      }
      // Move
      this.startBehavior(
        { arrow: newDirection.name, map: state.map },
        { type: "walk", direction: newDirection.name }
      );

      
        
      
      // // Add last move to store
      // if (this.lastMoveHistory.length < this.lastMoveHistoryMaxLength)
      //   return this.lastMoveHistory.push(newDirection.name);

      // // If store is full, check if monster stuck
      // const firstMove = this.lastMoveHistory.filter((n) => {
      //   return n === this.lastMoveHistory[0];
      // });

      // const secondMove = this.lastMoveHistory.filter((n) => {
      //   return n === this.lastMoveHistory[1];
      // });

      // console.log(firstMove, secondMove);
      // console.log(firstMove.length, secondMove.length);
      // // If first and second move repeat four times change target if possible
      // if (
      //   firstMove.length === 4 &&
      //   secondMove.length === 4 &&
      //   this.validTargets.length >= 2
      // ) {
      //   console.log("change target");
      //   // const newFocusedTarget = this.validTargets.filter((target) => {
      //   //   return target.name !== this.focusedTarget.name;
      //   // });
      //   // console.log("newFocusedTarget ", newFocusedTarget[0])
      //   // this.focusedTarget = newFocusedTarget[0];
      //   // console.log(this);

      //   this.isTargetReachable = false;
      // }

      // this.lastMoveHistory = [];
    }
  }

  checkPossibleMoveAround(state, targetPosition) {
    // Check possible move around monster
    const possibleMove = [];
    Object.keys(this.directionUpdate).forEach((direction) => {
      possibleMove.push({
        name: direction,
        isPossible: !state.map.isSpaceTaken(this.x, this.y, direction),
        distanceToTarget: this.getDistanceToTarget(
          targetPosition,
          utils.nextPosition(this.x, this.y, direction)
        ),
      });
    });
    return possibleMove;
  }

  sortPossibleMoveByDistance(array) {
    // Sort possible move around monster by distance
    // and return closest move to target
    return array
      .sort((a, b) => a.distanceToTarget - b.distanceToTarget)
      .find((_, i) => {
        return array[i].isPossible;
      });
  }

  returnToInitialPosition(state) {
    const initialPosition = { x: this.initialX, y: this.initialY };
    const possibleMove = this.checkPossibleMoveAround(state, initialPosition);
    const newDirection = this.sortPossibleMoveByDistance(possibleMove);
    if (this.movingProgressReaming === 0) {
      this.startBehavior(
        { arrow: newDirection.name, map: state.map },
        { type: "walk", direction: newDirection.name }
      );
    }
  }

  teleportToInitialPosition() {
    if (this.movingProgressReaming === 0) {
      this.x = this.initialX;
      this.y = this.initialY;
      this.dbUpdateMonster({
        monster: {
          x: utils.withGridReverse(this.initialX),
          y: utils.withGridReverse(this.initialY),
        },
      });
    }
  }

  dbUpdateMonster(state) {
    update(ref(db, `monsters/${this.currentMap}/${this.id}`), state.monster);
  }

  // Load one specific data from db
  async loadMonsterCurrentData({ currentMap, id, findData }, resolve) {
    let currentData = null;
    await get(child(dbRef, `monsters/${currentMap}/${id}`))
      .then((snapshot) => {
        if (!snapshot.exists()) return;
        const monsterData = snapshot.val();
        currentData = monsterData[findData];
      })
      .catch((error) => {
        console.log("loadMonsters error:", error);
      });
    resolve(currentData);
  }

  // initAttack(state, attackName) {
  //   // if (this.movingProgressReaming > 0) return;dw
  //   super.initAttack(state, attackName);
  // }

  // TODO: if target die return to your behaviour (need db connection)
  // if monster die, dissaper him and put on this spot loot bag
  // (db connection need, positions of loot bags, i think)
}
