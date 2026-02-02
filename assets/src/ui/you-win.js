//Background, title, etc
createUIComponent(["you-win"], [], 960, 540, 1000, 900);
createUIComponent(
  ["you-win"],
  [],
  960,
  150,
  1000,
  180,
  "none",
  null,
  "*You Win!",
  false,
  100
);
//Interesting bit
const winStats = {
  shardCounter: createUIComponent(
    ["you-win"],
    [],
    960,
    300,
    0,
    0,
    "none",
    null,
    "Shards: 0",
    true,
    60
  ),
  bloonstoneCounter: createUIComponent(
    ["you-win"],
    [],
    960,
    360,
    0,
    0,
    "none",
    null,
    "Bloonstones: 0",
    true,
    60
  ),
  destroyedBoxes: createUIComponent(
    ["you-win"],
    [],
    960,
    530,
    0,
    0,
    "none",
    null,
    "Boxes Destroyed: 0",
    true,
    40
  ),
  destroyedBosses: createUIComponent(
    ["you-win"],
    [],
    960,
    570,
    0,
    0,
    "none",
    null,
    "Bosses Destroyed: 0",
    true,
    40
  ),
  damageDealt: createUIComponent(
    ["you-win"],
    [],
    960,
    610,
    0,
    0,
    "none",
    null,
    "Damage Dealt: 0",
    true,
    40
  ),
  damageTaken: createUIComponent(
    ["you-win"],
    [],
    960,
    650,
    0,
    0,
    "none",
    null,
    "Damage Taken: 0",
    true,
    40
  ),
};
createUIComponent(
  ["you-win"],
  [],
  960,
  900,
  400,
  100,
  "none",
  () => {
    ui.menuState = "start-menu";
  },
  "Return",
  false,
  50
).interactive = true;
