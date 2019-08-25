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
      this.g.remove(this.text);
    }
    this.text = this.textUtil.centeredText(text, 24, '#000000', 0);
    if (this.subText && this.subText.content !== subText) {
      this.g.remove(this.subText);
      this.subText = this.textUtil.centeredText(subText, 18, '#000000', 32);
    }
  }

  setFooterText(text) {
    if (this.footerText && this.footerText.content === text) {
      return;
    }
    if (this.footerText) {
      this.g.remove(this.footerText);
    }
    this.footerText = this.textUtil.centeredText(text, 18, '#000000', this.g.stage.height - 32);
  }
}

export default Hud;
