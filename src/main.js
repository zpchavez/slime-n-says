require('../lib/ga.js');
require('../lib/custom.js');

import gameState from './states/game';

const ga = window.ga;

var g = ga(
  512,
  512,
  () => {
    g.canvas.style.border = "1px black dashed";
    g.canvas.style.display = "block";
    g.canvas.style.margin = "auto";
    g.backgroundColor = "white";
    g.state = gameState(g);
  }
);

g.start();
