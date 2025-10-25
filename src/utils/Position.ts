import { Direction } from './Direction.js'


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

  public adjacentTo(position: Position): boolean {
    return Math.abs(position.x - this.x) <= 1
      && Math.abs(position.y - this.y) <= 1
  }

  public to(position: Position): Direction | undefined {
    if (position.x > this.x) {
      return 'right'
    }
    else if (position.x < this.x) {
      return 'left'
    }
    else if (position.y > this.y) {
      return 'down'
    }
    else if (position.y < this.y) {
      return 'up'
    }
    else {
      return undefined
    }
  }

  public from(position: Position): Direction | undefined {
    const toDirection = this.to(position)
    return toDirection
      ? Direction.opposite(toDirection)
      : undefined
  }

}