export const getRandomItem = <T>(items: Array<T>) =>
  items[Math.floor(Math.random() * items.length)];
export const getIndexFromString = (instruction: string) =>
  Number(instruction.slice(-1));
