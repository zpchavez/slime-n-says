import Keyboard from '../things/Keyboard';
import Hud from '../things/Hud';

export default (g) => {
  const hud = new Hud(g);
  const keyboard = new Keyboard(g, hud);

  let melodyLength = 2;

  const generateMelody = () => {
    hud.setText('Listen');
    keyboard.resetSlimes();
    keyboard.generateMelody(melodyLength);
  }

  keyboard.setOnPlayerDone(() => {
    melodyLength++;
    setTimeout(
      generateMelody,
      2000
    );
  });

  keyboard.setOnStart(generateMelody);

  return () => {
    keyboard.update();
  };
}
