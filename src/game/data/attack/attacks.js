// import { combatAreas } from "./areas.js";
export const dataAttacks = {
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

