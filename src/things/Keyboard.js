import getControls from '../controls';
import WhiteKey from './WhiteKey';
import BlackKey from './BlackKey';

const naturals = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const sharps = ['C', 'D', 'F', 'G', 'A'];
const notes = [
  'C4', 'Cs4', 'D4', 'Ds4', 'E4', 'F4', 'Fs4', 'G4', 'Gs4', 'A4', 'As4', 'B4', 'C5'
];
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
    naturals.forEach(note => {
      this.controls[`${note}4`].press = () => this.playNote(note, 4);
      if (sharps.indexOf(note) > -1) {
        this.controls[`${note}s4`].press = () => this.playNote(`${note}s`, 4);
      }
    })
    this.controls.C5.press = () => this.playNote('C', 5);
    this.controls.confirm.press = () => console.log('confirmed');
  }

  playNote(note, octave) {
    window.Synth.play(0, note.replace('s', '#'), octave-1);
    this.keys[`${note}${octave}`].highlight();
  }

  generateMelody(noteCount) {
    const ionianSteps = [2, 2, 1, 2, 2, 2, 1];
    const getDiatonicIndices = (startingIndex) => {
      const indices = [startingIndex];
      ionianSteps.forEach(step => {
        indices.push((indices[indices.length - 1] + step) % 13)
      })
      return indices;
    }
    const keys = {};
    notes.forEach((note, i) => {
      if (note === 'C5') return;
      keys[note.replace('4', '')] = getDiatonicIndices(i);
    })
    const randomKey = this.g.randomPick(Object.keys(keys));
    const diatonicIndices = keys[randomKey];
    const diatonicNotes = notes.filter((n, i) => diatonicIndices.indexOf(i) > -1);
    // const firstNote = this.g.randomPick(diatonicNotes);

    for (let i = 0; i < noteCount; i += 1) {
      // const lastInterval =
    }
  }

  drawKeys() {
    this.keys = {};

    naturals.forEach((n, i) => {
      const note = `${n}4`
      this.keys[note] = new WhiteKey(this.g, i, controlMap[note]);
    })
    this.keys[`C5`] = new WhiteKey(this.g, 7, controlMap['C5']);
    sharps.forEach((n, i) => {
      const note = `${n}s4`;
      this.keys[note] = new BlackKey(this.g, i, controlMap[note]);
    })
  }

  update() {
    Object.keys(this.keys).forEach(k => {
      this.keys[k].update();
    })
  }
}

export default Keyboard;