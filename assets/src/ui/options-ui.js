//    UI options menu 'ui'
createUIComponent(
  ["options.ui"],
  [],
  960,
  120,
  1500,
  75,
  "none",
  undefined,
  "UI Options",
  false,
  50,
);
createUIComponent(
  ["options.ui"],
  [],
  320,
  122,
  200,
  50,
  "none",
  () => {
    saveCachedOptions();
    ui.menuState = "options";
  },
  "*< Back",
  false,
  30,
).isBackButton = true;

//Reload Bar
createGamePropertySelector(
  ["options.ui"],
  [],
  250,
  300,
  100,
  400,
  60,
  "reloadBarStyle",
  ["radial", "horizontal"],
  0,
  ["Radial", "Horizontal"],
  40,
);

const rainbowCols = [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255],
    [192, 0, 255],
  ],
  monoCols = [
    [0, 0, 0],
    [64, 64, 64],
    [128, 128, 128],
    [192, 192, 192],
    [255, 255, 255],
  ];
createGamePropertySelector(
  ["options.ui"],
  [],
  250,
  450,
  100,
  400,
  60,
  "reloadBarTheme",
  ["rainbow", "mono", "thematic"],
  0,
  ["Colourful", "Monochromatic", "Follow Weapon"],
  40,
);
UIComponent.setBackgroundOf(createUIComponent(["options.ui"], [], 1360, 300, 250, 150, "none"), "background.sea")
createCustomUIComponent(["options.ui"], [], 1360, 300, 50, 50, (x, y) => fakeCursor(x, y));

createGamePropertySelector(
  ["options.ui"],
  [],
  250,
  600,
  100,
  400,
  60,
  "flashing",
  [true, false],
  0,
  ["Enabled", "Disabled"],
  40,
);
let esl = createSliderComponent(
  ["options.ui"],
  [],
  425,
  700,
  400,
  800,
  60,
  "right",
  "*Effects Intensity  ",
  true,
  30,
  (v) => {
    game.effects = v;
    UIComponent.setCondition("hidewarn:" + (v <= 0.35));
  },
  0,
  1,
  1,
);
UIComponent.setCondition("hidewarn:false");
UIComponent.alignLeft(
  createUIComponent(
    ["options.ui"],
    ["hidewarn:true"],
    250,
    750,
    0,
    0,
    "none",
    null,
    "This might make some attacks hard to see!",
    true,
    30,
  ),
);

createParticleEmitter(["options.ui"], [], 1500, 700, -90, 1, "fire", 1);
createUIComponent(["options.ui"], [], 1500, 700, 75, 75, "none", () => {
    game.effects = 1;
    UIComponent.setCondition("hidewarn:false");
    esl._current = 1;
  }).backgroundColour = [0, 0, 0];
UIComponent.alignLeft(Object.defineProperty(createUIComponent(["options.ui"], [], 1550, 700, 0, 0, "none",null,"",true,40), "text", {get:() => roundNum(game.effects * 100, 1)+"%"}));
