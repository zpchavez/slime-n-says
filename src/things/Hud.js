import TextUtil from '../text-util';

class Hud
{
  constructor(g) {
    this.g = g;
    this.textUtil = new TextUtil(g);
    // this.drawText();
  }

  setText(text) {
    if (this.text) {
      this.textUtil.clear();
    }
    this.text = this.textUtil.centeredText(text, 24, '#000000', 0);
    // this.drawText();
  }

  drawText() {
    // this.text = this.textUtil.centeredText(' ', 24, '#000000', 0);
    // this.text = this.g.text(
    //   'TEST',
    //   '24px monospace',
    //   '#000000',
    //   0,
    //   0
    // );
  }
}

export default Hud;
