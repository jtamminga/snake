import { Effect } from './Effect.js'


export class GrowthEffect extends Effect {

  public addDuration(amount: number): void {
    if (this._duration !== undefined) {
      this._duration += amount
    }
  }

}