import { type Effect, RockEaterEffect, WrapEffect } from '../effects/index.js'
import { Consumable } from './Consumable.js'


export class Coin extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return [
      new RockEaterEffect({ duration: 5 }),
      new WrapEffect({ duration: 5 })
    ]
  }

}