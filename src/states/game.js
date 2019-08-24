import Keyboard from '../things/Keyboard';
import Hud from '../things/Hud';

export default (g) => {
  const hud = new Hud(g);
  const keyboard = new Keyboard(g, hud);
  return () => {
    keyboard.update();
  };
}
