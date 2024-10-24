import * as Tone from "tone";
import {
  Bar,
  BarTypes,
  Durations,
  GetRandomNote,
  InstrumentProps,
  Note,
} from "./types";
import { getIndexFromString, getRandomItem } from "./utils";
import {
  BAR_LENGTH,
  DEFAULT_BPM,
  EIGHTH,
  ONE_MEASURE,
  QUARTER,
  SIXTEENTH,
} from "./constants";
import { Gain, Part, Synth } from "tone";
import { TransportClass } from "tone/build/esm/core/clock/Transport";

export class BaseInstrument {
  private gain: Gain;
  private melodySynth: Synth;
  private melodyPart: Part;
  private transport: TransportClass;
  private notes: (string | null)[];
  private durations: Durations;
  constructor(instrumentProps: InstrumentProps) {
    this.notes = instrumentProps.notes;
    this.durations = instrumentProps.durations;
    this.transport = Tone.getTransport();
    this.gain = new Tone.Gain(instrumentProps.gain).toDestination();
    this.melodySynth = new Tone.Synth({
      oscillator: {
        type: instrumentProps.oscillatorType,
      },
      envelope: instrumentProps.envelope,
    }).connect(this.gain);

    this.melodyPart = new Tone.Part((time, note) => {
      this.melodySynth.triggerAttackRelease(
        note.note as string,
        note.duration,
        time
      );
    }, [] as Bar).start(0);

    this.melodyPart.loop = true;
    this.melodyPart.loopEnd = ONE_MEASURE;
    this.transport.bpm.value = DEFAULT_BPM;
  }

  private getRandomNote: GetRandomNote = (notes, time, duration) => {
    return {
      time: time,
      note: getRandomItem(notes),
      duration: duration,
    };
  };

  private generateRandomMelody = (notes: (string | null)[]) => {
    let newMelody: Bar = [];
    for (let noteStartTime = 0; noteStartTime <= BAR_LENGTH; ) {
      let currentTime = `0:${noteStartTime}`;
      const duration = getRandomItem(this.durations);
      newMelody.push(this.getRandomNote(notes, currentTime, duration));
      switch (duration) {
        case QUARTER:
          noteStartTime++;
          break;
        case EIGHTH:
          noteStartTime += 0.5;
          break;
        case SIXTEENTH:
          noteStartTime += 0.25;
          break;
      }
    }
    return newMelody;
  };

  private updateCurrentPart = (bar: Bar) => {
    this.melodyPart.clear();
    bar.forEach((note: Note) => {
      this.melodyPart.add(note);
    });
  };

  public constructBarsSequence = (barTypes: BarTypes[]) => {
    let barsList: Bar[] = [];
    barTypes.forEach((instruction: string) => {
      const bar =
        instruction == "new"
          ? this.generateRandomMelody(this.notes)
          : barsList[getIndexFromString(instruction)];
      barsList.push(bar);
    }, []);

    let barCounter = 0;
    Tone.Transport.scheduleRepeat(
      () => {
        this.updateCurrentPart(barsList[barCounter]);
        barCounter = barCounter >= barsList.length - 1 ? 0 : barCounter + 1;
      },
      ONE_MEASURE,
      "1"
    );
  };
}
