import { Position } from './Position.js'


export class Bounds {

  private _width: number
  private _height: number

  public constructor(args: BoundsArgs) {
    this._width = args.width
    this._height = args.height
  }

  public get width(): number {
    return this._width
  }

  public get height(): number {
    return this._height
  }

  public contains(position: Position): boolean {
    return position.x >= 0 && position.x < this._width
      && position.y >= 0 && position.y < this._height
  }

  public outside(position: Position): boolean {
    return !this.contains(position)
  }

  public wrap({x, y}: Position): Position {
    return new Position(
      (this._width + x) % this._width,
      (this._height + y) % this._height
    )
  }

}


type BoundsArgs = {
  width: number
  height: number
}