require('../lib/ga.js');
require('../lib/custom.js');

import gameState from './states/game';
import { scale } from './config'

const ga = window.ga;

var g = ga(
  644 * scale,
  512 * scale,
  () => {
    g.canvas.style.display = "block";
    g.canvas.style.margin = "auto";
    g.backgroundColor = "white";
    g.state = gameState(g);
  },
  [
    "assets/neutral-slime.png",
    "assets/happy-slime.png",
    "assets/sad-slime.png",
    "assets/angry-slime.png",
  ]
);

g.start();
