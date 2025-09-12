import type { Direction } from './Input.js'


export class Position {

  public constructor(
    public readonly x: number,
    public readonly y: number
  ) { }

  public apply(direction: Direction): Position {
    switch (direction) {
      case 'right':
        return new Position(this.x + 1, this.y)
      case 'left':
        return new Position(this.x - 1, this.y)
      case 'down':
        return new Position(this.x, this.y + 1)
      case 'up':
        return new Position(this.x, this.y - 1)
    }
  }

  public equals(position: Position): boolean {
    return this.x === position.x && this.y === position.y
  }

}