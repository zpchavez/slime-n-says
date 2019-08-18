import Keyboard from "../things/Keyboard";
import Slime from '../things/Slime';

export default (g) => {
  const keyboard = new Keyboard(g);
  const slime = new Slime(g);

  let melodyLength = 2;

  keyboard.setOnCorrectNote(() => {
    slime.jump();
  })

  keyboard.setOnMelodyPlayed(() => {
    melodyLength++;
    setTimeout(
      () => {
        keyboard.generateMelody(melodyLength);
      },
      2000
    );
  });

  keyboard.setOnStart(() => {
    keyboard.generateMelody(2)
  });

  return () => {
    keyboard.update();
    slime.update();
  };
}