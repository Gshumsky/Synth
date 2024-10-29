export type Note = {
  time: string;
  note: string | null;
  duration: string;
};
export type Bar = Note[];

export type GetRandomNote = (
  notes: (string | null)[],
  time: string,
  duration: string
) => Note;

type NumberRange<
  N extends number,
  Result extends unknown[] = [],
> = Result["length"] extends N
  ? Result[number]
  : NumberRange<N, [...Result, Result["length"]]>;

type CopyNumbers = `use_${NumberRange<100>}`;

export type BarTypes = "new" | CopyNumbers;

export type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export type Durations = ("2n" | "4n" | "8n" | "16n")[];

export type InstrumentProps = {
  gain: number;
  oscillatorType:
    | "fatsine"
    | "fatsquare"
    | "fatsawtooth"
    | "fattriangle"
    | "fatcustom"
    | "fmsine"
    | "fmsquare"
    | "fmsawtooth"
    | "fmtriangle"
    | "fmcustom"
    | "amsine"
    | "amsquare"
    | "amsawtooth"
    | "amtriangle"
    | "amcustom"
    | "custom"
    | "sawtooth"
    | "sine"
    | "square"
    | "triangle"
    | "pulse"
    | "pwm";
  envelope: Envelope;
  notes: (string | null)[];
  durations: Durations;
};

export type InstrumentConstructor<T> = new (...args: any[]) => T & {
  generateBarsList: (barTypes: BarTypes[]) => Bar[];
  connectEffects: (effectsList: object[]) => void;
  updateCurrentPart: (bar: Bar) => void;
  enableRandomEffects: (quantity: number) => void;
};
