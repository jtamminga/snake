import { Coin, Item, Stone } from "./items/index.js"
import type { World } from "./World.js"


export class Renderer {

  private _world: World

  private _canvas: CanvasRenderingContext2D
  private _pxSize: number
  private _pxPadding: number
  private _worldRenderedWidth: number
  private _worldRenderedHeight: number

  public constructor(args: RendererArgs) {
    this._world = args.world
    this._canvas = args.canvas
    this._pxSize = args.pxSize
    this._pxPadding = args.pxPadding
    this._worldRenderedWidth = this._world.width * this._pxSize
    this._worldRenderedHeight = this._world.height * this._pxSize
  }

  public draw() {
    const pxSize = this._pxSize
    const canvas = this._canvas
    const world = this._world
    const snake = world.snake
    const pxPadding = this._pxPadding

    // clear canvas
    canvas.clearRect(0, 0, this._worldRenderedWidth, this._worldRenderedHeight)

    // render items
    for (const item of world.items) {

      // coin
      if (item instanceof Coin) {
        const radius = pxSize / 4
        const offset = (pxSize - (radius*2)) / 2 // for centering
        canvas.beginPath()
        canvas.ellipse(
          (item.position.x * pxSize) + radius + offset,
          (item.position.y * pxSize) + radius + offset,
          radius,
          radius,
          0, 0, 2 * Math.PI
        )
        canvas.fillStyle = 'rgba(255, 217, 0, 1)'
        canvas.fill()
      }

      // any other item
      else {
        canvas.beginPath()
        canvas.fillStyle = this.itemColor(item)
        canvas.roundRect(
          item.position.x * pxSize + pxPadding,
          item.position.y * pxSize + pxPadding,
          pxSize - (pxPadding * 2),
          pxSize - (pxPadding * 2),
          pxSize / 10
        )
        canvas.fill()
      }
    }

    // render snake
    for (const seg of snake.segments) {
      canvas.beginPath()
      canvas.fillStyle = snake.alive
        ? snake.effects.invincible ? 'rgba(255, 217, 0, 1)' : 'green'
        : 'red'
      canvas.roundRect(
        seg.x * pxSize + pxPadding,
        seg.y * pxSize + pxPadding,
        pxSize - (pxPadding * 2),
        pxSize - (pxPadding * 2),
        pxSize / 10
      )
      canvas.fill()
    }
  }

  private itemColor(item: Item): string  {
    const opacity = item.spawning ? '0.3' : '1'

    if (item instanceof Stone) {
      return `rgba(70, 70, 70, ${opacity})`
    }
    else {
      return `rgba(255, 153, 0, ${opacity})`
    }
  }

}


export type RendererArgs = {

  /**
   * the world instance
   */
  world: World

  /**
   * the HTML canvas context
   */
  canvas: CanvasRenderingContext2D

  /**
   * how many pixels (width & height) a cell is when rendered
   */
  pxSize: number

  /**
   * number of pixels padding a cell in the world
   */
  pxPadding: number
}