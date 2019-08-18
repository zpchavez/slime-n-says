// Copy needed functions from plugins.js and paste them below
function internal_move(sprite) {
  sprite.x += sprite.vx | 0;
  sprite.y += sprite.vy | 0;
}
window.GA.custom = function(ga) {
  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  ga.randomPick = function(list) {
    return list[ga.randomInt(0, list.length - 1)];
  }

  ga.move = function(sprites) {
    if (sprites instanceof Array === false) {
      internal_move(sprites)
    } else {
      for (var i = 0; i < sprites.length; i++) {
        internal_move(sprites[i])
      }
    }
  };
};
