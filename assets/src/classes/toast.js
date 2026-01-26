class Toast {
  totalTime = 0;
  timeLeft = 0;
  /**
   * Make a toast. (i.e. popup notification)
   * You can only do this when p5 has already loaded.
   * @param {string} title Big text
   * @param {string} text Smaller subtext
   * @param {number} time How may frames this is out for (60fps)
   * @param {ToastStyle} styling What the toast looks like.
   */
  constructor(
    title = "Boo!",
    text = "You have a notification.",
    time = 240,
    styling = ToastStyle.plain,
  ) {
    this.title = wrapWords(title, 10);
    this.text = wrapWords(text, 25);
    this.totalTime = this.timeLeft = time;
    this.style = styling;
    this.titleLines = this.title.split("\n").length;
    this.textLines = this.text.split("\n").length;
    push();
    noStroke();
    textFont(fonts.ocr);
    textSize(40);
    this.titleWidth = textWidth(this.title);
    textSize(30);
    this.textWidth = textWidth(this.text) + 20;
    pop();
  }
}

class ToastStyle {
  backgroundColour = [100];
  outlineColour = [50];
  subtextColour = [50];
  titleColour = [50];
  /**@readonly */
  static get plain() {
    return construct({}, ToastStyle);
  }
  /**@readonly */
  static get progress() {
    return construct({ titleColour: [20, 160, 220] }, ToastStyle);
  }
  /**@readonly */
  static get achievement() {
    return construct({ titleColour: [140, 70, 200] }, ToastStyle);
  }
  /**@readonly */
  static get ending() {
    return construct({ titleColour: [200, 100, 30] }, ToastStyle);
  }
  /**@readonly */
  static get bogus() {
    return construct({ titleColour: [170, 40, 40] }, ToastStyle);
  }
}

class ToastManager {
  /**@type {Toast[]} */
  active = [];
  tick() {
    for(const toast of this.active) {
      if (toast.timeLeft > 1) toast.timeLeft--;
    };
    this.active = this.active.filter((v) => v.timeLeft > 1);
  }
  draw() {
    let offy = 200;
    for(const toast of this.active) {
      let width = Math.max(toast.titleWidth, toast.textWidth),
        height = 20 + 30 * toast.textLines + 40 * toast.titleLines;

      let opacity = 255 - 4 * Math.max(0, 64 - toast.timeLeft);
      let offx =
        Math.min(1, (toast.timeLeft - 32) / 32) +
        Math.min(1, (toast.totalTime - toast.timeLeft - 8) / 8) -
        1;
      // console.log("width " + titlelen + " or " + textlen + ", chose " + width);
      // console.log("opacity " + opacity + ", off " + offx);
      push();
      fill(...toast.style.backgroundColour, opacity);
      stroke(...toast.style.outlineColour, opacity);
      strokeWeight(10);
      rect(1920 - offx * (width / 2 + 30), offy + height / 2, width + 60, height + 60);
      stroke(...toast.style.titleColour, opacity);
      rect(1920 - offx * (width / 2 + 30), offy + height / 2, width + 40, height + 40);
      strokeWeight(8);
      fill(...toast.style.outlineColour, opacity);
      textSize(40);
      textAlign(CENTER);
      text(toast.title, 1920 - offx * (width / 2 + 30), offy + 25);
      fill(...toast.style.subtextColour, opacity);
      noStroke();
      textSize(30);
      textAlign(LEFT, TOP);
      text(
        toast.text,
        1920 - width / 2 - 10 - offx * (width / 2 + 30),
        offy + 10 + 40 * toast.titleLines,
      );
      pop();
      offy += (height + 60) * Math.max(offx, 0);
    };
  }
  show(title, text, time, style) {
    this.active.push(new Toast(title, text, time, style));
  }
}

const toasts = new ToastManager();
