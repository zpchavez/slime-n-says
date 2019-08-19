import Keyboard from "../things/Keyboard";

export default (g) => {
  const keyboard = new Keyboard(g);

  let melodyLength = 2;

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
  };
}