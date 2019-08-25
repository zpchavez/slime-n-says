import getControls from '../controls';
import WhiteKey from './WhiteKey';
import BlackKey from './BlackKey';
import Synth, { PIANO, OUT_OF_TUNE_PIANO } from '../../lib/synth';
import colors from '../colors';
import TextUtil from '../text-util';
import { lpad, rpad } from '../utils';
import Slime, { HAPPY, SAD, ANGRY } from './Slime'

const SHOW_ALL_NOTES = 0;
const SHOW_FIRST_NOTE = 1;
const modes = [SHOW_ALL_NOTES, SHOW_FIRST_NOTE];

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
  constructor(g, hud) {
    this.g = g;
    this.textUtil = new TextUtil(g);
    this.initControls();
    this.createKeys();
    this.initMidi();
    this.pauseUntilNotePlayed = false;
    this.lockedInput = false;
    this.onWinScreen = false;
    this.started = false;
    this.repeated = false;
    this.hud = hud;
    this.totalNotes = 0;
    this.correctNotes = 0;
    this.previousCorrectNotes = 0;
    this.level = 1;
    this.subLevel = 1;
    this.showMenu();
    this.resetScore();
  }

  resetScore() {
    this.score = {
      [HAPPY]: 0,
      [SAD]: 0,
      [ANGRY]: 0,
    };
    this.totalNotes = 0;
    this.correctNotes = 0;
  }

  initMidi() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(midiAccess => {
        for (var input of midiAccess.inputs.values()) {
          input.onmidimessage = (message) => {
            const NOTE_ON = 159;
            const startingNote = 60;
            if (
              message.data[0] === NOTE_ON &&
              message.data[1] >= startingNote
              && message.data[1] < (startingNote + 13)
            ) {
              const noteIndex = message.data[1] - startingNote;
              const noteParts = notes[noteIndex].match(/^(\D+)(\d)$/);
              this.playNoteAsPlayer(noteParts[1], noteParts[2]);
            }
          }
        }
      });
    }
  }

  showMenu() {
    this.hud.setText('Select Mode');
    this.menuTexts = this.textUtil.centeredTexts(
      [
        'Show All Notes  (Easier)',
        'Show First Note (Harder)',
      ],
      18,
      colors.black,
      40,
      32,
    );
    this.cursor = new Slime(this.g);
    this.cursor.setMood(HAPPY);
    this.cursor.sprite.y = this.menuTexts[0].y;
    this.cursor.sprite.x = this.menuTexts[0].x - 24;
    this.selectedMode = SHOW_ALL_NOTES;
  }

  start() {
    this.started = true;
    this.g.remove(this.menuTexts);
    this.g.remove(this.cursor.sprite);
    this.startTime = new Date();
    this.melodyLength = 2;
    this.startRound();
    this.hud.setFooterText('Level 1-1');
  }

  reset() {
    this.g.remove(this.texts);
    this.g.remove(this.slimes.map(slime => slime.sprite));
    this.texts = [];
    this.slimes = [];
    this.started = false;
    this.selectedMode = SHOW_ALL_NOTES;
    this.onWinScreen = false;
    this.hud.setFooterText(' ');
    this.resetScore();
    this.resetSlimes();
    this.showSlimes();
    this.showMenu();
  }

  startRound() {
    this.hud.setText('Listen');
    this.resetSlimes();
    this.previousCorrectNotes = this.correctNotes;
    this.generateMelody();
  }

  showResults() {
    let roundScore = 0;
    this.lockedInput = true;
    Object.keys(this.keys).forEach(key => {
      roundScore += this.keys[key].slime.mood;
      this.score[this.keys[key].slime.mood]++;
    });
    if (this.correctNotes - this.previousCorrectNotes === this.melodyLength) {
      this.hud.setText('Perfect!');
    } else if (roundScore === 0) {
      this.hud.setText('Acceptable');
    } else if (roundScore > 0) {
      this.hud.setText('Nice!')
    } else {
      const messages = [
        `Slimes don't want to play anymore`,
        `Slimes have lost the music in their hearts`,
        `Slimes just remembered they have a thing`,
        `Slimes are kicking you out of the band`,
      ]
      this.hud.setText('Game Over', this.g.randomPick(messages));
      this.started = false;
    }

    if (roundScore >= 0) {
      if (this.subLevel === 8 && this.level === 3) {
        this.showWinScreen();
      } else {
        if (this.subLevel < 8) {
          this.subLevel++;
        } else {
          this.level++;
          this.subLevel = 1;
        }

        setTimeout(() => {
          this.startRound();
          this.hud.setFooterText(`Level ${this.level}-${this.subLevel}`);
        }, 2000);
      }
    }
  }

  showWinScreen() {
    this.hud.setText('Winner!');
    this.endTime = new Date();
    this.hideSlimes();
    const rate = (this.correctNotes / this.totalNotes) * 100;
    const time = (this.endTime.getTime() - this.startTime.getTime())/1000;
    const minutes = Math.floor(time / 60).toString();
    const seconds = (time % 60).toFixed(3);
    this.texts = this.textUtil.centeredTexts(
      [
        rpad('Mode', 16) + (this.selectedMode === SHOW_ALL_NOTES ? 'All notes' : 'First note'),
        rpad('Correct Notes', 16) + `${rate.toFixed(2)}%`,
        rpad('Time', 16) + `${lpad(minutes, 2, '0')}:${lpad(seconds, 6, '0')}`,
        lpad(' '.toString(), 16) + lpad(this.score[HAPPY].toString(), 3),
        lpad(' '.toString(), 16) + lpad(this.score[SAD].toString(), 3),
        lpad(' '.toString(), 16) + lpad(this.score[ANGRY].toString(), 3),
      ],
      18,
      colors.black,
      32,
      24
    );
    this.slimes = [
      new Slime(this.g),
      new Slime(this.g),
      new Slime(this.g)
    ];
    this.slimes[0].setMood(HAPPY);
    this.slimes[1].setMood(SAD);
    this.slimes[2].setMood(ANGRY);
    for (let i = 0; i < 3; i++) {
      this.slimes[i].sprite.y = this.texts[i+3].y;
      this.slimes[i].sprite.x = this.texts[i+3].x + 12;
    }
    this.onWinScreen = true;
  }

  toggleMode() {
    if (this.started) {
      return;
    }

    if (this.selectedMode === SHOW_ALL_NOTES) {
      this.selectedMode = SHOW_FIRST_NOTE;
    } else {
      this.selectedMode = SHOW_ALL_NOTES;
    }

    this.cursor.sprite.x = this.menuTexts[this.selectedMode].x - 24;
    this.cursor.sprite.y = this.menuTexts[this.selectedMode].y;
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
    this.controls.confirm.press = () => {
      if (this.onWinScreen) {
        this.reset();
      } else if (!this.started) {
        this.start();
      } else if (!this.repeated) {
        this.playMelody(this.melody.slice());
        this.repeated = true;
      }
    }
    this.controls.up.press = this.toggleMode.bind(this);
    this.controls.down.press = this.toggleMode.bind(this);
  }

  endRoundIfMelodyOver() {
    if (!this.lockedInput && this.melody.length === 0) {
      this.lockedInput = true;
      this.repeated = false;
      this.showResults();
      if (this.subLevel === 1) {
        this.melodyLength = 2;
      } else {
        this.melodyLength++;
      }
      return true;
    }
    return false;
  }

  playNoteAsPlayer(note, octave) {
    if (this.lockedInput) {
      return;
    }

    if (this.pauseUntilNotePlayed) {
      if (this.pauseUntilNotePlayed !== `${note}${octave}`) {
        return;
      }
      this.playNote(note, octave, colors.blue);
      this.pauseUntilNotePlayed = false;
      this.melody.shift();
      this.endRoundIfMelodyOver() || this.hud.setText('Continue');
    } else if (this.melody && this.melody.length) {
      const key = this.keys[`${note}${octave}`];
      if (this.melody[0] === `${note}${octave}`) {
        this.playNote(note, octave, colors.blue);
        this.melody.shift();
        key.onCorrectNote(this.endRoundIfMelodyOver.bind(this));
        this.correctNotes++;
        this.hud.setText('Play');
      } else {
        if (key.slime.mood !== ANGRY) {
          this.pauseUntilNotePlayed = this.melody[0];
          this.playNote(note, octave, colors.red, OUT_OF_TUNE_PIANO);

          // Show what correct note was
          const correctKey = this.keys[this.melody[0]];
          correctKey.highlight(colors.lightBlue);

          key.onWrongNote();
          this.hud.setText('Play correct note to continue');
        } else {
          // Once slime is angry, note cannot be played again (unless it's the right note)
          key.highlight(colors.red, 0.25);
          this.hud.setText('Slime is angry', 'Play another key');
        }
      }
    } else if (!this.pauseUntilNotePlayed) {
      this.playNote(note, octave, colors.blue);
    }
  }

  playNote(note, octave, highlightColor=null, instrument=PIANO) {
    Synth.play(instrument, note, octave - 1);
    if (highlightColor) {
      this.keys[`${note}${octave}`].highlight(highlightColor, 0.25);
    }
  }

  resetSlimes() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key].slime.resetMood();
    })
  }

  hideSlimes() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key].slime.sprite.visible = false;
    })
  }

  showSlimes() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key].slime.sprite.visible = true;
    })
  }

  generateMelody() {
    const scalesByLevel = {
      1: {
        Pentatonic: [2, 2, 3, 2],
        ['Whole Tone']: [2, 2, 2, 2, 2, 2],
      },
      2: {
        Major: [2, 2, 1, 2, 2, 2, 1],
        ['Jazz Minor']: [2, 1, 2, 2, 2, 2, 1],
        ['Harmonic Minor']: [2, 1, 2, 2, 1, 3, 1],
        ['Double Harmonic']: [1, 3, 1, 2, 1, 3, 1],
      },
      3: {
        Diminished: [1, 2, 1, 2, 1, 2, 1, 2],
        Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      }
    }
    const scales = scalesByLevel[this.level];
    const scaleName = this.g.randomPick(
      Object.keys(scales)
    );
    const scale = scales[scaleName];

    const getNoteIndices = (startingIndex) => {
      const indices = [startingIndex];
      scale.forEach((step, i) => {
        if (startingIndex > 0 && i === scale.length - 1) {
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
      keyCenters[note.replace('4', '')] = getNoteIndices(i);
    })
    const randomKey = this.g.randomPick(Object.keys(keyCenters));
    const diatonicIndices = keyCenters[randomKey];
    const diatonicNotes = notes.filter((n, i) => diatonicIndices.indexOf(i) > -1);

    const melody = [this.g.randomPick(diatonicNotes)];
    for (let i = 1; i < this.melodyLength; i += 1) {
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
        // Second note can be any diatonic note except for the unison
        melody.push(
          this.g.randomPick(
            diatonicNotes.filter(n => n !== melody[0])
          )
        );
      }
    }

    this.melody = melody.slice();
    // First key slime starts off happy
    this.keys[melody[0]].slime.setMood(HAPPY);
    this.playMelody(melody);
    this.totalNotes += this.melodyLength;
  }

  playMelody(melody) {
    this.lockedInput = true;
    if (melody.length) {
      const isFirstNote = melody.length === this.melodyLength;
      const noteAndOctave = melody.shift();
      if (this.selectedMode === SHOW_ALL_NOTES || isFirstNote) {
        this.keys[noteAndOctave].slime.jump();
      }
      const octave = noteAndOctave.charAt(noteAndOctave.length - 1);
      const note = noteAndOctave.replace(/\d/, '');
      this.playNote(
        note,
        octave,
        this.selectedMode === SHOW_FIRST_NOTE && !isFirstNote
          ? null
          : colors.lightBlue
      );

      // Go faster as there are more notes.
      const delay = 1000 - Math.min((this.melodyLength * 80), 800);
      window.setTimeout(() => {
        this.playMelody(melody);
      }, delay)
    } else {
      this.lockedInput = false;
      if (!this.repeated) {
        this.hud.setText('Enter to repeat or start playing');
      } else {
        this.hud.setText('Play');
      }
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
