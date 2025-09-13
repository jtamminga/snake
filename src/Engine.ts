import { Renderer, type RendererArgs } from './Renderer.js'
import { Input } from './utils/index.js'
import type { World } from './World.js'


export class Engine {

  // rendering
  private _renderer: Renderer

  // misc properties
  private _state: EngineState
  private _input: Input
  private _world: World
  private _afterUpdate: (() => void) | undefined

  // game loop timing
  private _lastUpdate: number
  private _baseUpdateInterval: number
  private _snakeSpeedMult: number

  public constructor(args: EngineArgs) {
    this._renderer = new Renderer(args)

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
      this._renderer.draw()

      // post update
      this._afterUpdate?.()

      // loop while alive
      if (snake.alive) {
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
  afterUpdate?: () => void
}

type EngineState =
  | 'playing'
  | 'paused'
  | 'gameOver'