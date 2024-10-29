import * as Tone from "tone";
import { BaseInstrument } from "../base-instrument";
import { EIGHTH, QUARTER, SIXTEENTH } from "../constants";
import { EffectsGenerator } from "../effects-generator";
import { MelodyGenerator } from "../melody-generator";
import { Scheduler } from "../schedulers";
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

const combinedClass = MelodyGenerator(
  EffectsGenerator(Scheduler(BaseInstrument))
);

const leadInstrument = new combinedClass(leadProps);
const distortion = new Tone.Distortion(0.5);
const reverb = new Tone.Reverb({
  decay: 5,
  preDelay: 0.01,
  wet: 1.0,
});
const pingPongDelay = new Tone.PingPongDelay("4n", 0.2);
const frequencyShifter = new Tone.FrequencyShifter(42);

leadInstrument.startPart(
  ["new", "use_0", "use_0", "new"],
  [distortion, reverb, pingPongDelay, frequencyShifter],
  2
);

export const bassInstrument = new combinedClass(bassProps);
const bassDistortion = new Tone.Distortion(0.5);
const bassFrequencyShifter = new Tone.FrequencyShifter(42);
bassInstrument.startPart(
  ["new", "new", "use_0", "new"],
  [bassDistortion, bassFrequencyShifter],
  1
);
