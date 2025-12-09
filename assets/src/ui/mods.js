createUIComponent(["mods"], [], 960, 540, 1500, 900);

integrate(
  createUIComponent(["mods"], [], 960, 120, 1500, 75, "none", undefined, "Mods", false, 50)
);

createUIComponent(
  ["mods"],
  [],
  320,
  120,
  200,
  50,
  "none",
  () => {
    ui.menuState = "start-menu";
  },
  "*< Back",
  false,
  30
).isBackButton = true;

let testList = integrate(
  createListComponent(["mods"], [], 500, 625, 500, 650, "none", [
    new ListEntry("test"),
    new ListEntry("test"),
    new ListEntry("test"),
    new ListEntry("test"),
    new ListEntry("test"),
  ])
);
integrate(
  createUIComponent(["mods"], [], 500, 225, 500, 80, "none", undefined, "Current", false, 30)
);

const fetchMods = async (query) => {
  let res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(
      `${query} topic:moab-adventure topic:mod`
    )}&sort=stars`,
    { headers: { Accept: "application/vnd.github+json" } }
  );
  let json = await res.json();
  console.log(json.items);
};
