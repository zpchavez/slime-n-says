import getControls from '../controls';

class Keyboard
{
  constructor(g) {
    this.g = g;
    this.initControls()
  }

  initControls() {
    this.controls = getControls(this.g);
    let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    let sharps = ['C', 'D', 'F', 'G', 'A'];
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
    window.Synth.play(0, note, octave);
  }
}

export default Keyboard;