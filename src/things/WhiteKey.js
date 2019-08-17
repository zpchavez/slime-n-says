import colors from '../colors';

export const KEY_WIDTH = 40;
const KEY_HEIGHT = 150;

class WhiteKey
{
  constructor(g, index, controlKey) {
    this.g = g;
    this.drawKey(index, controlKey)
  }

  drawKey(index, controlKey)
  {
    this.sprite = this.g.rectangle(
      KEY_WIDTH,
      KEY_HEIGHT,
      colors.white,
      colors.black,
      2
    );
    this.sprite.x = 90 + (KEY_WIDTH * index);
    this.sprite.y = 310;

    this.g.text(
      controlKey,
      '12px monospace',
      colors.black,
      this.sprite.x + 15,
      this.sprite.y + KEY_HEIGHT - 20
    );
  }

  update() {

  }
}

export default WhiteKey;