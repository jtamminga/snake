import { createBreed, type Breed, type BreedType, type BreedUpgrade } from './breed/index.js'
import { Effects } from './effects/index.js'
import type { Consumable } from './items/index.js'
import { Position, type Direction } from './utils/index.js'


export class Snake {

  private _breed: Breed<BreedUpgrade>
  private _alive: boolean
  private _segments: Position[]
  private _effects: Effects
  private _baseSpeed: number
  private _baseGold: number
  private _preTail: Position

  public constructor(args: SnakeArgs) {
    this._breed = createBreed(args.breed)
    this._alive = true
    this._effects = new Effects()
    this._baseSpeed = args.baseSpeed
    this._baseGold = 0

    const startPos = new Position(args.startX, args.startY)
    this._segments = [startPos]
    this._preTail = startPos
  }

  public get breed(): Breed<BreedUpgrade> {
    return this._breed
  }

  public get alive(): boolean {
    return this._alive
  }

  public get head(): Position {
    return this._segments[0]!
  }

  public get tail(): Position {
    return this._segments[this._segments.length - 1]!
  }

  public get length(): number {
    return this._segments.length
  }

  public get speed(): number {
    const speedEffects = this._effects.speed?.amount ?? 0
    return this._baseSpeed + this.length + speedEffects
  }

  public get gold(): number {
    const goldEffects = this._effects.gold?.amount ?? 0
    return this._baseGold + goldEffects
  }

  public get segments(): ReadonlyArray<Position> {
    return this._segments
  }

  public get effects(): Effects {
    return this._effects
  }

  public get preTail(): Position {
    return this._preTail
  }

  public move(direction: Direction): void {
    const segments = this._segments

    // store previous states
    this._preTail = this.tail

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
    const [, ...tail] = this._segments
    this._segments = [position, ...tail]
  }

  public eat(item: Consumable): void {

    // add effects from the item
    this._effects.add(item.consume())

    // add effects the breed gets when eating an item
    this._effects.add(this._breed.effectsFromItem(item))
  }

  public upgrade(upgradeId: BreedUpgrade): void {

    // apply upgrade and effects
    this._effects.add(this._breed.effectsFromUpgrade(upgradeId))
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
  breed: BreedType
}