import { Effects } from './effects/Effects.js'
import type { Consumable } from './items/Consumable.js'
import type { Direction } from './utils/index.js'
import { Position } from './utils/Position.js'


export class Snake {

  private _alive: boolean
  private _segments: Position[]
  private _effects: Effects
  private _speed: number

  public constructor(args: SnakeArgs) {
    this._alive = true
    this._effects = new Effects()
    this._speed = args.baseSpeed
    this._segments = [
      new Position(args.startX, args.startY)
    ]
  }

  public get alive(): boolean {
    return this._alive
  }

  public get head(): Position {
    return this._segments[0]!
  }

  public get length(): number {
    return this._segments.length
  }

  public get speed(): number {
    const boost = this._effects.speedBoost?.amount ?? 0
    return this._speed + boost
  }

  public get segments(): ReadonlyArray<Position> {
    return this._segments
  }

  public get effects(): Effects {
    return this._effects
  }

  public move(direction: Direction): void {
    const segments = this._segments

    // updated head
    const updatedHead = this.head.apply(direction)

    // make sure we didn't eat ourselves
    if (this._segments.some(seg => seg.equals(updatedHead))) {
      this.die()
      return
    }

    // growing
    if (this._effects.growth) {
      this._segments = [updatedHead, ...segments]
    }
    // just moving
    else {
      this._segments = [updatedHead, ...segments.slice(0, -1)]
    }

    // update effects
    this._effects.update()
  }

  public teleport(position: Position): void {
    const [head, ...tail] = this._segments
    this._segments = [position, ...tail]
  }

  public eat(item: Consumable): void {
    this._effects.add(item.consume())
  }

  public occupies(position: Position): boolean {
    return this._segments.some(seg => seg.equals(position))
  }

  public die(): void {
    this._alive = false
  }

}


type SnakeArgs = {
  startX: number
  startY: number
  baseSpeed: number
}