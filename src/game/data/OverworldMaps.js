import { utils } from "../utils/utils.js";
import { convertedOutisdeMapWalls } from "./testMapOutsideCollision.js";
export const OverworldMaps = {
    outsideMap: {
      mapName: "outsideMap",
      lowerSrc: "src/game/assets/maps/testMapOutside.png",
      upperSrc: "src/game/assets/maps/testMapOutsideUpper.png",
      configObjects: {
        // loot1: {
        //   type: "Loot",
        //   x: utils.withGrid(13),
        //   y: utils.withGrid(16),
        //   rank: 1,
        //   name: "Common"
        // },
        // skeleton: {
        //   type: "Monster",
        //   x: utils.withGrid(13),
        //   y: utils.withGrid(16),
        //   outfit: "src/game/assets/monsters/skeleton/skeleton_walk.png",
        //   hp: 100,
        //   behaviorLoop: [
        //     // { type: "stand", direction: "down", time: 800 }
        //     // { type: "walk", direction: "right" },
        //     // { type: "stand", direction: "down", time: 2800 },
        //     // { type: "walk", direction: "left" },
        //   ],
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