import type { Effect } from '../effects/index.js'
import type { Position } from '../utils/index.js'


export abstract class Item {

  private _consumed: boolean
  private _position: Position
  private _duration: number | undefined

  public constructor(args: ItemArgs) {
    this._consumed = false
    this._position = args.position
    this._duration = args.duration
  }

  public get consumed(): boolean {
    return this._consumed
  }

  public get position(): Position {
    return this._position
  }

  public get expired(): boolean {
    return this._duration === undefined
      ? false
      : this._duration <= 0
  }

  public occupies(position: Position): boolean {
    return this._position.equals(position)
  }

  public consume(): void {
    this._consumed = true
  }

  public update() {
    if (this._duration !== undefined) {
      this._duration -= 1
    }
  }

  public abstract effects(): ReadonlyArray<Effect>

}


type ItemArgs = {
  position: Position
  duration?: number
}