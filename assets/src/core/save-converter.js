function convertSave(save, from = 0, to = CURRENT_SAVE_FORMAT_VERSION) {
  console.log(`converting ${from} -> ${to}`);
  let s = structuredClone(save);
  for (let v = from; v < to; v++) cnv[`v${v}_v${v + 1}`](s);
  return s;
}

const cnv = {
  v0_v1(save) {
    console.log("step 0 -> 1");
    let c = {};
    [1, 2, "3/4", 5].forEach((sl, i) => (c[sl] = (save.choices ?? [1, 1, 1, 1])[i] ?? 1));
    c[3] = c["3/4"];
    c[4] = c["3/4"];
    save.choices = [1, 2, 3, 4, 5].map((s) => +c[s]);
    save.saveFormatVersion = 1;
  },
};
