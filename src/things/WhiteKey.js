import colors from '../colors';
import AbstractKey from './AbstractKey';

export const KEY_WIDTH = 40;
const KEY_HEIGHT = 150;

class WhiteKey extends AbstractKey
{
  constructor(g, index, controlKey) {
    super(g, index, controlKey);
  }

  getWidth() {
    return KEY_WIDTH;
  }

  getHeight() {
    return KEY_HEIGHT;
  }

  getFillColor() {
    return colors.white;
  }

  getStrokeColor() {
    return colors.black;
  }

  getKeyXPos(index) {
    return 90 + (KEY_WIDTH * index);
  }

  getKeyYPos() {
    return 310;
  }

  getLabelXPos() {
    return this.sprite.x + 15;
  }

  getTextColor() {
    return colors.black;
  }

  update() {

  }
}

export default WhiteKey;