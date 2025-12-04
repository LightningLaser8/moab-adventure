const ERROR_AP = new WeaponSlot();

/** Creates weapon slots from registry */
const selector2 = {
  option(slot) {
    return UIComponent.getCondition(`${slot}-slot`);
  },
  get(name) {
    let slot = Registry.slots.get(name);
    let option = this.option(name);
    // console.log("slot "+name+" is " + option);
    return slot.variations ? slot.variations[option] : slot;
  },
  ap(ap) {
    return this.slot(`ap${ap}`);
  },
  booster() {
    return this.slot("booster");
  },
  sp1() {
    return this.slot("sp1");
  },
  slot(name) {
    return new WeaponSlot(...this.get(name)?.upgrades ?? []);
  },

  /**utility to set slot choices */
  chooseAP(ap, val) {
    // console.log("setting "+`ap${ap}-slot:${val}`)
    UIComponent.setCondition(`ap${ap}-slot:${val}`);
  },
};
