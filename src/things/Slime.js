import colors from '../colors';

class Slime
{
  constructor(g) {
    this.g = g;
    this.drawSprite();
    this.jumping = false;
  }

  drawSprite() {
    this.sprite = this.g.rectangle(
      16,
      16,
      colors.green,
      colors.black
    );

    this.sprite.y = 193;
    this.sprite.x = 30;
  }

  jump() {
    if (!this.jumping && !this.falling) {
      this.jumping = true;
      this.sprite.vy = -5;
      this.jumpFrames = 0.2 * this.g.fps;
    }
  }

  update() {
    if (this.jumping) {
      if (this.jumpFrames === 0) {
        this.jumping = false;
        this.falling = true;
        this.sprite.vy = 10;
        this.fallFrames = 0.1 * this.g.fps;
      } else {
        this.jumpFrames -= 1;
      }
    }
    if (this.falling) {
      if (this.fallFrames === 0) {
        this.falling = false;
        this.sprite.vy = 0;
      } else {
        this.fallFrames -= 1;
      }
    }
    this.g.move(this.sprite);
  }
}

export default Slime;