class AudioSynthInstrument {
  constructor() {
    this._encapsulated = false;
  }

  __init__(parent, name, soundID) {
    if (!this._encapsulated) {
      throw new Error('AudioSynthInstrument can only be instantiated from the createInstrument method of the AudioSynth object.');
    }
    this._parent = parent;
    this._name = name;
    this._soundID = soundID;
  }

  play(note, octave, duration) {
    return this._parent.play(this._soundID, note, octave, duration);
  }

  generate(note, octave, duration) {
    return this._parent.generate(this._soundID, note, octave, duration);
  }
}

export default AudioSynthInstrument;