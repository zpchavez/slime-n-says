// Copy needed functions from plugins.js and paste them below
window.GA.custom = function(ga) {
  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  ga.randomPick = function(list) {
    return list[ga.randomInt(0, list.length - 1)];
  }
};
