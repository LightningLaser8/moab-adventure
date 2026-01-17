//    New Game Menu 'new-game'
UIComponent.setCondition("difficulty:none");
//Difficulty selector
createGamePropertySelector(
  ["new-game"],
  [],
  250,
  260,
  100,
  250,
  60,
  "difficulty",
  ["easy", "normal", "hard"],
  null,
  ["Easy", "Normal", "Hard"],
  50
);
createUIComponent(
  ["new-game"],
  ["difficulty:impossible"],
  1300,
  260,
  400,
  60,
  "both",
  null,
  "Impossible",
  true,
  50
).outlineColour = [255, 255, 0];
UIComponent.setCondition("mode:none");
//Game mode selector
createGamePropertySelector(
  ["new-game"],
  [],
  250,
  400,
  100,
  350,
  60,
  "mode",
  ["adventure", "boss-rush", "sandbox"],
  null,
  ["Adventure", "Boss Rush", "Sandbox"],
  50,
  (value) => UIComponent.setCondition("mode:" + value)
);
Object.defineProperty(
UIComponent.alignLeft(
  createUIComponent(["new-game"], [], 250, 490, 0, 0, "none", null, "description of shit here", true, 30)
), "text", {get: () => 
  game.mode === "adventure" ? "Default mode. Travel through waves of boxes, with regular bossfights.\nThe intended experience." :
  game.mode === "boss-rush" ? "No intermissions, only bossfights. Short breaks only, and no passive income.\nMuch more challenging: Not recommended for first-time players." :
  game.mode === "sandbox" ? "Infinite health and currency, the ability to spawn anything, and other tools.\nFor creating fun scenarios or challenges alike. Also good for testing." :
  "Select a game mode.\n"
});

UIComponent.setCondition("saveslot:none");
//Save slot selector
createGamePropertySelector(
  ["new-game"],
  [],
  250,
  625,
  100,
  140,
  60,
  "saveslot",
  [0, 1, 2, 3, 4, 5],
  null,
  ["0", "1", "2", "3", "4", "5"],
  50,
  (value) => UIComponent.setCondition("saveslot:" + value)
);
//Weapon slot button
createUIComponent(
  ["new-game"],
  [],
  450,
  722,
  400,
  60,
  "right",
  () => {
    ui.menuState = "weapon-slots";
  },
  "*Weapons...  ",
  false,
  35
);
//Start game button
createUIComponent(
  ["new-game"],
  [
    "ap1-slot:1|2",
    "ap2-slot:1|2",
    "ap3-slot:1|2",
    "ap4-slot:1|2",
    "ap5-slot:1|2",
    "difficulty:easy|normal|hard|impossible",
    "saveslot:0|1|2|3|4|5",
  ],
  960,
  900,
  400,
  100,
  "none",
  () => {
    ui.menuState = "in-game";
    startGame();
  },
  "Start!",
  false,
  60
);
createUIComponent(
  ["new-game"],
  ["any", "ap1-slot:none", "ap2-slot:none", "ap3-slot:none", "ap4-slot:none", "ap5-slot:none"],
  960,
  800,
  0,
  0,
  "none",
  null,
  "Choose All\nWeapon Slots"
);
createUIComponent(["new-game"], ["mode:none"], 960, 840, 0, 0, "none", null, "Choose Game Mode");
createUIComponent(
  ["new-game"],
  ["saveslot:none"],
  960,
  870,
  0,
  0,
  "none",
  null,
  "Choose Save Slot"
);
createUIComponent(
  ["new-game"],
  ["difficulty:none"],
  960,
  900,
  0,
  0,
  "none",
  null,
  "Choose Difficulty"
);

//what?! impossible! inconceivable!
//innocuous little square
createUIComponent(
  ["new-game"],
  ["difficulty:none|easy|normal|hard"],
  1925,
  60,
  30,
  30,
  "none",
  () => {
    game.difficulty = "impossible";
    uiBlindingFlash(1925, 60, 255, 100, 1500);
  },
  ""
);
//fires
createParticleEmitter(
  ["new-game", "options", "weapon-slots"],
  ["difficulty:impossible"],
  960,
  1080,
  0,
  1,
  {
    type: "vfx.particle",
    cone: 0,
    maxXOffset: 760,
    emissions: 2,
    particle: {
      //All
      lifetime: 180,
      direction: -90,
      speed: 5,
      decel: 0.015,
      rotateSpeed: 0,
      moveWithBackground: false,
      shape: "rhombus",
      widthFrom: 60,
      widthTo: 0,
      heightFrom: 120,
      heightTo: 200,
      colourFrom: [255, 255, 50, 50],
      colourTo: [255, 0, 0, 0],
    },
  }
);
createParticleEmitter(["start-menu"], ["difficulty:impossible"], 960, 1000, 0, 1, {
  type: "vfx.particle",
  cone: 0,
  maxXOffset: 360,
  emissions: 1,
  particle: {
    //All
    lifetime: 180,
    direction: -90,
    speed: 5,
    decel: 0.015,
    rotateSpeed: 0,
    moveWithBackground: false,
    shape: "rhombus",
    widthFrom: 60,
    widthTo: 0,
    heightFrom: 120,
    heightTo: 200,
    colourFrom: [255, 255, 50, 50],
    colourTo: [255, 0, 0, 0],
  },
});
createParticleEmitter(["title"], ["difficulty:impossible"], 960, 800, 0, 1, {
  type: "vfx.particle",
  cone: 0,
  maxXOffset: 560,
  emissions: 1,
  particle: {
    //All
    lifetime: 180,
    direction: -90,
    speed: 5,
    decel: 0.015,
    rotateSpeed: 0,
    moveWithBackground: false,
    shape: "rhombus",
    widthFrom: 60,
    widthTo: 0,
    heightFrom: 120,
    heightTo: 200,
    colourFrom: [255, 150, 50, 50],
    colourTo: [255, 0, 0, 0],
  },
});
createParticleEmitter(
  ["title"],
  ["difficulty:impossible"],
  960,
  1000,
  0,
  1,
  {
    type: "vfx.particle",
    cone: 0,
    maxXOffset: 200,
    particle: {
      //All
      lifetime: 180,
      direction: -90,
      speed: 5,
      decel: 0.015,
      rotateSpeed: 0,
      moveWithBackground: false,
      shape: "rhombus",
      widthFrom: 60,
      widthTo: 0,
      heightFrom: 120,
      heightTo: 200,
      colourFrom: [255, 255, 50, 50],
      colourTo: [255, 0, 0, 0],
    },
  },
  3
);
createParticleEmitter(
  ["you-died", "you-win", "crash"],
  ["difficulty:impossible"],
  960,
  1000,
  0,
  1,
  {
    type: "vfx.particle",
    cone: 0,
    maxXOffset: 500,
    emissions: 1,
    particle: {
      //All
      lifetime: 180,
      direction: -90,
      speed: 5,
      decel: 0.015,
      rotateSpeed: 0,
      moveWithBackground: false,
      shape: "rhombus",
      widthFrom: 60,
      widthTo: 0,
      heightFrom: 120,
      heightTo: 200,
      colourFrom: [255, 255, 50, 50],
      colourTo: [255, 0, 0, 0],
    },
  }
);
createParticleEmitter(["in-game"], ["difficulty:impossible"], 960, 1080, 0, 1, {
  type: "vfx.particle",
  cone: 0,
  maxXOffset: 960,
  emissions: 3,
  particle: {
    //All
    lifetime: 120,
    direction: -90,
    speed: 3,
    decel: 0.015,
    rotateSpeed: 0,
    moveWithBackground: false,
    shape: "rhombus",
    widthFrom: 40,
    widthTo: 0,
    heightFrom: 90,
    heightTo: 160,
    colourFrom: [255, 255, 150, 50],
    colourTo: [255, 0, 0, 0],
  },
});
createParticleEmitter(["in-game"], ["difficulty:impossible"], 960, 0, 0, 1, {
  type: "vfx.particle",
  cone: 0,
  maxXOffset: 960,
  emissions: 3,
  particle: {
    //All
    lifetime: 120,
    direction: 90,
    speed: 3,
    decel: 0.015,
    rotateSpeed: 0,
    moveWithBackground: false,
    shape: "rhombus",
    widthFrom: 40,
    widthTo: 0,
    heightFrom: 90,
    heightTo: 160,
    colourFrom: [255, 100, 50, 50],
    colourTo: [255, 0, 0, 0],
  },
});
//mouse fire
Object.defineProperties(
  createParticleEmitter(
    ["new-game", "options", "weapon-slots", "title", "start-menu"],
    ["difficulty:impossible"],
    960,
    1080,
    0,
    1,
    {
      type: "vfx.particle",
      cone: 0,
      maxXOffset: 20,
      maxYOffset: 20,
      particle: {
        //All
        lifetime: 60,
        direction: -90,
        speed: 2,
        decel: 0.015,
        rotateSpeed: 0,
        moveWithBackground: false,
        shape: "rhombus",
        widthFrom: 30,
        widthTo: 0,
        heightFrom: 60,
        heightTo: 100,
        colourFrom: [255, 255, 50, 50],
        colourTo: [255, 0, 0, 0],
      },
    },
    5
  ),
  {
    x: {
      get: () => ui.mouse.x,
    },
    y: {
      get: () => ui.mouse.y,
    },
  }
);

//quickstart
function getNextFreeSlot() {
  for (let sl = 0; sl < 6; sl++) {
    if (!Serialiser.get("save." + sl)) return sl;
  }
  return -1;
}
createUIComponent(
  ["new-game"],
  [],
  1550,
  830,
  270,
  60,
  "none",
  () => quickstart(1),
  "*Quickstart X.1",
  true,
  30
);

createUIComponent(
  ["new-game"],
  [],
  1550,
  920,
  270,
  60,
  "none",
  () => quickstart(2),
  "*Quickstart X.2",
  true,
  30
);

function quickstart(subslot) {
  {
    UIComponent.setCondition("difficulty:normal");
    UIComponent.setCondition("saveslot:" + getNextFreeSlot());
    UIComponent.setCondition("mode:adventure");
    game.difficulty = "normal";
    game.saveslot = getNextFreeSlot();
    game.mode = "adventure";

    UIComponent.setCondition("ap1-slot:" + subslot);
    UIComponent.setCondition("ap2-slot:" + subslot);
    UIComponent.setCondition("ap3-slot:" + subslot);
    UIComponent.setCondition("ap4-slot:" + subslot);
    UIComponent.setCondition("ap5-slot:" + subslot);

    ui.menuState = "in-game";
    startGame();

    if (game.saveslot === -1)
      notifyEffect(
        "All slots full, using temporary slot\nSaving will override previous temp. game",
        360
      );
    else notifyEffect("Playing on slot " + game.saveslot);
  }
}
