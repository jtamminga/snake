import { Layer, type LayerArgs } from './layers/index.js'
import type { Input } from './utils/Input.js'


export class GameOverMenu extends Layer {

  private _middle: number

  public constructor(args: GameOverMenuArgs) {
    super(args, false)
    this._middle = args.width / 2
  }

  public update(input: Input): number {
    if (input.lastKey.changedTo('enter')) {
      this.resolve()
    }

    return 1000 / 60
  }

  public render(): void {
    const canvas = this._canvas

    canvas.fillStyle = 'rgba(255, 0, 0, 0.7)'
    canvas.fillRect(0, 0, this._width, this._height)

    canvas.font = '100px Tiny5'
    canvas.fillStyle = 'rgba(255,255,255,1)'
    canvas.fillText('game over', this._middle, 100)
  } 

}


type GameOverMenuArgs = LayerArgs & {}