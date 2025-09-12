export class Input {
  
  private _lastKeyPressed: Direction

  public constructor() {
    this._lastKeyPressed = 'right'
  }

  public get direction(): Direction {
    return this._lastKeyPressed
  }

  public keyDown(key: string) {
    switch (key) {
      case 'ArrowRight':
        this._lastKeyPressed = 'right'
        break
      case 'ArrowLeft':
        this._lastKeyPressed = 'left'
        break
      case 'ArrowUp':
        this._lastKeyPressed = 'up'
        break
      case 'ArrowDown':
        this._lastKeyPressed = 'down'
        break
    }
  }
}


export type Direction =
  | 'up'
  | 'down'
  | 'right'
  | 'left'