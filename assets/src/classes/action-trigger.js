class ActionTrigger {
  impossibleMode = "ignore";
  actionName = "";
  /**@type {BossAction | null} */
  #inprogress = null;
  /**@param {Boss} entity  */
  tick(entity) {
    if (
      (this.impossibleMode === "when-on" && game.difficulty !== "impossible") ||
      (this.impossibleMode === "when-off" && game.difficulty === "impossible")
    )
      return;
    // if there's an action active, tick it.
    if (this.#inprogress) {
      if (!this.#inprogress.complete) {
        this.#inprogress.tick(entity);
      } else {
        this.#inprogress.end(entity);
        entity.triggerEnd(this.actionName);
        this.#inprogress = null;
      }
    }
    this.trigger(entity);
  }
  trigger(entity) {
    // if there isn't, check for trigger activation
    if (this.actionName !== "" && this.condition(entity)) {
      // and start the action
      this.#inprogress = entity.actions[this.actionName];
      this.#inprogress.execute(entity);
      this.onexec(entity);
    }
  }
  onexec(entity) {}
  condition(entity) {
    return true;
  }
}
// Triggers an action when the boss passes a certain health point - either a percentage or absolute value.
class SingleHPPointTrigger extends ActionTrigger {
  percentage = 30;
  absolute = -1;
  #triggered = false;
  trigger(entity) {
    if (!this.#triggered) super.trigger(entity);
  }
  /**@param {Boss} entity  */
  condition(entity) {
    return this.absolute >= 0
      ? entity.health < this.absolute
      : entity.health < (entity.maxHealth * this.percentage) / 100;
  }
  onexec(entity) {
    this.#triggered = true;
  }
}

// Triggers an action when the boss passes multiple health points - either every n health points, or n times over the health bar.
class MultiHPPointTrigger extends ActionTrigger {
  inclusive = true;
  divisions = 10;
  absolute = 0;
  #nextHealthPoint = 0;
  #lastHealthPoint = 0;
  init() {
    if (this.absolute > 0) this.#nextHealthPoint = this.absolute;
    else this.#nextHealthPoint = 1 / this.divisions;

    if (!this.inclusive) this.onexec();
  }
  onexec(entity) {
    this.#lastHealthPoint = this.#nextHealthPoint;
    if (this.absolute > 0) this.#nextHealthPoint += this.absolute;
    else this.#nextHealthPoint += 1 / this.divisions;
    if (entity) this.tick(entity);
  }
  /**@param {Boss} entity  */
  condition(entity) {
    let damagefrac =
      this.absolute > 0
        ? entity.maxHealth - entity.health
        : 1 - entity.health / entity.maxHealth;
    return (
      damagefrac >= this.#lastHealthPoint &&
      //damagefrac < this.#nextHealthPoint &&
      (this.inclusive || this.#nextHealthPoint > 0)
    );
  }
}
class ActionEndedTrigger extends ActionTrigger {
  actionEnding = "";
  #triggered = true;
  trigger(entity) {
    if (!this.#triggered) super.trigger(entity);
  }
  onexec(entity) {
    this.#triggered = true;
  }
  go() {
    this.#triggered = false;
  }
}
class ActionStartedTrigger extends ActionTrigger {
  actionStarting = "";
  #triggered = true;
  trigger(entity) {
    if (!this.#triggered) super.trigger(entity);
  }
  onexec(entity) {
    this.#triggered = true;
  }
  go() {
    this.#triggered = false;
  }
}
class DataValueTrigger extends ActionTrigger {
  name = "data";
  value = 1;
  #triggered = false;
  trigger(entity) {
    if (!this.#triggered) super.trigger(entity);
  }
  /** @param {Boss} entity */
  condition(entity) {
    let r = entity.data.get(this.name) === this.value;
    if (!r) this.#triggered = false;
    return r;
  }
  onexec(entity) {
    this.#triggered = true;
  }
}

class PositionTrigger extends ActionTrigger {
  invertDetection = false;

  #triggered = false;
  trigger(entity) {
    if (!this.#triggered) super.trigger(entity);
  }
  /** @param {Boss} entity */
  condition(entity) {
    let r = this.invertDetection !== this.positionCondition(entity);
    if (!r) this.#triggered = false;
    return r;
  }
  onexec(entity) {
    this.#triggered = true;
  }
  positionCondition(entity) {
    return true;
  }
}
// triggers when an entity enters (or optionally, leaves) a rectangular area.
class RectPositionTrigger extends PositionTrigger {
  minX = 0;
  maxX = 1920;
  minY = 0;
  maxY = 1080;

  positionCondition(entity) {
    return (
      entity.x > this.minX &&
      entity.x < this.maxX &&
      entity.y > this.minY &&
      entity.y < this.maxY
    );
  }
}
// triggers when an entity is to the right of some line
class HorizontalPositionTrigger extends PositionTrigger {
  x = 0;

  positionCondition(entity) {
    return entity.x > this.x;
  }
}
// triggers when an entity is below some line
class VerticalPositionTrigger extends PositionTrigger {
  y = 0;

  positionCondition(entity) {
    return entity.y > this.y;
  }
}
// triggers when an entity is inside some circle
class CirclePositionTrigger extends PositionTrigger {
  x = 0;
  y = 0;
  radius = 0;

  positionCondition(entity) {
    return new Vector(this.x, this.y).distanceTo(entity) < this.radius;
  }
}
