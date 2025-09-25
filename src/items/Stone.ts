import type { Effect } from '../effects/Effect.js'
import type { Direction } from '../utils/index.js'
import { Consumable } from './Consumable.js'


export class Stone extends Consumable {

  public push(direction: Direction): void {
    this._position = this._position.apply(direction)
  }

  protected effects(): ReadonlyArray<Effect> {
    return []
  }

}