import { Coin, Food, Item, Stone } from "./items/index.js"
import type { Notifier } from './Notifier.js'
import type { World } from "./World.js"


export class Renderer {

  private _world: World

  private _notifier: Notifier
  private _canvas: CanvasRenderingContext2D
  private _pxSize: number
  private _pxPadding: number
  private _worldRenderedWidth: number
  private _worldRenderedHeight: number

  public constructor(args: RendererArgs) {
    this._world = args.world
    this._notifier = args.notifier
    this._canvas = args.canvas
    this._pxSize = args.pxSize
    this._pxPadding = args.pxPadding
    this._worldRenderedWidth = this._world.width * this._pxSize
    this._worldRenderedHeight = this._world.height * this._pxSize

    this._canvas.textBaseline = 'hanging'
  }

  public draw() {
    const notifer = this._notifier
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

      // food
      else if (item instanceof Food) {
        const foodSize = pxSize / 2
        const offset = (pxSize - foodSize) / 2
        canvas.beginPath()
        canvas.roundRect(
          item.position.x * pxSize + offset,
          item.position.y * pxSize + offset,
          foodSize,
          foodSize,
          pxSize / 10
        )
        canvas.fillStyle = `rgba(255, 153, 0, ${this.opacity(item)})`
        canvas.fill()
      }

      // stone
      else if (item instanceof Stone) {
        canvas.beginPath()
        canvas.roundRect(
          item.position.x * pxSize + pxPadding,
          item.position.y * pxSize + pxPadding,
          pxSize - (pxPadding * 2),
          pxSize - (pxPadding * 2),
          pxSize / 10
        )
        canvas.fillStyle = `rgba(70, 70, 70, ${this.opacity(item)})`
        canvas.fill()

        if (item.spawning) {
          canvas.font = '50px Tiny5'
          canvas.fillStyle = `rgba(255, 255, 255, 0.1)`
          canvas.fillText(
            item.updatesTillSpawn.toString(),
            item.position.x * pxSize + 40,
            item.position.y * pxSize + 30
          )
        }
      }
    }

    // render snake
    for (const seg of snake.segments) {
      canvas.beginPath()
      canvas.fillStyle = snake.alive
        ? snake.effects.rockEater ? 'rgba(255, 217, 0, 1)' : 'green'
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

    // render snake effect timer
    if (snake.effects.rockEater) {
      const head = snake.head
      canvas.font = '50px Tiny5'
      canvas.fillStyle = `rgba(0, 0, 0, 0.1)`
      canvas.fillText(
        // made more sense when it shows updates left
        (snake.effects.rockEater.remaining - 1).toString(),
        head.x * pxSize + 40,
        head.y * pxSize + 35
      )
    }

    // render notifications
    for (const notif of notifer.notifications) {
      const offset = 20
      const yOffet = notif.updates * 10
      canvas.font = '22px Tiny5'


      canvas.shadowColor = 'black'
      canvas.shadowBlur = 8
      canvas.lineWidth = 1
      canvas.strokeText(
        notif.message,
        notif.position.x * pxSize + offset,
        notif.position.y * pxSize + offset + yOffet
      )

      canvas.fillStyle = `rgba(255, 255, 255, 1)`
      canvas.fillText(
        notif.message,
        notif.position.x * pxSize + offset,
        notif.position.y * pxSize + offset + yOffet
      )

      
    }
  }

  private opacity(item: Item): string  {
    return item.spawning ? '0.3' : '1'
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

  /**
   * notifier instance
   */
  notifier: Notifier
}