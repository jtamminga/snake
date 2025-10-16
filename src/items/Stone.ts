import type { Effect } from '../effects/Effect.js'
import type { Direction, Position } from '../utils/index.js'
import { Consumable } from './Consumable.js'
import type { ItemArgs } from './Item.js'


export class Stone extends Consumable {

  private _prePosition: Position

  public constructor(args: ItemArgs) {
    super(args)
    this._prePosition = this._position
  }

  public get prePosition(): Position {
    return this._prePosition
  }

  public push(direction: Direction): void {
    this._prePosition = this._position
    this._position = this._position.apply(direction)
  }

  protected effects(): ReadonlyArray<Effect> {
    return []
  }

}