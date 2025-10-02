import { Layer, type LayerArgs } from './Layer.js'
import type { Input } from '../utils/index.js'


export class LayerStack extends Layer {

  private _layers: Layer[]
  private _lastIndex: number
  private _topOpaqueIndex: number

  public constructor(args: LayerArgs) {
    super(args)
    this._layers = []
    this._lastIndex = -1
    this._topOpaqueIndex = -1
  }

  private get top(): Layer {
    return this._layers[this._lastIndex]!
  }

  public add(layer: Layer): void {
    this._lastIndex = this._layers.push(layer) - 1

    if (layer.opaque) {
      this._topOpaqueIndex = this._lastIndex
    }
  }

  public update(input: Input): number {
    return this.top.update(input)
  }

  public cleanup(): void {
    if (this.top.resolved) {
      this._layers = this._layers.filter(layer => !layer.resolved)

      this._lastIndex = this._layers.length - 1
      for (let i = this._lastIndex; i >= 0; i--) {
        if (this._layers[i]!.opaque) {
          this._topOpaqueIndex = i
          break
        }
      }
    }
  }

  public render(): void {
    this._canvas.clearRect(0, 0, this._width, this._height)
    for (let i = this._topOpaqueIndex; i < this._layers.length; i++) {
      const layer = this._layers[i]!
      layer.render()
    }
  }

}