import { type Effect, GoldEffect, RockEaterEffect, WrapEffect } from '../effects/index.js'
import { Consumable } from './Consumable.js'


export class Coin extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return [
      new GoldEffect({ duration: 1, amount: 1 })
      // new RockEaterEffect({ duration: 5 }),
      // new WrapEffect({ duration: 5 })
    ]
  }

}