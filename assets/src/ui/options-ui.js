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
  50
);
createUIComponent(
  ["options.ui"],
  [],
  320,
  120,
  200,
  50,
  "none",
  () => {
    saveCachedOptions();
    ui.menuState = "options";
  },
  "*< Back",
  false,
  30
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
  40
);

const rainbowCols = [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255],
    [192, 0, 255],
    [255, 255, 255],
  ],
  monoCols = [
    [0, 0, 0],
    [64, 64, 64],
    [128, 128, 128],
    [192, 192, 192],
    [255, 255, 255],
    [255, 128, 0],
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
  40
);
createUIComponent(["options.ui"],[],1360,300,250,150,"none").backgroundColour = [20,80,255];
createCustomUIComponent(["options.ui"], [], 1360, 300, 50, 50, (x, y) => fakeCursor(x, y));
