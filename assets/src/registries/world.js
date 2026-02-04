Registry.worlds.add("ocean-skies", {
  name: "Ocean Skies",
  bgm: "sky-high",
  background: "background.sea",
  spawning: [
    {
      entity: "wooden-box",
      interval: 90,
      isHighTier: false,
      imposMode: "when-off",
    },
    {
      entity: "hardwood-box",
      interval: 90,
      isHighTier: false,
      imposMode: "when-on",
    },
    {
      entity: "metal-box",
      interval: 320,
      isHighTier: true,
      imposMode: "when-off",
    },
    {
      entity: "robox",
      interval: 640,
      isHighTier: true,
      imposMode: "when-on",
    },
  ],
  bosses: [
    "gigantic-box",
    "monkey-ace",
    "super-monkey",
    "gigantic-box",
    "monkey-ace",
    "super-monkey",
    "gigantic-box",
    "monkey-ace",
    "super-monkey",
    "robo-monkey",
  ],
});
Registry.worlds.add("workshop", {
  name: "Workshop",
  bgm: "deconstruction",
  background: "background.conveyor",
  spawning: [
    {
      entity: "metal-box",
      interval: 100,
      isHighTier: false,
    },
    {
      entity: "wooden-box",
      interval: 300,
      isHighTier: false,
    },
  ],
});
Registry.worlds.add("p̴͕͕͛u̴̞͝ŗ̷̠̄g̷̨͌͝a̸͈̝̔̒ṯ̴̎o̸͎͝ṟ̸͚̍y̵̯̳̏͝", {
  name: "ｐｕｒｇａｔｏｒｙ",
  bgm: "air",
  background: "background.p̴͕͕͛u̴̞͝ŗ̷̠̄g̷̨͌͝a̸͈̝̔̒ṯ̴̎o̸͎͝ṟ̸͚̍y̵̯̳̏͝",
  spawning: [
    {
      entity: "w̷̦̄͆i̸̯̯͗̚r̸̞̕͜e̷̺͛ͅf̴̰̚͝ṙ̴͍͉̈́á̵̮m̵̨͊e̶̤͒",
      interval: 360,
      isHighTier: false,
    },
  ],
  bosses: ["ë̵͉̹́̍̕͝n̴̨͍̩̺̦̜̗͒̈́̇̀̍͊̆ť̸̡̟̣͙͔̣͙́̑̆̏͒̕i̶̯̥̙̮̐̊̀̀͘̕͜t̸͍̟̐̄͂͘͝y̴̼͉̰̮̽̿͛̆͗͠"],
  endless: true,
  ambientSound: "bong",
  ambienceChance: 0.0005,
  muffleSound: true
});