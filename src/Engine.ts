import { Input } from './utils/index.js'
import type { World } from './World.js'


export class Engine {

  // state
  private _state: EngineState
  private _input: Input

  // world
  private _world: World
  private _worldRenderedWidth: number
  private _worldRenderedHeight: number

  // rendering
  private _canvas: CanvasRenderingContext2D
  private _pxSize: number
  private _pxPadding: number
  private _afterUpdate: (() => void) | undefined

  // game loop timing
  private _lastUpdate: number
  private _baseUpdateInterval: number
  private _snakeSpeedMult: number

  public constructor(args: EngineArgs) {
    this._state = 'paused'
    this._input = new Input()
    this._canvas = args.canvas
    this._pxSize = args.pxSize
    this._pxPadding = args.pxPadding
    this._afterUpdate = args.afterUpdate

    this._world = args.world
    this._worldRenderedWidth = this._world.width * this._pxSize
    this._worldRenderedHeight = this._world.height * this._pxSize

    this._baseUpdateInterval = args.baseUpdateInterval
    this._snakeSpeedMult = args.snakeSpeedMult
    this._lastUpdate = 0

    // controls
    document.addEventListener('keydown', e => 
      this._input.keyDown(e.key)
    )
  }

  public play() {
    this._state = 'playing'
    this.update()
  }

  public pause() {
    this._state = 'paused'
  }

  public restart() {
  }

  private update() {
    requestAnimationFrame((currentTime) => {
      const world = this._world
      const snake = world.snake

      // calculate time since last update
      const delta = currentTime - this._lastUpdate
      const updateInterval = this._baseUpdateInterval - (snake.speed * this._snakeSpeedMult)

      // update if delta is larger than update interval
      if (delta >= updateInterval) {
        world.update(this._input.direction)
        this._lastUpdate = currentTime
      }

      // render world
      this.render()

      // post update
      this._afterUpdate?.()

      // loop while alive
      if (snake.alive) {
        this.update()
      }
    })
  }

  private render() {
    const pxSize = this._pxSize
    const canvas = this._canvas
    const world = this._world
    const snake = world.snake
    const pxPadding = this._pxPadding

    // clear canvas
    canvas.clearRect(0, 0, this._worldRenderedWidth, this._worldRenderedHeight)

    // render snake
    for (const seg of snake.segments) {
      canvas.fillStyle = snake.alive ? 'green' : 'red'
      canvas.fillRect(
        seg.x * pxSize + pxPadding,
        seg.y * pxSize + pxPadding,
        pxSize - (pxPadding * 2),
        pxSize - (pxPadding * 2)
      )
    }

    // render items
    for (const item of world.items) {
      canvas.fillStyle = 'orange'
      canvas.fillRect(
        item.position.x * pxSize + pxPadding,
        item.position.y * pxSize + pxPadding,
        pxSize - (pxPadding * 2),
        pxSize - (pxPadding * 2)
      )
    }
  }


}


// =====
// types
// =====


type EngineArgs = {

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
   * time in milliseconds each update takes
   */
  baseUpdateInterval: number

  /**
   * amount in milliseconds each snake speed takes off of update interval
   */
  snakeSpeedMult: number

  /**
   * callback that gets triggered after each update
   */
  afterUpdate?: () => void
}

type EngineState =
  | 'playing'
  | 'paused'
  | 'gameOver'