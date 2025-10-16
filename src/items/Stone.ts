import type { Effect } from '../effects/Effect.js'
import type { Direction, Position } from '../utils/index.js'
import { Consumable } from './Consumable.js'
import type { ItemArgs } from './Item.js'


export class Stone extends Consumable {

  // track previous position and when
  private _pushedAt: number
  private _prePosition: Position

  public constructor(args: ItemArgs) {
    super(args)

    // setup previous position
    this._pushedAt = this._updates
    this._prePosition = this._position
  }

  public get prePosition(): Position {
    return this._prePosition
  }

  public push(direction: Direction): void {

    // set previous position
    this._pushedAt = this._updates
    this._prePosition = this._position

    // set updated position
    this._position = this._position.apply(direction)
  }

  public override update(): void {

    // if this is a future update the previous position
    if (this._updates > this._pushedAt) {
      this._prePosition = this._position
    }

    super.update()
  }

  protected effects(): ReadonlyArray<Effect> {
    return []
  }

}