import { type Effect, InvincibleEffect } from '../effects/index.js'
import { Consumable } from './Consumable.js'


export class Coin extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return [
      new InvincibleEffect({ duration: 5 })
    ]
  }

}