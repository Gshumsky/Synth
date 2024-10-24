import * as Tone from "tone";
import { BaseInstrument } from "../base-instrument";
import { EIGHTH, QUARTER, SIXTEENTH } from "../constants";
import { InstrumentProps } from "../types";

const leadProps: InstrumentProps = {
  gain: 0.2,
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

const secondLeadProps: InstrumentProps = {
  gain: 0.05,
  oscillatorType: "sine",
  envelope: {
    attack: 0.1,
    decay: 0.7,
    sustain: 0.2,
    release: 0.3,
  },
  notes: ["D5", "E5", "A5"],
  durations: [EIGHTH, SIXTEENTH],
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
  notes: ["F2", "D2", "E2", "G2", "A2", null],
  durations: [QUARTER, EIGHTH],
};

export const leadInstrument = new BaseInstrument(leadProps);
leadInstrument.startPart(["new", "use_0", "use_0", "new"]);

export const secondLeadInstrument = new BaseInstrument(secondLeadProps);
secondLeadInstrument.startPart(["new", "use_0", "use_0", "new"]);

export const bassInstrument = new BaseInstrument(bassProps);
bassInstrument.startPart(["new", "new", "use_0", "new"]);
