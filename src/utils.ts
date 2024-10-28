export const getRandomItem = <T>(items: Array<T>) =>
  items[Math.floor(Math.random() * items.length)];

export const getRandomElements = <T>(items: Array<T>, quantity: number) => {
  if (quantity >= items.length) throw Error("Quantity of disired items must be less then overall items quantity")
  const result = new Set<T>();
  while (result.size < quantity) {
      result.add(getRandomItem<T>(items));
  }
  return Array.from(result);
}

export const getIndexFromString = (instruction: string) =>
  Number(instruction.slice(-1));
