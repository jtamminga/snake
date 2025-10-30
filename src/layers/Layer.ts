import type { Input } from '../utils/index.js'


export abstract class Layer<TResolve = any> {

  protected _input: Input
  protected _canvas: CanvasRenderingContext2D
  protected _width: number
  protected _height: number
  protected _resolved?: TResolve
  private _resolvedCallback?: (value: TResolve) => void

  // game loop timing
  private _lastUpdate: number
  private _updateInterval: number
  protected _progress: number

  public constructor(args: LayerArgs, public readonly opaque = true) {
    this._input = args.input
    this._canvas = args.canvas
    this._width = args.width
    this._height = args.height

    this._lastUpdate = 0
    this._updateInterval = 0
    this._progress = 0
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

  public advanceFrame(delta: number): void {

    // calculate time since last update
    this._lastUpdate += delta

    // render
    this._progress = Math.min(this._lastUpdate / this._updateInterval, 1)
    this.render()

    // update if delta is larger than update interval
    if (this._lastUpdate >= this._updateInterval) {

      // update
      this._updateInterval = this.update()

      // time tracking
      this._lastUpdate = this._lastUpdate % this._updateInterval
    }
  }

  public abstract render(): void
  
  protected abstract update(): number

}


export type LayerArgs = {
  width: number
  height: number
  canvas: CanvasRenderingContext2D
  input: Input
}