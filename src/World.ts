import { Consumable, type Item, Items, Stone } from './items/index.js'
import type { Notifier } from './Notifier.js'
import { Snake } from './Snake.js'
import { type Direction, Bounds } from './utils/index.js'


export class World {

  private _notifier: Notifier
  private _bounds: Bounds
  private _snake: Snake
  private _items: Items

  public constructor(args: WorldArgs) {
    this._notifier = args.notifier
    this._snake = new Snake({
      startX: Math.floor(args.width / 2) - 1,
      startY: Math.floor(args.height / 2) - 1,
      baseSpeed: 1
    })
    this._bounds = new Bounds(args)
    this._items = new Items({ world: this, notifier: args.notifier })
  }

  public get bounds(): Bounds {
    return this._bounds
  }

  public get width(): number {
    return this._bounds.width
  }

  public get height(): number {
    return this._bounds.height
  }

  public get area(): number {
    return this._bounds.area
  }

  public get snake(): Snake {
    return this._snake
  }

  public get items(): ReadonlyArray<Item> {
    return this._items.all
  }

  public get everything() {
    return [this._snake, ...this.items]
  }

  public update(direction: Direction): void {
    const notifier = this._notifier
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

      if (item instanceof Stone) {
        if (snake.effects.rockEater) {
          snake.eat(item)
          notifier.add({ message: 'destroyed', position: item.position })
        } else if (!this._items.at(item.position.apply(direction))) {
          item.push(direction)
        } else {
          snake.die()
        }
      }

      // otherwise eat item
      else if (item instanceof Consumable) {
        snake.eat(item)
      }
    }

    // update items
    this._items.update()
  }

}


type WorldArgs = {
  width: number
  height: number
  notifier: Notifier
}