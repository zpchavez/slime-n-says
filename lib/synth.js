import AudioSynth from './AudioSynth';

const Synth = new AudioSynth;

Synth.loadModulationFunction(
  function(i, sampleRate, frequency, x) { return 1 * Math.sin(2 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 1 * Math.sin(4 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 1 * Math.sin(8 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 1 * Math.sin(0.5 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 1 * Math.sin(0.25 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(2 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(4 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(8 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(0.5 * Math.PI * ((i / sampleRate) * frequency) + x); },
  function(i, sampleRate, frequency, x) { return 0.5 * Math.sin(0.25 * Math.PI * ((i / sampleRate) * frequency) + x); }
);

Synth.loadSoundProfile({
  name: 'piano',
  attack: function() { return 0.002; },
  dampen: function(sampleRate, frequency, volume) {
    return Math.pow(0.5*Math.log((frequency*volume)/sampleRate),2);
  },
  wave: function(i, sampleRate, frequency, volume) {
    var base = this.modulate[0];
    return this.modulate[1](
      i,
      sampleRate,
      frequency,
      Math.pow(base(i, sampleRate, frequency, 0), 2) +
        (0.75 * base(i, sampleRate, frequency, 0.25)) +
        (0.1 * base(i, sampleRate, frequency, 0.5))
    );
  }
});

export default Synth;