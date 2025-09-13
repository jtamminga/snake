import type { Position } from '../utils/index.js'


export abstract class Item {

  protected _position: Position
  protected _updates: number
  protected _spawningDuration: number
  protected _duration: number | undefined

  public constructor(args: ItemArgs) {
    this._updates = 0
    this._position = args.position
    this._spawningDuration = args.spawningDuration ?? 0
    this._duration = args.duration === undefined
      ? undefined
      : args.duration + this._spawningDuration
  }

  public get position(): Position {
    return this._position
  }

  public get spawning(): boolean {
    return this._updates < this._spawningDuration
  }

  public get spawned(): boolean {
    return this._updates >= this._spawningDuration
  }

  public get exists(): boolean {
    return !this.expired
  }

  public get expired(): boolean {
    return this._duration === undefined
      ? false
      : this._updates >= this._duration
  }

  public occupies(position: Position): boolean {
    return this._position.equals(position)
  }

  public update() {
    this._updates += 1
  }

}


export type ItemArgs = {

  /**
   * number of updates till item spawns (used to warn users)
   */
  spawningDuration?: number

  /**
   * position of item
   */
  position: Position

  /**
   * duration of item once spawned
   */
  duration?: number
}