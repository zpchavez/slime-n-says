import getControls from '../controls';
import WhiteKey from './WhiteKey';
import BlackKey from './BlackKey';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const sharps = ['C', 'D', 'F', 'G', 'A'];
const controlMap = {
  C4: 'A',
  Cs4: 'W',
  D4: 'S',
  Ds4: 'E',
  E4: 'D',
  F4: 'F',
  Fs4: 'T',
  G4: 'G',
  Gs4: 'Y',
  A4: 'H',
  As4: 'U',
  B4: 'J',
  C5: 'K'
};

class Keyboard
{
  constructor(g) {
    this.g = g;
    this.initControls();
    this.drawKeys();
  }

  initControls() {
    this.controls = getControls(this.g);
    notes.forEach(note => {
      this.controls[`${note}4`].press = () => this.playNote(note, 4);
      if (sharps.indexOf(note) > -1) {
        this.controls[`${note}s4`].press = () => this.playNote(`${note}#`, 4);
      }
    })
    this.controls.C5.press = () => this.playNote('C', 5);
    this.controls.confirm.press = () => console.log('confirmed');
  }

  playNote(note, octave) {
    window.Synth.play(0, note, octave-1);
  }

  drawKeys() {
    this.keys = {};

    notes.forEach((n, i) => {
      const note = `${n}4`
      this.keys[note] = new WhiteKey(this.g, i, controlMap[note]);
    })
    this.keys[`C5`] = new WhiteKey(this.g, 7, controlMap['C5']);
    sharps.forEach((n, i) => {
      const note = `${n}s4`;
      this.keys[note] = new BlackKey(this.g, i, controlMap[note]);
    })
  }
}

export default Keyboard;