import type { Notifier } from './Notifier.js'
import { Renderer, type RendererArgs } from './Renderer.js'
import { Input } from './utils/index.js'
import type { World } from './World.js'


export class Engine {

  // notifications
  private _notifier: Notifier

  // rendering
  private _renderer: Renderer

  // misc properties
  private _numUpdates: number
  private _state: EngineState
  private _input: Input
  private _world: World
  private _afterUpdate: ((context: EngineContext) => void) | undefined

  // game loop timing
  private _lastUpdate: number
  private _baseUpdateInterval: number
  private _snakeSpeedMult: number

  public constructor(args: EngineArgs) {
    this._notifier = args.notifier
    this._renderer = new Renderer(args)

    this._numUpdates = 0
    this._state = 'paused'
    this._input = new Input()
    this._world = args.world
    this._afterUpdate = args.afterUpdate

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
      const notifier = this._notifier
      const world = this._world
      const snake = world.snake

      // calculate time since last update
      const delta = currentTime - this._lastUpdate
      const updateInterval = this._baseUpdateInterval - (snake.speed * this._snakeSpeedMult)

      // update if delta is larger than update interval
      if (delta >= updateInterval) {

        // update
        notifier.update()
        world.update(this._input.direction)

        // track updates
        this._numUpdates += 1

        // update engine state
        if (!snake.alive) {
          this._state = 'gameOver'
        }
        else if (snake.length === world.area) {
          this._state = 'gameWon'
        }

        // time tracking
        this._lastUpdate = currentTime
      }

      // render world
      this._renderer.draw()

      // post update
      this._afterUpdate?.({
        moves: this._numUpdates,
        snakeLength: snake.length
      })

      // loop
      if (this._state === 'playing') {
        this.update()
      }
    })
  }


}


// =====
// types
// =====


type EngineArgs = RendererArgs & {

  /**
   * the world instance
   */
  world: World

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
  afterUpdate?: (context: EngineContext) => void
}

type EngineState =
  | 'playing'
  | 'paused'
  | 'gameOver'
  | 'gameWon'
type EngineContext = {
  moves: number
  snakeLength: number
}