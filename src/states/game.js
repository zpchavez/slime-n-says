import Keyboard from '../things/Keyboard';
import Hud from '../things/Hud';

export default (g) => {
  const keyboard = new Keyboard(g);
  const hud = new Hud(g);

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
  keyboard.setOnMelodyDone(() => {
    hud.setText('Play');
  });

  return () => {
    keyboard.update();
  };
}
