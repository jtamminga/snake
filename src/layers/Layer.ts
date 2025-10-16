import type { Input } from '../utils/index.js'


export abstract class Layer<TResolve = any> {

  protected _width: number
  protected _height: number
  protected _canvas: CanvasRenderingContext2D
  protected _resolved?: TResolve
  private _resolvedCallback?: (value: TResolve) => void

  public constructor(args: LayerArgs, public readonly opaque = true) {
    this._width = args.width
    this._height = args.height
    this._canvas = args.canvas
  }

  public get resolved(): boolean {
    return this._resolved !== undefined
  }

  protected resolve(value: TResolve): void {
    this._resolved = value
    this._resolvedCallback?.(value)
  }

  public whenResolved(callback: (value: TResolve) => void): void {
    this._resolvedCallback = callback
  }

  public abstract update(input: Input): number

  public abstract render(progress: number): void

}


export type LayerArgs = {
  width: number
  height: number
  canvas: CanvasRenderingContext2D
}