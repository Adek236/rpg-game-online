export const dataAttacks = {
    swordSlash: {
        name: "Sword Slash",
        src: "src/game/assets/objects/sword2.png",
        time: 300,
        animations: {
            "attack-sword-up": [
              [
                { frame: 0, offset: 12 },
                { frame: 0, offset: 9 },
              ],
              [
                { frame: 1, offset: -12 },
                { frame: 0, offset: 9 },
              ],
            ],
            "attack-sword-down": [
              [
                { frame: 1, offset: -12 },
                { frame: 0, offset: 9 },
              ],
              [
                { frame: 0, offset: 12 },
                { frame: 0, offset: 9 },
              ],
            ],
            "attack-sword-left": [
              [
                { frame: 3, offset: -3 },
                { frame: 0, offset: 17 },
              ],
              [
                { frame: 2, offset: -3 },
                { frame: 0, offset: -5 },
              ],
            ],
            "attack-sword-right": [
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
    }
}