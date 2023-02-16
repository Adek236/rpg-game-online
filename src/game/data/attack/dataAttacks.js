// import { combatAreas } from "./areas.js";
export const dataAttacks = {
  iceShot: {
    id: "iceShot",
    name: "Ice Shot",
    animateName: "ice-shot-",
    personAnimateName: "attack-",
    src: "src/game/assets/objects/iceEffect.png",
    time: 500,
    useSlash: false,
    needMarkedTarget: true,
    combatAreaName: null,
    baseDamage: 10,
    distance: 100,
    repeatableImageAtPositions: {
      norepeat: [{ x: 0, y: 0 }],
    },
    animations: {
      "ice-shot-up": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: -9 },
        // ],
        [
          { frame: 1, offset: 2 },
          { frame: 0, offset: -9 },
        ],
        [
          { frame: 2, offset: 2 },
          { frame: 0, offset: -9 },
        ],
        [
          { frame: 3, offset: 2 },
          { frame: 0, offset: -9 },
        ],
      ],
      "ice-shot-down": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 2 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 2, offset: 2 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 3, offset: 2 },
          { frame: 0, offset: 24 },
        ],
      ],
      "ice-shot-left": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: -14 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-shot-leftUp": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: -14 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-shot-leftDown": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: -14 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-shot-right": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 18 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 18 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: 18 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-shot-rightUp": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: 16 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-shot-rightDown": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: 16 },
          { frame: 0, offset: 8 },
        ],
      ],
    },
  },
  iceWave: {
    id: "iceWave",
    name: "Ice Wave",
    animateName: "ice-wave-",
    personAnimateName: "attack-",
    src: "src/game/assets/objects/iceEffect.png",
    time: 300,
    useSlash: false,
    needMarkedTarget: false,
    combatAreaName: "9x1c",
    baseDamage: 50,
    // repeatableImageAtPositions: {
    //   "norepeat": [{ x: 0, y: 0 }],
    // },
    repeatableImageAtPositions: {
      up: [
        { x: 0, y: 0 },
        { x: 0, y: -16 },
        { x: 0, y: -32 },
        { x: 0, y: -48 },
      ],
      down: [
        { x: 0, y: 0 },
        { x: 0, y: 16 },
        { x: 0, y: 32 },
        { x: 0, y: 48 },
      ],
      left: [
        { x: 0, y: 0 },
        { x: -16, y: 0 },
        { x: -32, y: 0 },
        { x: -48, y: 0 },
      ],
      right: [
        { x: 0, y: 0 },
        { x: 16, y: 0 },
        { x: 32, y: 0 },
        { x: 48, y: 0 },
      ],
    },
    animations: {
      "ice-wave-up": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: -9 },
        // ],
        [
          { frame: 1, offset: 2 },
          { frame: 0, offset: -9 },
        ],
        [
          { frame: 2, offset: 2 },
          { frame: 0, offset: -9 },
        ],
        [
          { frame: 3, offset: 2 },
          { frame: 0, offset: -9 },
        ],
      ],
      "ice-wave-down": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 2 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 2, offset: 2 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 3, offset: 2 },
          { frame: 0, offset: 24 },
        ],
      ],
      "ice-wave-left": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: -14 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-wave-leftUp": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: -14 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-wave-leftDown": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -14 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: -14 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-wave-right": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 18 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 18 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: 18 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-wave-rightUp": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: 16 },
          { frame: 0, offset: 8 },
        ],
      ],
      "ice-wave-rightDown": [
        // [
        //   { frame: 0, offset: 2 },
        //   { frame: 0, offset: 24 },
        // ],
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 3, offset: 16 },
          { frame: 0, offset: 8 },
        ],
      ],
    },
  },
  swordSlash: {
    id: "swordSlash",
    name: "Sword Slash",
    animateName: "sword-slash-",
    personAnimateName: "attack-",
    src: "src/game/assets/objects/sword2.png",
    time: 300,
    useSlash: true,
    needMarkedTarget: false,
    combatAreaName: "3x1",
    baseDamage: 50,
    repeatableImageAtPositions: {
      norepeat: [{ x: 0, y: 0 }],
    },
    animations: {
      "sword-slash-up": [
        [
          { frame: 0, offset: 12 },
          { frame: 0, offset: 9 },
        ],
        [
          { frame: 1, offset: -12 },
          { frame: 0, offset: 9 },
        ],
      ],
      "sword-slash-down": [
        [
          { frame: 1, offset: -12 },
          { frame: 0, offset: 9 },
        ],
        [
          { frame: 0, offset: 12 },
          { frame: 0, offset: 9 },
        ],
      ],
      "sword-slash-left": [
        [
          { frame: 3, offset: -3 },
          { frame: 0, offset: 17 },
        ],
        [
          { frame: 2, offset: -3 },
          { frame: 0, offset: -5 },
        ],
      ],
      "sword-slash-leftUp": [
        [
          { frame: 3, offset: -3 },
          { frame: 0, offset: 17 },
        ],
        [
          { frame: 2, offset: -3 },
          { frame: 0, offset: -5 },
        ],
      ],
      "sword-slash-leftDown": [
        [
          { frame: 3, offset: -3 },
          { frame: 0, offset: 17 },
        ],
        [
          { frame: 2, offset: -3 },
          { frame: 0, offset: -5 },
        ],
      ],
      "sword-slash-right": [
        [
          { frame: 3, offset: 4 },
          { frame: 0, offset: 17 },
        ],
        [
          { frame: 2, offset: 4 },
          { frame: 0, offset: -5 },
        ],
      ],
      "sword-slash-rightUp": [
        [
          { frame: 3, offset: 4 },
          { frame: 0, offset: 17 },
        ],
        [
          { frame: 2, offset: 4 },
          { frame: 0, offset: -5 },
        ],
      ],
      "sword-slash-rightDown": [
        [
          { frame: 3, offset: 4 },
          { frame: 0, offset: 17 },
        ],
        [
          { frame: 2, offset: 4 },
          { frame: 0, offset: -5 },
        ],
      ],
    },
  },
  autoAttack: {
    id: "autoAttack",
    name: "Auto Attack",
    animateName: "auto-attack-",
    personAnimateName: "attack-",
    src: "src/game/assets/objects/sword2.png",
    time: 300,
    useSlash: false,
    needMarkedTarget: true,
    combatAreaName: null,
    baseDamage: 50,
    distance: 30,
    repeatableImageAtPositions: {
      norepeat: [{ x: 0, y: 0 }],
    },
    animations: {
      "auto-attack-up": [
        [
          { frame: 2, offset: 0 },
          { frame: 0, offset: -8 },
        ],
        [
          { frame: 3, offset: 0 },
          { frame: 0, offset: -8 },
        ],
      ],
      "auto-attack-down": [
        [
          { frame: 2, offset: 0 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 3, offset: 0 },
          { frame: 0, offset: 24 },
        ],
      ],
      "auto-attack-left": [
        [
          { frame: 1, offset: -16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: -16 },
          { frame: 0, offset: 8 },
        ],
      ],
      "auto-attack-leftUp": [
        [
          { frame: 1, offset: -16 },
          { frame: 0, offset: -8 },
        ],
        [
          { frame: 2, offset: -16 },
          { frame: 0, offset: -8 },
        ],
      ],
      "auto-attack-leftDown": [
        [
          { frame: 1, offset: -16 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 2, offset: -16 },
          { frame: 0, offset: 24 },
        ],
      ],
      "auto-attack-right": [
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: 8 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: 8 },
        ],
      ],
      "auto-attack-rightUp": [
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: -8 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: -8 },
        ],
      ],
      "auto-attack-rightDown": [
        [
          { frame: 1, offset: 16 },
          { frame: 0, offset: 24 },
        ],
        [
          { frame: 2, offset: 16 },
          { frame: 0, offset: 24 },
        ],
      ],
    },
  },
};
