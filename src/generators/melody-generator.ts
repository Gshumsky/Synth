import { BaseInstrument } from "../base-instrument";
import { BAR_LENGTH, EIGHTH, QUARTER, SIXTEENTH } from "../constants";
import { Bar, BarTypes, Note } from "../types";
import { getIndexFromString, getRandomItem } from "../utils";

export function getRandomNote(
  this: BaseInstrument,
  notes: (string | null)[],
  time: string,
  duration: string
): Note {
  return {
    time: time,
    note: getRandomItem(notes),
    duration: duration,
  };
}

export function generateRandomMelody(
  this: BaseInstrument,
  notes: (string | null)[]
) {
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
        noteStartTime += 0.249;
        break;
    }
  }
  console.log(`Melody is ${newMelody}`);
  return newMelody;
}

export function updateCurrentPart(this: BaseInstrument, bar: Bar) {
  this.melodyPart.clear();
  bar.forEach((note: Note) => {
    this.melodyPart.add(note);
  });
}

export function generateBarsList(this: BaseInstrument, barTypes: BarTypes[]) {
  return barTypes.reduce((acc: Bar[], instruction: string) => {
    const bar =
      instruction == "new"
        ? this.generateRandomMelody(this.notes)
        : acc[getIndexFromString(instruction)];
    return [...acc, bar];
  }, []);
}
