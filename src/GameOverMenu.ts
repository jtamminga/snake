export class GameOverMenu {

  private _width: number
  private _height: number
  private _canvas: CanvasRenderingContext2D
  private _middle: number


  public constructor(args: GameOverMenuArgs) {
    this._width = args.width
    this._height = args.height
    this._canvas = args.canvas
    this._middle = args.width / 2
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


type GameOverMenuArgs = {
  width: number
  height: number
  canvas: CanvasRenderingContext2D
}