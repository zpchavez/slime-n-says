import Slime from './Slime';

class Key
{
  constructor(g, index, controlKey) {
    this.g = g;
    this.highlightFrames = null;
    this.drawKey(index, controlKey)
    this.initSlime();
  }

  /**
   * Abstracts
   *
   * getFillColor() {}
   * getStrokeColor() {}
   * getKeyXPos(index) {}
   * getKeyYPos() {}
   * getLabelXPos(index) {}
   * getLabelYPos() {}
   * getTextColor() {}
   * getWidth() {}
   * getHeight() {}
   */

  onCorrectNote(onDone=()=>{}) {
    this.slime.jump(() => {
      this.slime.improveMood();
      onDone()
    });
  }

  onMelodyNote() {
    this.slime.jump();
  }

  onWrongNote() {
    this.slime.shake(() => {
      this.slime.worsenMood();
    });
  }

  getLabelYPos() {
    return this.sprite.y + this.getHeight() - 20;
  }

  drawKey(index, controlKey)
  {
    this.sprite = this.g.rectangle(
      this.getWidth(),
      this.getHeight(),
      this.getFillColor(),
      this.getStrokeColor(),
      2
    );
    this.sprite.x = this.getKeyXPos(index);
    this.sprite.y = this.getKeyYPos();

    this.g.text(
      controlKey,
      '16px monospace',
      this.getTextColor(),
      this.getLabelXPos(),
      this.getLabelYPos()
    );
  }

  initSlime() {
    this.slime = new Slime(this.g, this.sprite);
    this.slime.sprite.y--;
  }

  highlight(color, time) {
    this.sprite.fillStyle = color;
    if (time) {
      this.highlightFrames = time * this.g.fps;
    }
  }

  update() {
    if (this.highlightFrames === 0) {
      this.sprite.fillStyle = this.getFillColor();
      this.highlightFrames = null;
    } else if (this.highlightFrames) {
      this.highlightFrames -= 1;
    }
    this.slime.update();
  }
}

export default Key;
