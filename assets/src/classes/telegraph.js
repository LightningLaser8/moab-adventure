class LineTelegraph extends LaserBullet {
  hitSize = 2;
  draw() {
    push();
    //Width is useless, as it is replaced by length, and height is useless as it is replaced by hitsize
    let drawnWidth = this.hitSize * 2;
    //Trigonometry to find offset x and y
    let offset = {
      x: Math.cos(this.directionRad) * width,
      y: Math.sin(this.directionRad) * width,
    };

    //l i n e
    noStroke();
    fill(255, 200);
    rotatedShape(
      "rect",
      this.x + offset.x,
      this.y + offset.y,
      width * 2,
      drawnWidth,
      this.directionRad
    );
    pop();
  }
  collidesWith(obj) {
    return false;
  }
  step(dt) {
    //Not if dead
    if (!this.remove) {
      this.sound();
      this.moveToSrc();
      this.intervalTick();
      
      if (!this.inited) {
        this.inited = true;
        createEffect(this.createEffect, this.world, this.x, this.y, this.directionRad);
      }
      // Don't move
      //Tick lifetime
      if (this.lifetime <= 0) {
        this.remove = true;
      } else {
        this.lifetime -= dt;
      }
      //Follow
      if (this.followsScreen) this.x -= game.player?.speed ?? 0;
    }
  }
}
