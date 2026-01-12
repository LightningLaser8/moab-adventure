
class Model {
  /**@type {{[name: string]: ModelPart}} */
  parts = {};
  /**@type {{[name: string]: ModelAnimation}} */
  animations = {};
  /**@type {Timer} */
  timer = new Timer();
  displayWidth = 0;
  displayHeight = 0;
  init() {
    for (const name in this.parts) {
      if (!Object.hasOwn(this.parts, name)) continue;

      const element = this.parts[name];
      this.parts[name] = construct(element, ModelPart);
      // console.log(name, this.parts[name].pos(this, 0, 0, 0));
    }
    for (const name in this.animations) {
      if (!Object.hasOwn(this.animations, name)) continue;

      const element = this.animations[name];
      this.animations[name] = construct({ movements: element }, ModelAnimation);
    }
  }
  fire(name) {
    if (Object.hasOwn(this.animations, name)) this.animations[name].on(this);
  }
  freeze() {
    this.timer.cancel("*");
  }
  move(name, x, y, rot) {
    const p = this.parts[name];
    if (!p) {
      console.warn("Animation references part '" + name + "', which doesn't exist.");
      return;
    }
    p.x += x;
    p.y += y;
    p.direction += rot;
  }
  pos(name) {
    const p = this.parts[name];
    if (!p) {
      console.warn("Animation references part '" + name + "', which doesn't exist.");
      return [0, 0, 0, 0];
    }
    return [p.x, p.y, p.direction, p.slide];
  }
  tick() {
    this.timer.tick();
  }
  draw(x, y, rotation) {
    for (const part in this.parts) {
      if (!Object.hasOwn(this.parts, part)) continue;

      const element = this.parts[part];

      element.draw(this, x, y, rotation);
    }
  }
  hitTest(x, y, rotation, hx, hy, hsize) {
    for (const part in this.parts) {
      if (!Object.hasOwn(this.parts, part)) continue;

      if (this.parts[part].hitTest(this, x, y, rotation, hx, hy, hsize)) return part;
    }
    return null;
  }
}

class ModelPart {
  x = 0;
  y = 0;
  direction = 0;
  width = 0;
  height = 0;
  slide = 0;
  image = null;
  shape = "rect";
  colour = [100, 100, 100];
  rotate = true;
  anchor = "";
  outl = false;
  /** @returns {Orientation} */
  pos(model, x, y, rotation) {
    let slide = 0;
    if (!this.rotate) rotation = 0;
    if (this.anchor !== "") {
      let move = model.pos(this.anchor);
      x += move[0];
      y += move[1];
      rotation += move[2];
      slide = move[3];
    }
    let angle = rotation + this.direction;
    return new Orientation(x, y, angle).add(Vector.fromAngle(rotation).scale(slide)).add(
      Vector.fromAngle(rotation + 90)
        .scale(this.y)
        .add(
          Vector.fromAngle(rotation).scale(this.x).add(Vector.fromAngle(angle).scale(this.slide))
        )
    );
    /*
    let pos = new Vector(x, y).add(Vector.fromAngle(rotation).scale(slide));
    let angle = rotation + this.direction;
    let xOffsetVct = Vector.fromAngle(rotation).scale(this.x);
    let yOffsetVct = Vector.fromAngle(rotation + 90).scale(this.y);
    let slideVct = Vector.fromAngle(angle).scale(this.slide);
    let toffset = yOffsetVct.add(xOffsetVct.add(slideVct));
    let finalPos = pos.add(toffset); //Add them all up
    */
  }
  /**@param {Model} model  */
  draw(model, x, y, rotation, slide = 0) {
    let finalPos = this.pos(model, x, y, rotation, slide);
    if (this.image instanceof ImageContainer || typeof this.image === "string") {
      //If it's an image, draw it
      ImageCTX.draw(
        this.image,
        finalPos.x,
        finalPos.y,
        this.width,
        this.height,
        radians(finalPos.rotation)
      );
    } else {
      //If it isn't, draw a rectangle
      push();
      if (this.outl) {
        strokeWeight(5);
        stroke(...this.colour);
        noFill();
      } else fill(...this.colour);
      rotatedShape(
        this.shape,
        finalPos.x,
        finalPos.y,
        this.width,
        this.height,
        radians(finalPos.rotation)
      );
      pop();
    }
  }
  hitTest(model, x, y, rotation, hx, hy, hsize) {
    let finalPos = this.pos(model, x, y, rotation);
    return finalPos.distanceTo(new Vector(hx, hy)) <= hsize + (this.width + this.height) / 4;
  }
}

class ModelAnimation {
  /**@type {ModelMovement[]} */
  movements = [];
  init() {
    this.movements.forEach((v, i, a) => (a[i] = constructFromType(v, ModelMovement)));
  }
  /**@param {Model} model */
  on(model) {
    this.movements.forEach((m) => {
      model.timer.repeat(
        () => model.move(m.part, m.dx / m.duration, m.dy / m.duration, m.drot / m.duration),
        m.duration,
        1,
        m.delay
      );
    });
  }
}

class ModelMovement {
  part = "";
  dx = 0;
  dy = 0;
  drot = 0;
  duration = 0;
  delay = 0;
}
