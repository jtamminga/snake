import { Game, type Stats } from './Game.js'
import { GameOverMenu } from './GameOverMenu.js'
import { LayerStack } from './layers/index.js'
import { MainMenu } from './MainMenu.js'
import { ShopMenu } from './ShopMenu.js'
import { Input } from './utils/index.js'


export class Engine {

  // main objects
  private _input: Input
  private _canvas: CanvasRenderingContext2D

  // private _menu: MainMenu
  private _stack: LayerStack
  private _mainMenu: MainMenu
  private _game?: Game

  // helpers
  private _worldRenderedWidth: number
  private _worldRenderedHeight: number   

  // game loop timing
  private _lastUpdate: number
  private _updateInterval: number

  // misc
  private _afterUpdate: ((context: EngineContext) => void) | undefined


  public constructor(args: EngineArgs) {

    // 
    this._worldRenderedWidth = args.worldWidth * args.pxSize
    this._worldRenderedHeight = args.worldHeight * args.pxSize

    // setup baseline canvas settings
    this._canvas = args.canvas
    this._canvas.textBaseline = 'middle'
    this._canvas.textAlign = 'center'
    this._canvas.shadowColor = 'black'

    // game loop properties
    this._lastUpdate = 0
    this._updateInterval = 0

    // initialize objects
    this._input = new Input()

    this._stack = new LayerStack({
      canvas: args.canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
    this._mainMenu = new MainMenu({
      canvas: args.canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
    this._stack.add(this._mainMenu)
    
    // misc
    this._afterUpdate = args.afterUpdate

    // setup controls
    document.addEventListener('keydown', e => 
      this._input.keyDown(e.key)
    )

    // start the game loop
    this.update()
  }

  private update() {
    requestAnimationFrame((currentTime) => {

      // calculate time since last update
      const delta = currentTime - this._lastUpdate

      // update if delta is larger than update interval
      if (delta >= this._updateInterval) {

        // handle main menu selection
        this._mainMenu.selection.changed(() => {
          this._stack.add(this.createGame())
          this._input.reset()
        })

        // update
        this._updateInterval = this._stack.update(this._input)

        // game over state
        if (this._game?.state.changedTo('over')) {
          this._stack.add(this.createGameOverMenu())
        }

        // time tracking
        this._lastUpdate = currentTime
      }

      // cleanup stack
      this._stack.cleanup()

      // render
      this._stack.render()

      // post update
      this._afterUpdate?.(this._game?.stats ?? {
        moves: 0,
        snakeLength: 0,
        gold: 0
      })

      // loop
      this.update()
    })
  }

  private createGame(): Game {
    this._game = new Game({
      canvas: this._canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
    return this._game
  }

  private createGameOverMenu(): GameOverMenu {
    return new GameOverMenu({
      canvas: this._canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight
    })
  }

  private createShopMenu(): ShopMenu {
    if (this._game === undefined) {
      throw new Error('cannot create shop menu if there is no game')
    }

    return new ShopMenu({
      canvas: this._canvas,
      width: this._worldRenderedWidth,
      height: this._worldRenderedHeight,
      snake: this._game.world.snake
    })
  }

}


// =====
// types
// =====


type EngineArgs = {

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
   * callback that gets triggered after each update
   */
  afterUpdate?: (context: EngineContext) => void
}

type EngineState =
  | 'playing'
  | 'paused'
  | 'gameOver'
  | 'gameWon'
type EngineContext = Stats & {}