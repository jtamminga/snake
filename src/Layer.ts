import type { Input } from './utils/index.js'


export abstract class Layer {

  protected _width: number
  protected _height: number
  protected _canvas: CanvasRenderingContext2D

  public constructor(args: LayerArgs, public readonly opaque = true) {
    this._width = args.width
    this._height = args.height
    this._canvas = args.canvas
  }

  public abstract update(input: Input): number

  public abstract render(): void

}


export type LayerArgs = {
  width: number
  height: number
  canvas: CanvasRenderingContext2D
}