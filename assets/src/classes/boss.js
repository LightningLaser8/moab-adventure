class Boss extends ScalingEntity {
  reward = 0;
  /** @type {Object<string, BossAction>} */
  actions = {}; // Essentially a registry, holds actions that this boss can perform
  /**@type {ActionTrigger[]} */
  triggers = []; // Stores triggers, which allow conditional execution of actions
  /** @type {string[]} */
  sequence = []; // Array of names of actions. These will be executed in order.
  imposSequence = null; //Array to be used in Impossible difficulty. Optional.
  #action = 0; //Current action being executed

  model = null;
  imposModel = null;
  overrideModel = null;

  data = new Map();

  shieldDamageOverride = 50;
  shieldReboundOverride = 10;

  trackTarget = true;

  isMinion = false; //Stops this counting for boss kills
  dv = 250;

  healthColour = null;
  higher = false;

  init() {
    super.init();
    //Construct boss actions
    for (let name in this.actions) {
      this.actions[name] = construct(this.actions[name], BossAction);
    }
    this.triggers.forEach((v, i, a) => (a[i] = construct(v, ActionTrigger)));

    let expanded = [];
    if (this.sequence)
      this.sequence.forEach((x) => {
        let aspos = x.indexOf("*") + 1;
        if (aspos) {
          let mul = parseInt(x.substring(0, aspos - 1));
          for (let i = 0; i < mul; i++) {
            expanded.push(x.substring(aspos));
          }
        } else expanded.push(x);
      });
    this.sequence = expanded;

    expanded = [];
    if (this.imposSequence)
      this.imposSequence.forEach((x) => {
        let aspos = x.indexOf("*") + 1;
        if (aspos) {
          let mul = parseInt(x.substring(0, aspos - 1));
          for (let i = 0; i < mul; i++) {
            expanded.push(x.substring(aspos));
          }
        } else expanded.push(x);
      });
    this.imposSequence = expanded;

    //modeling

    //legacy override
    if (this.drawer && !this.model) {
      this.model = {
        displayWidth: this.drawer.width,
        displayHeight: this.drawer.height,
        parts: {
          main: this.drawer,
        },
      };
    }

    // new system
    if (this.overrideModel) this.overrideModel = construct(this.overrideModel, Model);
    else {
      this.model = construct(this.model, Model);
      this.imposModel = construct(this.imposModel, Model);
    }

    //Instantly use first action, no animation
    let currentAction = this.getAction();
    if (currentAction) currentAction.execute(this);
    this.previousRot = this.direction;
  }
  seq() {
    return game.difficulty === "impossible" ? (this.imposSequence ?? this.sequence) : this.sequence;
  }
  getAction() {
    return this.actions[this.seq()[this.#action]];
  }
  #eval(condition, seppos, evaluator) {
    let lvalue = this.#valueof(condition.substring(0, seppos - 1));
    let rvalue = this.#valueof(condition.substring(seppos));
    // console.log(`check ${lvalue} and ${rvalue}`);
    let res = evaluator(lvalue, rvalue);
    // console.log(res ? "passed" : "failed");
    return !!res;
  }
  #valueof(valueString) {
    // console.log(`value ${valueString}`);
    if (valueString.startsWith("#")) {
      valueString = valueString.substring(1);
      let dg = this.data.get(valueString);
      if (dg !== undefined) valueString = dg;
    }
    if (valueString.startsWith("@")) {
      valueString = valueString.substring(1);
      let v = this[valueString],
        tv = typeof v;
      if (valueString in this && tv !== "function" && tv !== "object") valueString = v;
    }
    return valueString;
  }
  lobotomise(){
    this.data.clear();
    this.#action = 0;
    for (let name in this.actions) {
      this.actions[name] = construct(this.actions[name], BossAction);
    }
    this.triggers.forEach((v, i, a) => (a[i] = construct(v, ActionTrigger)));
  }
  satisfies(condition) {
    // console.log(`only if ${condition}`);
    let ltpos = condition.indexOf("<") + 1;
    let rtpos = condition.indexOf(">") + 1;
    let eqpos = condition.indexOf("=") + 1;
    if (eqpos) return this.#eval(condition, eqpos, (l, r) => l == r);
    else if (ltpos) return this.#eval(condition, ltpos, (l, r) => l < r);
    else if (rtpos) return this.#eval(condition, rtpos, (l, r) => l > r);
    else return !!this.#valueof(condition);
  }
  tickSeq(seq, actIndex) {
    //Do the action thing
    /**@type {string} */
    let actName = seq[actIndex];
    if (!actName) return 0; //Stop immediately if actions empty

    //it's processing time
    let qpos = actName.indexOf("?") + 1;
    if (qpos) {
      let condition = actName.substring(0, qpos - 1);
      actName = actName.substring(qpos);
      let epos = actName.indexOf(":") + 1;
      if (epos) {
        let ifAction = actName.substring(0, epos - 1);
        let elseAction = actName.substring(epos);
        // console.log(`if ${condition} then ${ifAction} else ${elseAction}`);
        if (this.satisfies(condition)) actName = ifAction;
        else actName = elseAction;
        // console.log(`-> doing ${actName}`);
      } else if (!this.satisfies(condition)) return actIndex + 1;
    }

    /**@type {BossAction} */
    let currentAction = this.actions[actName];
    if (!currentAction) return 0; //Stop immediately if actions empty
    if (!currentAction.complete) {
      currentAction.tick(this);
      return actIndex;
    }
    //If action has finished
    currentAction.end(this);

    this.triggerEnd(actName);

    actIndex++;
    if (actIndex >= seq.length) {
      actIndex = 0;
    }
    let next = this.actions[seq[actIndex]];
    if (!next) return actIndex; //Stop if the only action has been done
    next.animate(this);
    next.execute(this);
    this.triggerStart(seq[actIndex]);
    next.tick(this); // correction for ticking actions
    if (next.duration === 1 && actIndex !== 0) {
      this.tickSeq(seq, actIndex); //skip through, unless all actions are 0 duration to avoid freezing
    }
    return actIndex;
  }
  triggerStart(action) {
    this.triggers.forEach((t) => {
      if (t instanceof ActionStartedTrigger && t.actionStarting == action) t.go();
    });
  }
  triggerEnd(action) {
    this.triggers.forEach((t) => {
      if (t instanceof ActionEndedTrigger && t.actionEnding == action) t.go();
    });
  }
  tick() {
    if (!this.#action) this.#action = 0;
    //Tick as normal
    super.tick();
    this.model.tick();
    if (this.aiActive) {
      //Temporarily, set target to player. This should almost always be the case, until player minions exist.
      this.target = game?.player;
    }
    this.#action = this.tickSeq(this.seq(), this.#action);
    //check triggers
    this.triggers.forEach((t) => t.tick(this));
    //Corrective rotating
    this.direction = Vector.fromAngleRad(this.directionRad).angle;
  }
  scaleToDifficulty() {
    let diff = Registry.difficulties.get(game.difficulty); //Get difficulty
    this.health *= diff.bossHP ?? 1; //Multiply HP by boss HP multiplier
  }
  onDeath(source) {
    //Give destroy reward
    game.bloonstones += this.reward ??= 0;
    if (game.mode === "boss-rush")
      game.shards += this.reward * 15 * Math.floor(Math.sqrt(game.level));
    if (!source) return;
    //Stats
    if (!this.isMinion) source.destroyed.bosses++;
    //Save progress
    if (!this.isMinion) {
      game.level++;
      saveGame();
    }
  }
  onDespawn() {
    if (!this.isMinion) {
      game.level++;
      saveGame();
    }
  }
  /**@returns {Model} */
  getModel() {
    return (
      this.overrideModel ??
      (game.difficulty === "impossible" ? (this.imposModel ?? this.model) : this.model)
    );
  }
  draw() {
    let d = this.getModel();
    d.draw(this.x, this.y, this.direction);
    // if (d.image) {
    //   ImageCTX.draw(d.image, this.x, this.y, d.width, d.height, this.directionRad);
    // } else {
    //   //If no image, draw shape instead
    //   rotatedShape(d.shape, this.x, this.y, d.width, d.height, this.directionRad);
    // }
    for (let slot of this.weaponSlots) {
      slot.draw();
    }
  }
  drawIcon(x, y, scl) {
    let d = this.getModel();
    push();
    translate(x, y);
    scale(scl);
    d.draw(0, 0, this.direction);
    pop();
  }
  modelHitTest(hx, hy, hsize) {
    return this.model.hitTest(this.x, this.y, this.direction, hx, hy, hsize);
  }
  debugModelHit(x, y, size, sensitivity = 1.2, time = 1) {
    let dist = -0.1;
    for (let r = 11; r >= 1; r--) {
      if (this.modelHitTest(x, y, (size * r) / sensitivity)) dist += 0.1;
    }
    if (dist >= 0) this.world.particles.push(new IndicatorParticle(x, y, time, size, dist));
  }
}
