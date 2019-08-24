import TextUtil from '../text-util';

class Hud
{
  constructor(g) {
    this.g = g;
    this.textUtil = new TextUtil(g);
  }

  setText(text, subText=' ') {
    if (
      this.text && this.text.content === text &&
      this.subText && this.subText.content === subText
    ) {
      // Text is the same. No need to do anything.
      return;
    }
    if (this.text) {
      this.textUtil.clear();
    }
    this.text = this.textUtil.centeredText(text, 24, '#000000', 0);
    this.subText = this.textUtil.centeredText(subText, 18, '#000000', 32);
  }
}

export default Hud;
