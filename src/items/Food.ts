import { type Effect, GrowthEffect, WrapEffect } from '../effects/index.js'
import { Consumable } from './Consumable.js'


export class Food extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return [
      new GrowthEffect({ duration: 1 }),
      new WrapEffect({ duration: 10 })
    ]
  }

}