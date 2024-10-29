import { BaseInstrument } from "./base-instrument";
import { BAR_LENGTH, EIGHTH, QUARTER, SIXTEENTH } from "./constants";
import { Bar, BarTypes, GetRandomNote, Note } from "./types";
import { getIndexFromString, getRandomItem } from "./utils";

export function MelodyGenerator<
  TBase extends new (...args: any[]) => BaseInstrument,
>(Base: TBase) {
  return class extends Base {
    protected createMelodyPart = () => {};

    protected getRandomNote: GetRandomNote = (notes, time, duration) => {
      return {
        time: time,
        note: getRandomItem(notes),
        duration: duration,
      };
    };

    protected generateRandomMelody = (notes: (string | null)[]) => {
      let newMelody: Bar = [];
      for (let noteStartTime = 0; noteStartTime < BAR_LENGTH; ) {
        let currentTime = `0:${noteStartTime}`;
        const duration = getRandomItem(this.durations);
        newMelody.push(this.getRandomNote(notes, currentTime, duration));
        switch (duration) {
          case QUARTER:
            noteStartTime++;
            break;
          case EIGHTH:
            noteStartTime += 0.499;
            break;
          case SIXTEENTH:
            noteStartTime += 0.25;
            break;
        }
      }
      console.log(`Melody is ${newMelody}`);
      return newMelody;
    };

    protected updateCurrentPart = (bar: Bar) => {
      this.melodyPart.clear();
      bar.forEach((note: Note) => {
        this.melodyPart.add(note);
      });
    };

    protected generateBarsList = (barTypes: BarTypes[]) => {
      return barTypes.reduce((acc: Bar[], instruction: string) => {
        const bar =
          instruction == "new"
            ? this.generateRandomMelody(this.notes)
            : acc[getIndexFromString(instruction)];
        return [...acc, bar];
      }, []);
    };
  };
}
