import TextUtil from '../text-util';

class Hud
{
  constructor(g) {
    this.g = g;
    this.textUtil = new TextUtil(g);
  }

  setText(text) {
    if (this.text && this.text.content === text) {
      // Test is the same. No need to do anything.
      return;
    }
    if (this.text) {
      this.textUtil.clear();
    }
    this.text = this.textUtil.centeredText(text, 24, '#000000', 0);
  }
}

export default Hud;
