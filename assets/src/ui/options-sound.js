//    Sound options menu 'options.sound'
createUIComponent(
  ["options.sound"],
  [],
  960,
  120,
  1500,
  75,
  "none",
  undefined,
  "Sound Options",
  false,
  50
);
createUIComponent(
  ["options.sound"],
  [],
  320,
  122,
  200,
  50,
  "none",
  () => {
    saveCachedOptions();
    ui.menuState = "options";
  },
  "*< Back",
  false,
  30
).isBackButton = true;

//Volume sliders
createUIComponent(["options.sound"], [], 385, 235, 0, 0, "none", null, "Volume", false, 30);
SoundCTX.volume.gain.setValueAtTime(0.5, 0);
let volBar = createSliderComponent(
  ["options.sound"],
  [],
  400,
  300,
  300,
  1100,
  60,
  "both",
  "Master",
  false,
  30,
  (value) => {
    ui.volume = value;
    SoundCTX.volume.gain.setValueAtTime(value / 100, 0);
  },
  0,
  100
);
SoundCTX.piecewiseVolume.entities.gain.setValueAtTime(0.5, 0);
let eVolBar = createSliderComponent(
  ["options.sound"],
  [],
  375,
  400,
  250,
  425,
  60,
  "both",
  "Entities",
  false,
  20,
  (value) => {
    ui.piecewiseVolume.entities = value;
    SoundCTX.piecewiseVolume.entities.gain.setValueAtTime(value / 200, 0);
  },
  0,
  100,
  100
);
let wVolBar = createSliderComponent(
  ["options.sound"],
  [],
  1100,
  400,
  250,
  425,
  60,
  "both",
  "Weapons",
  false,
  20,
  (value) => {
    ui.piecewiseVolume.weapons = value;
    SoundCTX.piecewiseVolume.weapons.gain.setValueAtTime(value / 100, 0);
  },
  0,
  100,
  100
);
let mVolBar = createSliderComponent(
  ["options.sound"],
  [],
  375,
  500,
  250,
  425,
  60,
  "both",
  "Music",
  false,
  20,
  (value) => {
    ui.piecewiseVolume.music = value;
    SoundCTX.piecewiseVolume.music.gain.setValueAtTime(value / 100, 0);
  },
  0,
  100,
  100
);
let oVolBar = createSliderComponent(
  ["options.sound"],
  [],
  1100,
  500,
  250,
  425,
  60,
  "both",
  "Other",
  false,
  20,
  (value) => {
    ui.piecewiseVolume.other = value;
    SoundCTX.piecewiseVolume.other.gain.setValueAtTime(value / 100, 0);
  },
  0,
  100,
  100
);
createGamePropertySelector(
  ["options.sound"],
  [],
  250,
  650,
  100,
  400,
  60,
  "music",
  [true, false],
  0,
  ["Enabled", "Disabled"],
  40
);

function recenterBars() {
  volBar._current = ui.volume;
  SoundCTX.volume.gain.setValueAtTime(ui.volume / 100, 0);

  eVolBar._current = ui.piecewiseVolume.entities;
  SoundCTX.piecewiseVolume.entities.gain.setValueAtTime(ui.entities / 100, 0);

  mVolBar._current = ui.piecewiseVolume.music;
  SoundCTX.piecewiseVolume.music.gain.setValueAtTime(ui.music / 100, 0);

  wVolBar._current = ui.piecewiseVolume.weapons;
  SoundCTX.piecewiseVolume.weapons.gain.setValueAtTime(ui.weapons / 100, 0);

  oVolBar._current = ui.piecewiseVolume.other;
  SoundCTX.piecewiseVolume.other.gain.setValueAtTime(ui.other / 100, 0);
}
