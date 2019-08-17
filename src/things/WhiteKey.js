export const KEY_WIDTH = 40;
const KEY_HEIGHT = 150;

class WhiteKey
{
  constructor(g, index) {
    this.g = g;
    this.drawKey(index)
  }

  drawKey(index)
  {
    this.sprite = this.g.rectangle(
      KEY_WIDTH,
      KEY_HEIGHT,
      '#FFFFFF',
      '#000000',
      2
    );
    this.sprite.x = 90 + (KEY_WIDTH * index);
    this.sprite.y = 310;
  }

  update() {

  }
}

export default WhiteKey;