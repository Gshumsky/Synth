import { BaseInstrument } from "../base-instrument";
import { ONE_MEASURE } from "../constants";
import { Bar, BarTypes } from "../types";

export function startPart(
  this: BaseInstrument,
  barTypes: BarTypes[],
  effectsList: object[],
  effectsQuantity: number
) {
  let barsList: Bar[] = this.generateBarsList(barTypes);
  let barCounter = 0;
  this.connectEffects(effectsList);

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

  this.transport.scheduleRepeat(() => {
    this.enableRandomEffects(effectsQuantity);
  }, "8m");
}
