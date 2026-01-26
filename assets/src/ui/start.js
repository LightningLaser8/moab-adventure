//   Start Menu 'start-menu'

//Start menu background and header
createUIComponent(["start-menu"], [], 960, 540, 700, 700);
createUIComponent(
  ["start-menu"],
  [],
  960,
  220,
  1000,
  75,
  "none",
  undefined,
  "*         Select Option",
  false,
  50
);
//Back to title screen button
createUIComponent(
  ["start-menu"],
  [],
  570,
  222,
  200,
  50,
  "none",
  () => {
    ui.menuState = "title";
  },
  "*< Back",
  false,
  30
).isBackButton = true;

//Options Buttons
createUIComponent(
  ["start-menu"],
  [],
  960,
  700,
  400,
  80,
  "none",
  () => {
    ui.menuState = "options";
  },
  "Options",
  true,
  65
);
createUIComponent(
  ["start-menu"],
  [],
  960,
  400,
  400,
  80,
  "none",
  () => {
    ui.menuState = "new-game";
  },
  "New Game",
  true,
  65
);
createUIComponent(
  ["start-menu"],
  [],
  960,
  550,
  400,
  80,
  "none",
  () => {
    ui.menuState = "load-game";
  },
  "Load Game",
  true,
  60
);

//    Start sub-menus
createUIComponent(
  ["new-game", "weapon-slots"],
  [],
  960,
  540,
  1500,
  900
);
createUIComponent(
  ["new-game"],
  [],
  960,
  120,
  1500,
  75,
  "none",
  undefined,
  "Create Game",
  false,
  50
);
createUIComponent(
  ["new-game"],
  [],
  320,
  122,
  200,
  50,
  "none",
  () => {
    ui.menuState = "start-menu";
  },
  "*< Back",
  false,
  30
).isBackButton = true;
