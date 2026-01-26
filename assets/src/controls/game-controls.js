game.keybinds.control.simple("move-up", "W", () => {
  if (game.player.y > game.player.hitSize) {
    //If 'W' pressed
    game.player.y -= game.player.speed;
  }
});
game.keybinds.control.simple("move-left", "A", () => {
  if (game.player.x > game.player.hitSize) {
    //If 'A' pressed
    game.player.x -= game.player.speed * 1.5;
  }
});
game.keybinds.control.simple("move-down", "S", () => {
  if (game.player.y < 1080 - game.player.hitSize) {
    //If 'S' pressed
    game.player.y += game.player.speed;
  }
});
game.keybinds.control.simple("move-right", "D", () => {
  if (game.player.x < 1920 - game.player.hitSize) {
    //If 'D' pressed
    game.player.x += game.player.speed * 0.67;
  }
});
