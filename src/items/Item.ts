import type { Position } from '../utils/index.js'


export abstract class Item {

  protected _destroyedAt: number | undefined
  protected _position: Position
  protected _updates: number
  protected _spawningDuration: number
  protected _duration: number | undefined

  public constructor(args: ItemArgs) {
    this._destroyedAt = undefined
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

  /**
   * This item is set to spawn in a set amount of time in the future
   */
  public get spawning(): boolean {
    return this._updates < this._spawningDuration
  }

  /**
   * This item will spawn in the next update
   */
  public get justSpawned(): boolean {
    return this._updates === this._spawningDuration
  }

  /**
   * This item has spawned
   */
  public get spawned(): boolean {
    return this._updates >= this._spawningDuration
  }

  public get exists(): boolean {
    return !this.expired && this._destroyedAt === undefined
  }

  public get expired(): boolean {
    return this._duration === undefined
      ? false
      : this._updates >= this._duration
  }

  public get updatesTillSpawn(): number {
    return this._spawningDuration - this._updates
  }

  /**
   * Mark item to be destroyed.
   * The instance will stick around for a while to allow animations to finish.
   */
  public destroy(): void {
    this._destroyedAt = this._updates
  }

  public occupies(position: Position): boolean {
    return this._position.equals(position)
  }

  public update(): void {
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