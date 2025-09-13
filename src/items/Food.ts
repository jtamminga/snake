import { type Effect, GrowthEffect, SpeedBoostEffect, WrapEffect } from '../effects/index.js'
import { Consumable } from './Consumable.js'


export class Food extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return [
      new GrowthEffect({ duration: 1 }),
      new SpeedBoostEffect({ duration: 5, boostAmount: 25 }),
      new WrapEffect({ duration: 10 })
    ]
  }

}