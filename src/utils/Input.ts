import { Event } from './Event.js'
import { State } from './State.js'


export class Input {
  
  private _lastKeyPressed: Event<Key>
  private _lastDirectionKeyPressed: Direction

  public constructor() {
    this._lastKeyPressed = new Event()
    this._lastDirectionKeyPressed = 'right'
  }

  public get lastKey(): State<Key | undefined> {
    return this._lastKeyPressed
  }

  public get direction(): Direction {
    return this._lastDirectionKeyPressed
  }

  public reset(): void {
    this._lastDirectionKeyPressed = 'right'
  }

  public keyDown(key: string) {
    switch (key) {
      case 'ArrowRight':
        this._lastKeyPressed.update('right')
        this._lastDirectionKeyPressed = 'right'
        break
      case 'ArrowLeft':
        this._lastKeyPressed.update('left')
        this._lastDirectionKeyPressed = 'left'
        break
      case 'ArrowUp':
        this._lastKeyPressed.update('up')
        this._lastDirectionKeyPressed = 'up'
        break
      case 'ArrowDown':
        this._lastKeyPressed.update('down')
        this._lastDirectionKeyPressed = 'down'
        break
      case 'Enter':
        this._lastKeyPressed.update('enter')
        break
      case 'Escape':
        this._lastKeyPressed.update('esc')
        break
      case 's':
        this._lastKeyPressed.update('shop')
        break
    }
  }
}


export type Direction =
  | 'up'
  | 'down'
  | 'right'
  | 'left'
export type Key = Direction | 'enter' | 'esc' | 'shop'