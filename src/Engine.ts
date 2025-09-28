import { Game } from './Game.js'
import { GameOverMenu } from './GameOverMenu.js'
import { LayerStack } from './LayerStack.js'
import type { MainMenu } from './MainMenu.js'
import { Notifier } from './Notifier.js'
import { Renderer, type RendererArgs } from './Renderer.js'
import { Input } from './utils/index.js'
import { World } from './World.js'


export class Engine {

  // main objects
  private _input: Input
  private _canvas: CanvasRenderingContext2D

  // private _menu: MainMenu
  private _stack: LayerStack
  private _game: Game
  private _gameOverMenu: GameOverMenu

  // helpers
  private _worldRenderedWidth: number
  private _worldRenderedHeight: number 

  // state
  private _state: EngineState
  

  // game loop timing
  private _lastUpdate: number
  private _updateInterval: number
  private _baseUpdateInterval: number
  private _snakeSpeedMult: number

  // misc
  private _afterUpdate: ((context: EngineContext) => void) | undefined


  public constructor(args: EngineArgs) {

    // state
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
    this._updateInterval = 0

    // initialize objects
    this._input = new Input()

    this._stack = new LayerStack({
      canvas: args.canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
    this._game = new Game({
      canvas: args.canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
    this._stack.add(this._game)
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

      // calculate time since last update
      const delta = currentTime - this._lastUpdate

      // update if delta is larger than update interval
      if (delta >= this._updateInterval) {

        // update
        this._updateInterval = this._stack.update(this._input)

        if (this._game.state.changedTo('over')) {
          this._stack.add(this._gameOverMenu)
        }

        // time tracking
        this._lastUpdate = currentTime
      }

      // render
      this._stack.render()

      // post update
      this._afterUpdate?.({
        moves: 0,
        snakeLength: 0
      })

      // loop
      this.update()
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