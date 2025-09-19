import type { Effect } from '../effects/Effect.js'
import { Consumable } from './Consumable.js'


export class Coin extends Consumable {

  protected effects(): ReadonlyArray<Effect> {
    return []
  }

}