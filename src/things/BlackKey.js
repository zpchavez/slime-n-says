import colors from '../colors';
import { KEY_WIDTH as WHITE_KEY_WIDTH } from './WhiteKey';

const KEY_WIDTH = 20;
const KEY_HEIGHT = 100;

class BlackKey
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
      '#121212',
      '#000000',
      1
    );
    this.sprite.x = 100 + (KEY_WIDTH + WHITE_KEY_WIDTH * index);
    if (index > 1) {
      this.sprite.x += WHITE_KEY_WIDTH;
    }
    this.sprite.y = 310;

    this.g.text(
      controlKey,
      '12px monospace',
      colors.white,
      this.sprite.x + 7,
      this.sprite.y + KEY_HEIGHT - 20
    );
  }

  update() {

  }
}

export default BlackKey;