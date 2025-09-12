import { type Effect, GrowthEffect, SpeedBoostEffect, WrapEffect } from '../effects/index.js'
import { Item } from './Item.js'


export class Food extends Item {

  public effects(): ReadonlyArray<Effect> {
    return [
      new GrowthEffect({ duration: 1 }),
      new SpeedBoostEffect({ duration: 5, boostAmount: 25 }),
      new WrapEffect({ duration: 10 })
    ]
  }

}