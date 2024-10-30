import * as Tone from "tone";
import { BaseInstrument } from "../base-instrument";
import { EIGHTH, QUARTER, SIXTEENTH } from "../constants";
import { InstrumentProps } from "../types";

const leadProps: InstrumentProps = {
  gain: 0.3,
  oscillatorType: "sine",
  envelope: {
    attack: 0.1,
    decay: 0.7,
    sustain: 0.2,
    release: 0.3,
  },
  notes: ["C4", "D4", "E4", "G4", "A4", null],
  durations: [QUARTER, EIGHTH, SIXTEENTH],
};

const bassProps: InstrumentProps = {
  gain: 0.9,
  oscillatorType: "sine",
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.4,
    release: 0.7,
  },
  notes: ["F2", "D2", "E2", "G2", "A2"],
  durations: [EIGHTH],
};

const leadInstrument = new BaseInstrument(leadProps);
const distortion = new Tone.Distortion(0.5);
const reverb = new Tone.Reverb({
  decay: 5,
  preDelay: 0.01,
  wet: 1.0,
});
const pingPongDelay = new Tone.PingPongDelay("4n", 0.2);
const frequencyShifter = new Tone.FrequencyShifter(42);
const stereoWidener = new Tone.StereoWidener(0.5)
const vibrato = new Tone.Vibrato(5, 0.1)
const autoWah = new Tone.AutoWah(50, 6, -30)
const phaser = new Tone.Phaser({
  frequency: 0.5,
  octaves: 3,
  baseFrequency: 350
})
const tremolo = new Tone.Tremolo(9, 0.75)
const bitCrusher = new Tone.BitCrusher(4)
const chorus = new Tone.Chorus(4, 2.5, 0.5)

leadInstrument.startPart(
  ["new", "use_0", "use_0", "new"],
  [distortion, reverb, pingPongDelay, frequencyShifter, stereoWidener, vibrato, autoWah],
  2
);

export const bassInstrument = new BaseInstrument(bassProps);
const bassDistortion = new Tone.Distortion(0.5);
const bassstereoWidener = new Tone.StereoWidener(0.5)
bassInstrument.startPart(
  ["new", "new", "use_0", "new"],
  [bassDistortion, bassstereoWidener],
  1
);

const peakMeasure = Tone.Time("1:0:0").toSeconds();
const holdDuration = Tone.Time("6:0:0").toSeconds();
const endMeasure = Tone.Time("8:0:0").toSeconds();
const MAX_GAIN = 0.8

leadInstrument.transport.scheduleRepeat((time) => {
  const gainParam = leadInstrument.gain.gain;
  console.log(gainParam.value)
  gainParam.setValueAtTime(0, time);
  gainParam.linearRampToValueAtTime(MAX_GAIN, time+peakMeasure);
  gainParam.setValueAtTime(MAX_GAIN, time + holdDuration); 
  gainParam.linearRampToValueAtTime(0, time+endMeasure);
}, "16m");
