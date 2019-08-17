// Copy needed functions from plugins.js and paste them below
ga.custom = function(ga) {
  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
};
