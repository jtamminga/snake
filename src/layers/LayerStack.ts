import { Layer } from './Layer.js'


export class LayerStack {

  private _canvas: CanvasRenderingContext2D
  private _width: number
  private _height: number
  private _layers: Layer[]
  private _lastIndex: number
  private _topOpaqueIndex: number
  private _baseLayerFactory: () => Layer

  public constructor(args: LayerStackArgs) {
    this._canvas = args.canvas
    this._width = args.width
    this._height = args.height
    this._baseLayerFactory = args.baseLayerFactory
    this._layers = [this._baseLayerFactory()]
    this._lastIndex = 0
    this._topOpaqueIndex = 0
  }

  public get top(): Layer {
    return this._layers[this._lastIndex]!
  }

  public add(layer: Layer): void {
    this._lastIndex = this._layers.push(layer) - 1

    if (layer.opaque) {
      this._topOpaqueIndex = this._lastIndex
    }
  }

  public advanceFrame(delta: number): void {

    // clean up layers
    this.cleanup()

    // any pre rendering
    this.preRender()

    // advance top layer
    this.top.advanceFrame(delta)
  }

  private preRender(): void {

    // clear canvas
    this._canvas.clearRect(0, 0, this._width, this._height)

    // render any previous layers
    for (let i = this._topOpaqueIndex; i < this._layers.length - 1; i++) {
      const layer = this._layers[i]!
      layer.render()
    }
  }

  private cleanup(): void {
    if (this.top.resolved) {

      // remove top layer
      this._layers = this._layers.filter(layer => !layer.resolved)

      // recalculate indexs
      this._lastIndex = this._layers.length - 1
      for (let i = this._lastIndex; i >= 0; i--) {
        if (this._layers[i]!.opaque) {
          this._topOpaqueIndex = i
          break
        }
      }

      // add base layer if no layers left
      if (this._layers.length === 0) {
        this.add(this._baseLayerFactory())
      }
    }
  }

}


type LayerStackArgs = {
  width: number;
  height: number;
  canvas: CanvasRenderingContext2D;
  baseLayerFactory: () => Layer
}