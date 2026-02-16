Registry.worlds.add("ocean-skies", {
  name: "Ocean Skies",
  bgm: "sky-high",
  background: "background.sea",
  spawning: [
    {
      entity: "wooden-box",
      interval: 90,
      isHighTier: false,
      imposMode: "when-off",
    },
    {
      entity: "hardwood-box",
      interval: 90,
      isHighTier: false,
      imposMode: "when-on",
    },
    {
      entity: "metal-box",
      interval: 320,
      isHighTier: true,
      imposMode: "when-off",
    },
    {
      entity: "robox",
      interval: 640,
      isHighTier: true,
      imposMode: "when-on",
    },
  ],
  bosses: [
    "gigantic-box",
    "monkey-ace",
    "super-monkey",
    "gigantic-box",
    "monkey-ace",
    "super-monkey",
    "gigantic-box",
    "monkey-ace",
    "super-monkey",
    "robo-monkey",
  ],
});
Registry.worlds.add("workshop", {
  name: "Workshop",
  bgm: "deconstruction",
  background: "background.conveyor",
  spawning: [
    {
      entity: "metal-box",
      interval: 100,
      isHighTier: false,
    },
    {
      entity: "wooden-box",
      interval: 300,
      isHighTier: false,
    },
  ],
});
