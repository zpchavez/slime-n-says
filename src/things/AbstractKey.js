class Key
{
  constructor(g, index, controlKey) {
    this.g = g;
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
      '12px monospace',
      this.getTextColor(),
      this.getLabelXPos(),
      this.getLabelYPos()
    );
  }

  update() {

  }
}

export default Key;