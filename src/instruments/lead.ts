import { BaseInstrument } from "../base-instrument";
import { EIGHTH, QUARTER, SIXTEENTH } from "../constants";
import { InstrumentProps } from "../types";

const instrumentProps: InstrumentProps = {
  gain: 0.2,
  oscillatorType: "sine",
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.4,
    release: 0.7,
  },
  notes: ["C4", "D4", "E4", "G4", "A4", null],
  durations: [QUARTER, EIGHTH, SIXTEENTH],
};

export const leadInstrument = new BaseInstrument(instrumentProps);
leadInstrument.startPart(["new", "use_0", "use_0", "new"]);
