import * as Tone from "tone";
import { Gain, Part, Synth } from "tone";
import { TransportClass } from "tone/build/esm/core/clock/Transport";
import { DEFAULT_BPM, ONE_MEASURE } from "./constants";
import { Bar, Durations, InstrumentProps } from "./types";

export class BaseInstrument {
  protected gain: Gain;
  public synth: Synth;
  protected connectedEffects: any;
  protected melodyPart: Part;
  protected transport: TransportClass;
  protected notes: (string | null)[];
  protected durations: Durations;
  constructor(instrumentProps: InstrumentProps) {
    this.connectedEffects = [];
    this.notes = instrumentProps.notes;
    this.durations = instrumentProps.durations;
    this.transport = Tone.getTransport();
    this.gain = new Tone.Gain(instrumentProps.gain).toDestination();
    this.synth = new Tone.Synth({
      oscillator: {
        type: instrumentProps.oscillatorType,
      },
      envelope: instrumentProps.envelope,
    });
    this.melodyPart = new Tone.Part((time, note) => {
      this.synth.triggerAttackRelease(note.note as string, note.duration, time);
    }, [] as Bar).start(0);
    this.melodyPart.loop = true;
    this.melodyPart.loopEnd = ONE_MEASURE;
    this.transport.bpm.value = DEFAULT_BPM;
  }
}
