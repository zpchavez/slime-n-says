const HIGHLIGHT_SECONDS = 0.25;
class Key
{
  constructor(g, index, controlKey) {
    this.g = g;
    this.highlightFrames = null;
    this.drawKey(index, controlKey)
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

  highlight() {
    this.sprite.fillStyle = 'blue';
    this.highlightFrames = HIGHLIGHT_SECONDS * this.g.fps;
  }

  update() {
    if (this.highlightFrames === 0) {
      this.sprite.fillStyle = this.getFillColor();
      this.highlightFrames = null;
    } else if (this.highlightFrames) {
      this.highlightFrames -= 1;
    }
  }
}

export default Key;