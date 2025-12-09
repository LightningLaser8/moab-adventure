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
  220,
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
  350,
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
  500,
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
createUIComponent(
  ["start-menu"],
  [],
  960,
  650,
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
const integrateTheme = [39, 116, 239],
  integrateBg = [9, 28, 60];
function integrate(component) {
  component.baseOutlineColour = integrateTheme;
  component.outlineColour = integrateTheme;
  component.backgroundColour = integrateBg;
  component.textColour = integrateTheme;
  if (component instanceof ModularListComponent) component.parts.forEach((x) => integrate(x)); // really only matters immediately
  return component;
}

  createUIComponent(
    ["start-menu"],
    [],
    960,
    800,
    0,
    0,
    "none",
    null,
    "Mods",
    true,
    65
  );
    createUIComponent(
    ["start-menu"],
    [],
    960,
    840,
    0,
    0,
    "none",
    null,
    "Coming Soon",
    true,
    25
  );


// integrate(
//   createUIComponent(
//     ["start-menu"],
//     [],
//     960,
//     800,
//     400,
//     80,
//     "none",
//     () => {
//       ui.menuState = "mods";
//     },
//     "* Mods",
//     true,
//     65
//   )
// );
// createUIImageComponent(["start-menu"], [], 800, 800, 60, 60, null, "ui.integrate", false);
