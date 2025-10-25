export type Direction =
  | 'up'
  | 'down'
  | 'right'
  | 'left'


export namespace Direction {
  export function opposite(dir: Direction): Direction {
    switch (dir) {
      case 'up':
        return 'down'
      case 'down':
        return 'up'
      case 'left':
        return 'right'
      case 'right':
        return 'left'
    }
  }
}