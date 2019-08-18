import Keyboard from "../things/Keyboard";
import Slime from '../things/Slime';

export default (g) => {
  const keyboard = new Keyboard(g);
  const slime = new Slime(g);

  keyboard.setOnCorrectNote(() => {
    slime.jump();
  })

  return () => {
    keyboard.update();
    slime.update();
  };
}