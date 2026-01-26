createUIComponent(["crash"], [], 960, 540, 1000, 900);
createUIComponent(["crash"], [], 960, 150, 1000, 180, "none", null, "Oh No", false, 100);
createUIComponent(
  ["crash"],
  [],
  960,
  300,
  0,
  0,
  "none",
  null,
  "MOAB Adventure has encountered an error.",
  true,
  40
);
/**
 * @param {Error} error
 */
function crash(error) {
  reload();
  SoundCTX.stop("*");
  ui.menuState = "crash";
  crashStats.type.text = error.constructor.name + ":";
  crashStats.message.text = wrapWords(error.message, 40);
  crashStats.stack.text = error.stack ?? "";
}
const crashStats = {
  type: createUIComponent(["crash"], [], 960, 460, 0, 0, "none", null, "Error", true, 50),
  message: createUIComponent(
    ["crash"],
    [],
    960,
    530,
    0,
    0,
    "none",
    null,
    "Game crashed.",
    true,
    40
  ),
  stack: createUIComponent(["crash"], [], 960, 700, 0, 0, "none", null, "", true, 20),
};
createUIComponent(
  ["crash"],
  [],
  960,
  860,
  700,
  50,
  "none",
  () => {
    ui.menuState = "in-game";
  },
  "Re-enter Game (May crash again)",
  true,
  35
);
createUIComponent(
  ["crash"],
  [],
  960,
  940,
  700,
  50,
  "none",
  () => {
    ui.menuState = "title";
  },
  "Back to Start (Progress is lost)",
  true,
  35
);
