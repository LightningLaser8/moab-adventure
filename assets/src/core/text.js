function wrapWords(input = "", maxChars = 100) {
  let lines = [];
  let words = input.split(/(?=\n)| /);
  let currentLine = "";
  //for each word index
  for (let index = 0; index < words.length; index++) {
    let word = words[index];
    // console.log(`> word '${word}'`);
    let nl = word.startsWith("\n");
    if (nl) word = word.substring(1);
    if (currentLine.length + word.length > maxChars || nl) {
      lines.push(currentLine);
      currentLine = "";
    }
    currentLine += word + " ";
  }
  lines.push(currentLine);
  return lines
    .filter((x) => x.length > 0)
    .map(x => x.trim())
    .join("\n")
    .trim();
}
