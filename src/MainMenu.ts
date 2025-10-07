import { Layer, type LayerArgs } from './layers/index.js'
import { Input, Event } from './utils/index.js'


export class MainMenu extends Layer<boolean> {

  private _middle: number
  private _selection: Event<Selection>
  
  public constructor(args: MainMenuArgs) {
    super(args)
    this._middle = args.width / 2
    this._selection = new Event()
  }

  public get selection(): Event<Selection> {
    return this._selection
  }

  public update(input: Input): number {
    if (input.lastKey.consume('enter')) {
      this.resolve(true)
    }

    // 30 fps
    return 1000 / 30
  }

  public render(): void {
    const canvas = this._canvas

    canvas.fillStyle = 'rgba(12, 192, 168, 1)'
    canvas.fillRect(0, 0, this._width, this._height)

    canvas.font = '100px Tiny5'
    canvas.fillStyle = 'rgba(255,255,255,1)'
    canvas.fillText('snake', this._middle, 100)
  }

}


type MainMenuArgs = LayerArgs & {}
type Selection = 'play'