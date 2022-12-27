import { outisdeMapWalls } from "../data/testMapOutsideCollision.js";
import { utils } from "./utils.js";

export function convertCollision() {

  // Set collision map to convert
  const wichMap = outisdeMapWalls;

  const convertWalls = [];
  const posWalls = {};
  for (let i = 0; i < wichMap.length; i += 30) {
    convertWalls.push(wichMap.slice(i, i + 30));
  }
  console.log(convertWalls);

  convertWalls.forEach((row, i) => {
    Array.from(row).forEach((symbol, j) => {
      if (symbol === 164) {
        posWalls[utils.asGridCoords(j, i)] = true;
      }
    });
  });
  const result = JSON.stringify(posWalls);
  
  // Copy result from browser console to OverworldMap map game object
  console.log(result);
}
