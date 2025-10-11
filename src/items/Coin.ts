import { type Effect, GoldEffect } from '../effects/index.js'
import { Consumable } from './Consumable.js'


export class Coin extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return [
      new GoldEffect({ amount: 1 })
    ]
  }

}