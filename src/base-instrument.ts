import * as Tone from "tone";
import {
  Bar,
  BarTypes,
  Durations,
  GetRandomNote,
  InstrumentProps,
  Note,
} from "./types";
import { getIndexFromString, getRandomElements, getRandomItem } from "./utils";
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
  public synth: Synth;
  private connectedEffects: any;
  private melodyPart: Part;
  private transport: TransportClass;
  private notes: (string | null)[];
  private durations: Durations;
  constructor(instrumentProps: InstrumentProps) {
    this.connectedEffects = []
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
///////////////////////////////MELODY//////////////////////////////////

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

  private generateBarsList = (barTypes: BarTypes[]) => {
    return barTypes.reduce((acc: Bar[], instruction: string) => {
      const bar =
        instruction == "new"
          ? this.generateRandomMelody(this.notes)
          : acc[getIndexFromString(instruction)];
      return [...acc, bar];
    }, []);
  };

/////////////////////////////////EFFECTS///////////////////////////////////

  public connectEffects = (effectsList: object[]) => {
    effectsList.push(this.gain);
    effectsList.reduce((chain: any, effect: object) => {
      console.log(`connecting ${chain} to ${effect}`);
      chain.connect(effect);
      this.connectedEffects.push(effect);
      return effect;
    }, this.synth);
  };

  public enableRandomEffects = (quantity: number) => {
    const effectsToEdit = this.connectedEffects.filter((item: any) => !(item instanceof Tone.Gain))
    effectsToEdit.forEach((effect: any)=>effect.set({ wet: 0 }))
    const randomEffects = getRandomElements<object>(effectsToEdit, quantity);
    console.log(`chosen effects: ${randomEffects}`);
    randomEffects.forEach((effect: any)=>effect.set({ wet: Math.random() }))
  };

  public disconnectAllEffects = () => {
    this.connectedEffects.forEach((effect: any) => {
      effect.disconnect();
    });
  };

  /////////////////////////////////SCHEDULES///////////////////////////////////

  public startPart = (barTypes: BarTypes[], effectsList: object[], effectsQuantity: number) => {
    let barsList: Bar[] = this.generateBarsList(barTypes);
    let barCounter = 0;
    this.connectEffects(effectsList)

    this.transport.scheduleRepeat(() => {
      this.updateCurrentPart(barsList[barCounter]);
      barCounter = barCounter >= barsList.length - 1 ? 0 : barCounter + 1;
    }, ONE_MEASURE);

    this.transport.scheduleRepeat(
      () => {
        barsList = this.generateBarsList(barTypes);
      },
      "8m",
      "8m"
    );

    this.transport.scheduleRepeat(
      () => {
        this.enableRandomEffects(effectsQuantity)
      },
      "8m",
    );
  };
}
