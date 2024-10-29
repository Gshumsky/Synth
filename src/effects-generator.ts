import * as Tone from "tone";
import { BaseInstrument } from "./base-instrument";
import { getRandomElements } from "./utils";

export function EffectsGenerator<
  TBase extends new (...args: any[]) => BaseInstrument,
>(Base: TBase) {
  return class extends Base {
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
      const effectsToEdit = this.connectedEffects.filter(
        (item: any) => !(item instanceof Tone.Gain)
      );
      effectsToEdit.forEach((effect: any) => effect.set({ wet: 0 }));
      const randomEffects = getRandomElements<object>(effectsToEdit, quantity);
      console.log(`chosen effects: ${randomEffects}`);
      randomEffects.forEach((effect: any) =>
        effect.set({ wet: Math.random() })
      );
    };

    public disconnectAllEffects = () => {
      this.connectedEffects.forEach((effect: any) => {
        effect.disconnect();
      });
    };
  };
}
