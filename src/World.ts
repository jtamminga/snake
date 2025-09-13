import { Consumable, type Item, Items, Stone } from './items/index.js'
import type { Snake } from './Snake.ts'
import { type Direction, Bounds } from './utils/index.js'


export class World {

  private _bounds: Bounds
  private _snake: Snake
  private _items: Items

  public constructor(args: WorldArgs) {
    this._snake = args.snake
    this._bounds = new Bounds(args)
    this._items = new Items({ world: this })
    this._items.spawnFood()
    this._items.spawnStone()
  }

  public get width(): number {
    return this._bounds.width
  }

  public get height(): number {
    return this._bounds.height
  }

  public get snake(): Snake {
    return this._snake
  }

  public get items(): ReadonlyArray<Item> {
    return this._items.all
  }

  public update(direction: Direction): void {
    const snake = this._snake

    // update snake
    snake.move(direction)

    // check bounds
    if (this._bounds.outside(snake.head)) {
      if (snake.effects.wrap) {
        snake.teleport(this._bounds.wrap(snake.head))
      } else {
        snake.die()
      }
    }

    // handle items
    const item = this._items.at(snake.head)
    if (item) {

      // snake hits a stone, it dies
      if (item instanceof Stone) {
        snake.die()
      }
      // otherwise eat item
      else if (item instanceof Consumable) {
        snake.eat(item)
        this._items.spawnFood()
      }
    }

    // update items
    this._items.update()
  }

}


type WorldArgs = {
  snake: Snake
  width: number
  height: number
}