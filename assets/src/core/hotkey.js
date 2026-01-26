/** Represents a key with optional modifiers. */
class ModifiedKey {
  key = "esc";
  ctrl = false;
  shift = false;
  alt = false;
  constructor(key, control = false, shift = false, alt = false) {
    this.key = key;
    this.ctrl = control;
    this.shift = shift;
    this.alt = alt;
    //console.log(`created [${key}:${(control ? "c" : "") + (shift ? "s" : "") + (alt ? "a" : "")}]`);
  }
  active(key, ctrl, shift, alt) {
    // console.log(
    //   `checking [${key}:${(ctrl ? "c" : "") + (shift ? "s" : "") + (alt ? "a" : "")}] against [${
    //     this.key
    //   }:${(this.ctrl ? "c" : "") + (this.shift ? "s" : "") + (this.alt ? "a" : "")}]`
    // );
    return this.key === key && this.ctrl === ctrl && this.shift === shift && this.alt === alt;
  }
}
/** Defines a _mousebind_: a mapping of a mouse button (optionally with modifiers) to an event. */
class Mousebind extends ModifiedKey {}

/** Defines a _shortcut_: that is, a keybind that fires once, when a key is pressed. */
class ShortcutBinding {
  static create(key, mods = { ctrl: false, shift: false, alt: false }, event) {
    let b = new this();
    b.shortcut = new ModifiedKey("" + key, mods.ctrl, mods.shift, mods.alt);
    b.event = event;
    return b;
  }
  /** @type {ModifiedKey?} */
  shortcut = null;
  /** @type {() => void} */
  event = () => undefined;
  fire() {
    void this.event();
  }
  unfire() {}
  tick() {}
  /**@type {ModifiedKey} */
  #original;
  /** Changes a binding's settings. Won't change name or event.
   * @param {{key: string?, ctrl: boolean?, shift: boolean?, alt: boolean?}} [mods={}]
   */
  modify(mods = {}) {
    mods ??= {};
    this.#original = this.shortcut;
    this.shortcut = new ModifiedKey(
      mods.key ?? this.shortcut.key,
      mods.ctrl ?? this.shortcut.ctrl,
      mods.shift ?? this.shortcut.shift,
      mods.alt ?? this.shortcut.alt
    );
  }
  /**Resets this keybind to its original value. */
  restore() {
    this.shortcut = this.#original;
  }
}

/** Defines a _control_: that is, a keybind that fires repeatedly until released. */
class HeldControlBinding extends ShortcutBinding {
  static create(key, mods = { ctrl: false, shift: false, alt: false }, event) {
    let b = new this();
    b.shortcut = new ModifiedKey("" + key, mods.ctrl, mods.shift, mods.alt);
    b.event = event;
    return b;
  }
  #held = false;
  fire() {
    this.#held = true;
  }
  unfire() {
    this.#held = false;
  }
  tick() {
    if (this.#held) void this.event();
  }
}

/** Deals with a whole collection of keybinds. */
class KeybindHandler {
  /** @type {Map<string, ShortcutBinding>} */
  #scuts = new Map();
  /** Creates and connects a new shortcut binding. */
  shortcut(name, key, mods = { ctrl: false, shift: false, alt: false }, event) {
    this.#scuts.set(name, ShortcutBinding.create(key, mods, event));
  }
  /** Creates and connects a new control binding. */
  control(name, key, mods = { ctrl: false, shift: false, alt: false }, event) {
    this.#scuts.set(name, HeldControlBinding.create(key, mods, event));
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
  /** Fires connected events for each keybind matching the passed in key and modifiers.
   * @returns `true` if some event fired, `false` if not.
   */
  down(key, ctrl = keyIsDown(17), shift = keyIsDown(16), alt = keyIsDown(18)) {
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
    this.#scuts.forEach((binding, name) => {
      if (binding.shortcut.key === key) {
        binding.unfire();
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
      : "None";
  }
  /** Returns the key associated with the specified binding. */
  key(name) {
    let b = this.#scuts.get(name)?.shortcut?.key;
    return b ? b.toUpperCase() : undefined;
  }
  /** Returns whether or not the specified binding requires the `ctrl` key to be held. */
  ctrl(name) {
    return this.#scuts.get(name)?.shortcut?.ctrl;
  }
  /** Returns whether or not the specified binding requires the `shift` key to be held. */
  shift(name) {
    return this.#scuts.get(name)?.shortcut?.shift;
  }
  /** Returns whether or not the specified binding requires the `alt` key to be held. */
  alt(name) {
    return this.#scuts.get(name)?.shortcut?.alt;
  }
  /** Returns the key and modifiers associated with the specified binding, as a `ModifiedKey` object. */
  descriptor(name) {
    return this.#scuts.get(name)?.shortcut;
  }
}
