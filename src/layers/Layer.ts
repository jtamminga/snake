import type { Input } from '../utils/index.js'


export abstract class Layer {

  protected _width: number
  protected _height: number
  protected _canvas: CanvasRenderingContext2D
  protected _resolved: string | undefined

  public constructor(args: LayerArgs, public readonly opaque = true) {
    this._width = args.width
    this._height = args.height
    this._canvas = args.canvas
  }

  public get resolved(): boolean {
    return this._resolved !== undefined
  }

  protected resolve(): void {
    this._resolved = 'resolved'
  }

  public whenResolved(callback: (value: any) => void): void {
    if (this._resolved) {
      callback(this._resolved)
    }
  }

  public abstract update(input: Input): number

  public abstract render(): void

}


export type LayerArgs = {
  width: number
  height: number
  canvas: CanvasRenderingContext2D
}