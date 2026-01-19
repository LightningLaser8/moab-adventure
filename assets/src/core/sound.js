// Fairly minimal 2-stage volume-controllable sound system

class SoundContainer {
  /** @type {AudioBuffer?} */
  #sound = null;
  /** @type {"weapons" | "entities" | "music" | "other"} */
  #category = "none";
  #path;
  /**
   * @param {string} path
   * @param {"weapons" | "entities" | "music" | "other"} category
   */
  constructor(path, category = "none") {
    this.#path = path;
    this.#category = category;
  }
  async load(ctx) {
    this.#sound = await ctx.load(this.#path);
    return this.#sound != null;
  }
  get sound() {
    return this.#sound;
  }
  get category() {
    return this.#category;
  }
}

class MASoundEngine {
  context = new AudioContext();
  volume = this.context.createGain();
  piecewiseVolume = {
    weapons: this.context.createGain(),
    entities: this.context.createGain(),
    music: this.context.createGain(),
    other: this.context.createGain(),
    bypass: this.context.createGain(),
  };
  muffler = this.context.createBiquadFilter();
  // parallel channels
  unprocessed = this.context.createGain();
  processed = this.context.createGain();
  /**@type {Registry?} */
  sounds = null;
  /** @type {Map<SoundContainer,AudioBufferSourceNode>} */
  #activeSounds = new Map();
  constructor() {
    this.piecewiseVolume.weapons.connect(this.volume);
    this.piecewiseVolume.entities.connect(this.volume);
    this.piecewiseVolume.music.connect(this.volume);
    this.piecewiseVolume.other.connect(this.volume);
    this.piecewiseVolume.bypass.connect(this.context.destination);
    this.volume.connect(this.unprocessed);
    this.volume.connect(this.processed);

    this.processed.connect(this.muffler);
    this.unprocessed.connect(this.context.destination);

    this.processed.gain.setValueAtTime(0, this.context.currentTime)

    this.muffler.connect(this.context.destination);
    this.muffler.type = 'lowpass';
    this.muffler.frequency.value = 800; // Reduce high frequencies (e.g., set to 800 Hz for a muffled sound)
    this.muffler.Q.value = 1; // Sharpness of the filter (1 is standard)
  }
  muffle(){
    this.unprocessed.gain.setValueAtTime(0, this.context.currentTime)
    this.processed.gain.setValueAtTime(1, this.context.currentTime)
  }
  unmuffle(){
    this.unprocessed.gain.setValueAtTime(1, this.context.currentTime)
    this.processed.gain.setValueAtTime(0, this.context.currentTime)
  }
  async load(path) {
    try {
      let file = await fetch(path);
      let buf = await file.arrayBuffer();
      let sound = await this.context.decodeAudioData(buf);
      console.log(`Loaded sound from ${path}`);
      return sound;
    } catch (e) {
      return null;
    }
  }
  /**
   * @param {SoundContainer | string} sound
   * @param {boolean} waitForEnd
   */
  play(sound, waitForEnd) {
    if (!sound) return;
    if (typeof sound === "string") sound = this.sounds.get(sound);
    // Now that it's a sound container, play it

    if (this.#activeSounds.has(sound)) {
      if (waitForEnd) return;
      else this.#activeSounds.get(sound).stop();
    }

    const bufnode = this.context.createBufferSource();
    bufnode.buffer = sound.sound;
    bufnode.connect(this.piecewiseVolume[sound.category] ?? this.piecewiseVolume.other);
    bufnode.onended = () => {
      bufnode.disconnect();
      this.#activeSounds.delete(sound);
    };
    bufnode.start(0);

    // Store the buffer node
    this.#activeSounds.set(sound, bufnode);
  }
  /**
   * @param {SoundContainer | string} sound
   */
  swap(sound, newsound, waitForEnd) {
    if (sound) {
      if (typeof sound === "string") sound = this.sounds.get(sound);
      if (this.#activeSounds.has(sound)) {
        this.dc(this.#activeSounds.get(sound));
        this.#activeSounds.delete(sound);
      }
    }
    if (newsound) {
      if (typeof newsound === "string") newsound = this.sounds.get(newsound);
      this.play(newsound, waitForEnd);
    }
  }
  /**
   * @param {SoundContainer | string} sound
   */
  playing(sound) {
    if (!sound) return false;
    if (typeof sound === "string") sound = this.sounds.get(sound);
    return this.#activeSounds.has(sound);
  }
  /**
   * @param {SoundContainer | string} sound
   */
  stop(sound) {
    if (!sound) return;
    //stop all
    if (sound === "*") {
      this.#activeSounds.forEach((b) => this.dc(b));
      this.#activeSounds.clear();
      return;
    }
    if (typeof sound === "string") sound = this.sounds.get(sound);

    const bufnode = this.#activeSounds.get(sound);
    if (bufnode) {
      this.dc(bufnode);
      this.#activeSounds.delete(sound);
    }
  }
  dc(bufnode) {
    try {
      bufnode.stop();
      bufnode.disconnect();
    } catch (e) {
      console.warn("Failed to stop sound " + sound + ":", e);
    }
  }
  commit() {
    this.sounds = new Registry();
    Registry.sounds.forEach((i, n) =>
      this.sounds.add(n, new SoundContainer(i.path, i.category ?? "other"))
    );
  }
  async loadAll() {
    let i = setTimeout(() => console.error("Timeout!"), 3000);
    await this.sounds.forEachAsync(async (name, item) => {
      if (!(await item.load(this))) console.error("Failed to load " + name);
    });
    clearTimeout(i);
  }
}

const SoundCTX = new MASoundEngine();
