import getControls from '../controls';
import WhiteKey from './WhiteKey';
import BlackKey from './BlackKey';
import Synth from '../../lib/synth';
import colors from '../colors';

const naturals = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const sharps = ['C', 'D', 'F', 'G', 'A'];
const notes = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'
];
const controlMap = {
  C4: 'A',
  ['C#4']: 'W',
  D4: 'S',
  ['D#4']: 'E',
  E4: 'D',
  F4: 'F',
  ['F#4']: 'T',
  G4: 'G',
  ['G#4']: 'Y',
  A4: 'H',
  ['A#4']: 'U',
  B4: 'J',
  C5: 'K'
};

class Keyboard
{
  constructor(g) {
    this.g = g;
    this.initControls();
    this.createKeys();
    this.onCorrectNote = () => {};
    this.onWrongNote = () => {};
    this.onMelodyPlayed = () => {};
    this.onStart = () => {};
    this.lockedInput = true;
    this.started = false;
  }

  start() {
    this.started = true;
    this.onStart();
  }

  setOnStart(callback) {
    this.onStart = callback;
  }

  setOnCorrectNote(callback) {
    this.onCorrectNote = callback;
  }

  setOnWrongNote(callback) {
    this.onWrongNote = callback;
  }

  setOnMelodyPlayed(callback) {
    this.onMelodyPlayed = callback;
  }

  initControls() {
    this.controls = getControls(this.g);
    naturals.forEach(note => {
      this.controls[`${note}4`].press = () => this.playNoteAsPlayer(note, 4);
      if (sharps.indexOf(note) > -1) {
        this.controls[`${note}#4`].press = () => this.playNoteAsPlayer(`${note}#`, 4);
      }
    })
    this.controls.C5.press = () => this.playNoteAsPlayer('C', 5);
    this.controls.confirm.press = () => this.start();
  }

  playNoteAsPlayer(note, octave) {
    if (this.lockedInput) {
      return;
    }
    if (this.melody.length) {
      const key = this.keys[`${note}${octave}`];
      if (this.melody[0] === `${note}${octave}`) {
        this.playNote(note, octave, colors.blue);
        key.onCorrectNote();
        this.onCorrectNote();
        this.melody.shift();
      } else {
        this.playNote(note, octave, colors.red);
        // Show what correct note was
        key.onWrongNote();
        this.melody.shift();
        this.onWrongNote();
      }

      if (this.melody.length === 0) {
        this.lockedInput = true;
        this.onMelodyPlayed();
      }
    } else {
      this.playNote(note, octave, colors.blue);
    }
  }

  playNote(note, octave, highlightColor=null) {
    Synth.play(0, note, octave - 1);
    if (highlightColor) {
      this.keys[`${note}${octave}`].highlight(highlightColor);
    }
  }

  generateMelody(noteCount) {
    const ionianSteps = [2, 2, 1, 2, 2, 2, 1];
    const getDiatonicIndices = (startingIndex) => {
      const indices = [startingIndex];
      ionianSteps.forEach((step, i) => {
        if (startingIndex > 0 && i === ionianSteps.length - 1) {
          // Only C4 has an octave. Skip the last interval for the others.
          return;
        }
        let noteIndex = (indices[indices.length - 1] + step)
        if  (startingIndex > 0) {
          noteIndex %= 12;
        }
        indices.push(noteIndex);
      })
      return indices;
    }
    const keyCenters = {};
    notes.forEach((note, i) => {
      if (note === 'C5') return;
      keyCenters[note.replace('4', '')] = getDiatonicIndices(i);
    })
    const randomKey = this.g.randomPick(Object.keys(keyCenters));
    const diatonicIndices = keyCenters[randomKey];
    const diatonicNotes = notes.filter((n, i) => diatonicIndices.indexOf(i) > -1);

    const melody = [this.g.randomPick(diatonicNotes)];
    for (let i = 1; i < noteCount; i += 1) {
      if (melody.length > 1) {
        const previousNote = melody[melody.length - 1];
        const nextPreviousNote = melody[melody.length - 2];
        const previousInterval = (
          Math.max(
            notes.indexOf(previousNote),
            notes.indexOf(nextPreviousNote)
          ) -
          Math.min(
            notes.indexOf(previousNote),
            notes.indexOf(nextPreviousNote)
          )
        );
        const availableAscending = diatonicNotes.filter((n, i) => i > diatonicNotes.indexOf(previousNote));
        const availableDescending = diatonicNotes.filter((n, i) => i < diatonicNotes.indexOf(previousNote));

        const directionChoices = {};
        if (availableAscending.length) {
          directionChoices.asc = availableAscending;
        }
        if (availableDescending.length) {
          directionChoices.desc = availableDescending;
        }
        const direction = this.g.randomPick(Object.keys(directionChoices));
        const choices = directionChoices[direction];

        if (previousInterval < 5) {
          // If previous interval was small, allow a bigger one
          melody.push(this.g.randomPick(choices));
        } else {
          // Move step wise if previous interval was a big leap
          if (direction === 'asc') {
            melody.push(choices[0]);
          } else {
            melody.push(choices[choices.length - 1]);
          }
        }
      } else {
        // If first note, can choose any diatonic note next
        melody.push(this.g.randomPick(diatonicNotes));
      }
    }

    this.melody = melody.slice();
    this.playMelody(melody);
  }

  playMelody(melody) {
    this.lockedInput = true;
    if (melody.length) {
      const noteAndOctave = melody.shift();
      const octave = noteAndOctave.charAt(noteAndOctave.length - 1);
      const note = noteAndOctave.replace(/\d/, '');
      this.playNote(note, octave, colors.green);
      window.setTimeout(() => {
        this.playMelody(melody);
      }, 1000)
    } else {
      this.lockedInput = false;
    }
  }

  createKeys() {
    this.keys = {};

    naturals.forEach((n, i) => {
      const note = `${n}4`
      this.keys[note] = new WhiteKey(this.g, i, controlMap[note]);
    })
    this.keys[`C5`] = new WhiteKey(this.g, 7, controlMap['C5']);
    sharps.forEach((n, i) => {
      const note = `${n}#4`;
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