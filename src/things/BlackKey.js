import AbstractKey from './AbstractKey';
import colors from '../colors';
import { KEY_WIDTH as WHITE_KEY_WIDTH } from './WhiteKey';

const KEY_WIDTH = 20;
const KEY_HEIGHT = 100;

class BlackKey extends AbstractKey
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
    return colors.black;
  }

  getStrokeColor() {
    return '#777777';
  }

  getKeyXPos(index) {
    let x = 100 + (KEY_WIDTH + WHITE_KEY_WIDTH * index);
    if (index > 1) {
      x += WHITE_KEY_WIDTH;
    }
    return x;
  }

  getKeyYPos() {
    return 310;
  }

  getLabelXPos() {
    return this.sprite.x + 7;
  }

  getTextColor() {
    return colors.white;
  }
}

export default BlackKey;