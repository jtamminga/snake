import { GameOverMenu } from './GameOverMenu.js'
import { Notifier } from './Notifier.js'
import { Renderer, type RendererArgs } from './Renderer.js'
import { Input } from './utils/index.js'
import { World } from './World.js'


export class Engine {

  // main objects
  private _input: Input
  private _world: World
  private _renderer: Renderer
  private _notifier: Notifier
  private _gameOverMenu: GameOverMenu
  private _canvas: CanvasRenderingContext2D

  // helpers
  private _worldRenderedWidth: number
  private _worldRenderedHeight: number 

  // state
  private _state: EngineState
  private _numUpdates: number

  // game loop timing
  private _lastUpdate: number
  private _baseUpdateInterval: number
  private _snakeSpeedMult: number

  // misc
  private _afterUpdate: ((context: EngineContext) => void) | undefined


  public constructor(args: EngineArgs) {

    // state
    this._numUpdates = 0
    this._state = 'paused'

    this._worldRenderedWidth = args.worldWidth * args.pxSize
    this._worldRenderedHeight = args.worldHeight * args.pxSize

    // setup baseline canvas settings
    this._canvas = args.canvas
    this._canvas.textBaseline = 'middle'
    this._canvas.textAlign = 'center'
    this._canvas.shadowColor = 'black'

    // game loop properties
    this._baseUpdateInterval = args.baseUpdateInterval
    this._snakeSpeedMult = args.snakeSpeedMult
    this._lastUpdate = 0

    // initialize objects
    this._input = new Input()
    this._notifier = new Notifier()
    this._world = new World({
      width: args.worldWidth,
      height: args.worldHeight,
      notifier: this._notifier
    })
    this._renderer = new Renderer({
      ...args,
      world: this._world,
      notifier: this._notifier
    })
    this._gameOverMenu = new GameOverMenu({
      canvas: args.canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
    
    // misc
    this._afterUpdate = args.afterUpdate

    // setup controls
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

      // render
      this._canvas.clearRect(0, 0, this._worldRenderedWidth, this._worldRenderedHeight)
      this._renderer.draw()
      if (this._state === 'gameOver') {
        this._gameOverMenu.render()
      }

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


type EngineArgs = Omit<RendererArgs, 'world' | 'notifier'> & {

  /**
   * number of units wide the world is
   */
  worldWidth: number

  /**
   * number of units high the world is
   */
  worldHeight: number

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