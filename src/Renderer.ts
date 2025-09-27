import { Coin, Food, Item, Stone } from "./items/index.js"
import type { Notifier } from './Notifier.js'
import type { World } from "./World.js"


export class Renderer {

  private _world: World
  private _notifier: Notifier
  private _canvas: CanvasRenderingContext2D
  private _pxSize: number
  private _pxPadding: number

  // common sizes
  private _halfPxSize: number

  public constructor(args: RendererArgs) {
    this._world = args.world
    this._notifier = args.notifier
    this._canvas = args.canvas
    this._pxSize = args.pxSize
    this._pxPadding = args.pxPadding

    // common sizes
    this._halfPxSize = args.pxSize / 2
  }

  public draw() {
    const notifer = this._notifier
    const pxSize = this._pxSize
    const halfPxSize = this._halfPxSize
    const canvas = this._canvas
    const world = this._world
    const snake = world.snake
    const pxPadding = this._pxPadding

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
        canvas.closePath()
      }

      // food
      else if (item instanceof Food) {
        const foodSize = halfPxSize
        const offset = (pxSize - foodSize) / 2
        canvas.fillStyle = `rgba(255, 153, 0, 1)`
        canvas.fillRect(
          item.position.x * pxSize + offset,
          item.position.y * pxSize + offset,
          foodSize,
          foodSize
        )
      }

      // stone
      else if (item instanceof Stone) {
        canvas.fillStyle = `rgba(70, 70, 70, ${this.opacity(item)})`
        canvas.fillRect(
          item.position.x * pxSize + pxPadding,
          item.position.y * pxSize + pxPadding,
          pxSize - (pxPadding * 2),
          pxSize - (pxPadding * 2),
        )

        if (item.spawning) {
          canvas.font = '50px Tiny5'
          canvas.fillStyle = `rgba(255, 255, 255, 0.1)`
          canvas.fillText(
            item.updatesTillSpawn.toString(),
            item.position.x * pxSize + halfPxSize + 2,
            item.position.y * pxSize + halfPxSize
          )
        }
      }
    }

    // snake
    canvas.fillStyle = snake.alive
      ? snake.effects.rockEater
        ? 'rgba(255, 217, 0, 1)'
        : 'green'
      : 'red'
    for (const seg of snake.segments) {
      canvas.fillRect(
        seg.x * pxSize + pxPadding,
        seg.y * pxSize + pxPadding,
        pxSize - (pxPadding * 2),
        pxSize - (pxPadding * 2),
      )
    }
    // render snake effect timer
    if (snake.effects.rockEater) {
      const head = snake.head
      canvas.font = '50px Tiny5'
      canvas.fillStyle = `rgba(0, 0, 0, 0.1)`
      canvas.fillText(
        // made more sense when it shows updates left
        (snake.effects.rockEater.remaining - 1).toString(),
        head.x * pxSize + halfPxSize + 2,
        head.y * pxSize + halfPxSize
      )
    }

    // render notifications
    canvas.font = '22px Tiny5'
    canvas.shadowBlur = 8
    canvas.lineWidth = 1
    for (const notif of notifer.notifications) {
      const yOffet = notif.updates * 10
      // black shadow
      canvas.strokeText(
        notif.message,
        notif.position.x * pxSize + halfPxSize,
        notif.position.y * pxSize + halfPxSize + yOffet
      )
      // white text
      canvas.fillStyle = `rgba(255, 255, 255, 1)`
      canvas.fillText(
        notif.message,
        notif.position.x * pxSize + halfPxSize,
        notif.position.y * pxSize + halfPxSize + yOffet
      )
    }
    canvas.shadowBlur = 0
    canvas.lineWidth = 0
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