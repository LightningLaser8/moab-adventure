/** Represents a key with optional modifiers. */
class ModifiedKey {
  key = "esc";
  ctrl = false;
  shift = false;
  alt = false;
  ignore = false;
  constructor(key, control = false, shift = false, alt = false, ignore = false) {
    this.key = key;
    this.ctrl = control;
    this.shift = shift;
    this.alt = alt;
    this.ignore = ignore;
    //console.log(`created [${key}:${(control ? "c" : "") + (shift ? "s" : "") + (alt ? "a" : "")}]`);
  }
  active(key, ctrl, shift, alt) {
    // console.log(
    //   `checking [${key}:${(ctrl ? "c" : "") + (shift ? "s" : "") + (alt ? "a" : "")}] against [${
    //     this.key
    //   }:${(this.ctrl ? "c" : "") + (this.shift ? "s" : "") + (this.alt ? "a" : "")}]`
    // );
    return (
      this.key === key &&
      (this.ignore || (this.ctrl === ctrl && this.shift === shift && this.alt === alt))
    );
  }
}
/** Defines a _mousebind_: a mapping of a mouse button (optionally with modifiers) to an event. */
class Mousebind extends ModifiedKey {}

/** Defines a _shortcut_: that is, a keybind that fires once, when a key is pressed. */
class ShortcutBinding {
  #event_press;
  #event_release;
  #held = false;
  /**@readonly */
  get down() {
    return this.#held;
  }
  constructor(
    key,
    mods = { ctrl: false, shift: false, alt: false, ignore: false },
    events = { press: null, hold: null, release: null }
  ) {
    this.shortcut = new ModifiedKey("" + key, mods.ctrl, mods.shift, mods.alt, mods.ignore);
    this.#event_press = events.press;
    this.#event_release = events.release;
  }
  /** @type {ModifiedKey?} */
  shortcut = null;
  /** @type {() => void} */
  event = () => undefined;
  fire() {
    if (this.#event_press) void this.#event_press();
    this.#held = true;
  }
  unfire() {
    if (this.#held && this.#event_release) void this.#event_release();
    this.#held = false;
  }
  tick() {}
  /**@type {ModifiedKey} */
  #original = null;
  /** Changes a binding's settings. Won't change name or event.
   * @param {{key: string?, ctrl: boolean?, shift: boolean?, alt: boolean?, ignore: boolean?}} [mods={}]
   */
  modify(mods = {}) {
    mods ??= {};
    this.#original ??= this.shortcut;
    this.shortcut = new ModifiedKey(
      mods.key ?? this.shortcut.key,
      mods.ctrl ?? this.shortcut.ctrl,
      mods.shift ?? this.shortcut.shift,
      mods.alt ?? this.shortcut.alt,
      mods.ignore ?? this.shortcut.ignore
    );
  }
  /**Resets this keybind to its original value. */
  restore() {
    this.shortcut = this.#original;
  }
}

/** Defines a _control_: that is, a keybind that fires repeatedly until released. */
class HeldControlBinding extends ShortcutBinding {
  #event_hold;
  constructor(
    key,
    mods = { ctrl: false, shift: false, alt: false, ignore: false },
    events = { press: null, hold: null, release: null }
  ) {
    super(key, mods, events);
    this.#event_hold = events.hold;
  }
  tick() {
    if (this.down && this.#event_hold) void this.#event_hold();
  }
}

/** Deals with a whole collection of keybinds. */
class KeybindHandler {
  /** @type {Map<string, ShortcutBinding>} */
  #scuts = new Map();
  #ctrl = Object.freeze({
    /** Creates and connects a new control binding with no modifiers, and only a hold event.
     * @param {{ press: () => void, hold: () => void, release: () => void }} events
     */
    simple: (name, key, event) => {
      this.#scuts.set(name, new HeldControlBinding(key, { ignore: true }, { hold: event }));
    },
    /** Creates and connects a new control binding.
     * @param {{ press: () => void, hold: () => void, release: () => void }} events
     */
    advanced: (
      name,
      key,
      mods = { ctrl: false, shift: false, alt: false, ignore: false },
      events
    ) => {
      this.#scuts.set(name, new HeldControlBinding(key, mods, events));
    },
  });
  #shct = Object.freeze({
    /** Creates and connects a new shortcut binding with no modifiers, and only a keydown event.
     * @param {{ press: () => void, hold: () => void, release: () => void }} events
     */
    simple: (name, key, event) => {
      this.#scuts.set(name, new HeldControlBinding(key, { ignore: true }, { press: event }));
    },
    /** Creates and connects a new shortcut binding.
     * @param {{ press: () => void, hold: () => void, release: () => void }} events
     */
    advanced: (
      name,
      key,
      mods = { ctrl: false, shift: false, alt: false, ignore: false },
      events
    ) => {
      this.#scuts.set(name, new ShortcutBinding(key, mods, events));
    },
  });
  /**@readonly */
  get control() {
    return this.#ctrl;
  }
  /**@readonly */
  get shortcut() {
    return this.#shct;
  }

  /** Changes a binding's settings. Won't change name or event.
   * @param {{key: string?, ctrl: boolean?, shift: boolean?, alt: boolean?}} [mods={}]
   */
  modify(name, mods = {}) {
    let binding = this.#scuts.get(name);
    binding.modify(mods);
  }
  /**Resets the specified keybind to its original value. */
  restore(name) {
    let binding = this.#scuts.get(name);
    binding.restore();
  }
  /** Removes (all) functionality from a shortcut. */
  disconnect(name) {
    this.#scuts.delete(name);
  }
  /** Disconnects all shortcuts. */
  kill() {
    this.#scuts.clear();
  }
  /** Force-fires the specified keybind.
   * @returns `true` if it fired, `false` if not.
   */
  fire(name) {
    let b = this.#scuts.get(name);
    return !b || !b.fire();
  }
  /**
   * Fires the right event for whatever you put in here. Uses normal `KeyboardEvent`s.
   * @param {KeyboardEvent} ev
   */
  event(ev, isRelease = false) {
    if (isRelease) return this.up(ev.code);
    else return this.down(ev.code, ev.ctrlKey, ev.shiftKey, ev.altKey);
  }
  #simplify(key) {
    return key.replace("Key", "").replace("Digit", "");
  }
  /** Fires connected events for each keybind matching the passed in key and modifiers.
   * @returns `true` if some event fired, `false` if not.
   */
  down(key, ctrl = false, shift = false, alt = false) {
    key = this.#simplify(key);
    let fired = false;
    // console.log(`firing [${key}:${(ctrl ? "c" : "") + (shift ? "s" : "") + (alt ? "a" : "")}]`);
    this.#scuts.forEach((binding, name) => {
      if (binding.shortcut.active(key, ctrl, shift, alt)) {
        binding.fire();
        // console.log(`activated ${name}`);
        fired = true;
      }
    });
    // if (!fired) console.log(`no result`);
    return fired;
  }
  /**
   * Notifies each keybind matching the passed in key that it has been released. Only useful for controls, not shortcuts.
   * @returns `true` if some event fired, `false` if not.
   */
  up(key) {
    key = this.#simplify(key);
    // console.log(`unfiring [${key}:*]`);
    this.#scuts.forEach((binding, name) => {
      if (binding.shortcut.key === key) {
        binding.unfire();
        // console.log(`deactivated ${name}`);
      }
    });
  }
  /**
   * Updates each keybind. Still only useful for controls, not shortcuts.
   */
  tick() {
    this.#scuts.forEach((x) => x.tick());
  }
  /** Returns the key and modifiers associated with the specified binding, presented in human-readable format. */
  describe(name) {
    let b = this.#scuts.get(name)?.shortcut;
    return b
      ? `${b.ctrl ? "Ctrl + " : ""}${b.shift ? "Shitf + " : ""}${b.alt ? "Alt + " : ""}${b.key}`
      : undefined;
  }
  /** Returns the key name associated with the specified binding. */
  key(name) {
    let b = this.#scuts.get(name)?.shortcut;
    return b?.key;
  }
  /** Returns whether or not the specified binding requires the `ctrl` key to be held. */
  ctrl(name) {
    let b = this.#scuts.get(name)?.shortcut;
    return b?.ctrl;
  }
  /** Returns whether or not the specified binding requires the `shift` key to be held. */
  shift(name) {
    let b = this.#scuts.get(name)?.shortcut;
    return b?.shift;
  }
  /** Returns whether or not the specified binding requires the `alt` key to be held. */
  alt(name) {
    let b = this.#scuts.get(name)?.shortcut;
    return b?.alt;
  }
  /** Returns the key and modifiers associated with the specified binding, as a `ModifiedKey` object. */
  descriptor(name) {
    let b = this.#scuts.get(name)?.shortcut;
    return b;
  }
  get all() {
    return [...this.#scuts.keys()];
  }
}
