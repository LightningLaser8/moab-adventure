Registry.statuses.add(
  "burning",
  construct({
    type: "status-effect",
    damage: 0.09,
    damageType: "fire",
    vfx: "fire",
    vfxChance: 0.3,
  })
);
Registry.statuses.add(
  "ignited",
  construct({
    type: "status-effect",
    damage: 0.01,
    damageType: "fire",
    vfx: "fire",
    vfxChance: 0.025,
  })
);
Registry.statuses.add(
  "freezing",
  construct({
    type: "status-effect",
    speedMult: 0.75,
    healthMult: 0.85,
    damageMult: 0.9,
    resistanceMult: 0.6,
    vfx: "ice",
    vfxChance: 0.3,
  })
);
Registry.statuses.add(
  "cold",
  construct({
    type: "status-effect",
    speedMult: 0.98,
    healthMult: 0.995,
    damageMult: 0.985,
    resistanceMult: 0.92,
    vfx: "ice",
    vfxChance: 0.05,
  })
);
Registry.statuses.add(
  "irradiated",
  construct({
    type: "status-effect",
    speedMult: 0.975,
    healthMult: 0.975,
    damageMult: 0.975,
    resistanceMult: 0.975,
    vfx: "radiation",
  })
);

Registry.statuses.add(
  "red-polarity",
  construct({
    type: "status-effect",
    speedMult: 0.85,
    healthMult: 0.85,
    damageMult: 1.2,
    vfx: "red-polarity",
    vfxChance: 0.7,
  })
);
Registry.statuses.add(
  "blue-polarity",
  construct({
    type: "status-effect",
    speedMult: 1.3,
    healthMult: 1.3,
    vfx: "blue-polarity",
    vfxChance: 0.7,
    healing: 1
  })
);
