import { Event } from './Event.js'
import { State } from './State.js'


export class Input {
  
  private _rawLastKeyPressed: Key | undefined
  private _lastKeyPressed: Event<Key>
  private _lastDirectionKeyPressed: Direction

  public constructor() {
    this._lastKeyPressed = new Event()
    this._lastDirectionKeyPressed = 'right'
  }

  public get lastKey(): Event<Key | undefined> {
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
        this._rawLastKeyPressed = 'right'
        this._lastDirectionKeyPressed = 'right'
        break
      case 'ArrowLeft':
        this._rawLastKeyPressed = 'left'
        this._lastDirectionKeyPressed = 'left'
        break
      case 'ArrowUp':
        this._rawLastKeyPressed = 'up'
        this._lastDirectionKeyPressed = 'up'
        break
      case 'ArrowDown':
        this._rawLastKeyPressed = 'down'
        this._lastDirectionKeyPressed = 'down'
        break
      case 'Enter':
        this._rawLastKeyPressed = 'enter'
        break
      case 'Escape':
        this._rawLastKeyPressed = 'esc'
        break
      case 's':
        this._rawLastKeyPressed = 'shop'
        break
    }
  }

  public update(): void {
    this._lastKeyPressed.update(this._rawLastKeyPressed)
  }
}


export type Direction =
  | 'up'
  | 'down'
  | 'right'
  | 'left'
export type Key = Direction | 'enter' | 'esc' | 'shop'