export type Note = {
    time: string;
    note: string|null;
    duration: string;
}
export type Bar = Note[]

export type GetRandomNote = (notes: (string|null)[],
time: string, duration:string) => Note



type NumberRange<N extends number, Result extends unknown[] = []> = 
  Result['length'] extends N 
    ? Result[number] 
    : NumberRange<N, [...Result, Result['length']]>;

type CopyNumbers = `use_${NumberRange<100> extends 0 | infer U ? Exclude<U, 0> : never}`;

export type BarTypes = "new" | CopyNumbers;