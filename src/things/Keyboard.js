import getControls from '../controls';
import WhiteKey from './WhiteKey';
import BlackKey from './BlackKey';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const sharps = ['C', 'D', 'F', 'G', 'A'];

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

    notes.forEach((note, i) => {
      this.keys[`${note}4`] = new WhiteKey(this.g, i);
    })
    this.keys[`C5`] = new WhiteKey(this.g, 7);
    sharps.forEach((note, i) => {
      this.keys[`${note}s4`] = new BlackKey(this.g, i);
    })
  }
}

export default Keyboard;