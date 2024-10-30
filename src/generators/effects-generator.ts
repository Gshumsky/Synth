import * as Tone from "tone";
import { BaseInstrument } from "../base-instrument";
import { getRandomElements } from "../utils";

export function connectEffects(this: BaseInstrument, effectsList: object[]) {
  effectsList.push(this.gain);
  effectsList.reduce((chain: any, effect: object) => {
    console.log(`connecting ${chain} to ${effect}`);
    chain.connect(effect);
    this.connectedEffects.push(effect);
    return effect;
  }, this.synth);
}

export function enableRandomEffects(this: BaseInstrument, quantity: number) {
  const effectsToEdit = this.connectedEffects.filter(
    (item: any) => !(item instanceof Tone.Gain)
  );
  effectsToEdit.forEach((effect: any) => effect.set({ wet: 0 }));
  const randomEffects = getRandomElements<object>(effectsToEdit, quantity);
  console.log(`chosen effects: ${randomEffects}`);
  randomEffects.forEach((effect: any) => effect.set({ wet: Math.random() }));
}

export function disconnectAllEffects(this: BaseInstrument) {
  this.connectedEffects.forEach((effect: any) => {
    effect.disconnect();
  });
}
