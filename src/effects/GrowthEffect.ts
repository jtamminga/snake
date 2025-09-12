import { Effect } from './Effect.js'


export class GrowthEffect extends Effect {

  public addDuration(amount: number): void {
    this._duration += amount
  }

}