import { Position } from '../utils/index.js'
import type { World } from '../World.js'
import type { Item } from './Item.js'
import { Spawner } from './Spawner.js'


/**
 * Responsible for all items in world
 */
export class Items {

  private readonly _spawner: Spawner
  private _items: Item[]

  public constructor(args: ItemsArgs) {
    this._spawner = new Spawner(args)
    this._items = []
  }

  public get all(): ReadonlyArray<Item> {
    return this._items
  }

  public at(position: Position): Item | undefined {
    return this._items.find(item => item.occupies(position) && item.spawned)
  }

  public consumeAt(position: Position): Item | undefined {
    // try to find item at position
    const itemIndex = this._items.findIndex(item =>
      item.occupies(position) && item.spawned)

    if (itemIndex !== -1) {
      // remove consumed item
      const [item] = this._items.splice(itemIndex, 1)
      return item
    }

    return undefined
  }

  public update(): void {
    this._items.forEach(item => item.update())
    this._items = this._items.filter(item => item.exists)

    // add items from spawner
    this._items.push(...this._spawner.next())
  }

}


type ItemsArgs = {
  world: World
}