ui.keybinds.shortcut.simple("back", "Escape", () => {
  for (let v of ui.components) {
    if (v.isBackButton && v.active) {
      v.press();
      break;
    }
  }
});

ui.keybinds.shortcut.simple("toggle_gl", "F7", async () => {
  console.warn("Toggling [Experimental] WebGL mode, this may cause problems");
  game.gl = !game.gl;
  noLoop();
  clear();
  await preload();
  await setup();
  loop();
});
