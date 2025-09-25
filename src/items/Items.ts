import { Position } from '../utils/index.js'
import type { World } from '../World.js'
import type { Item } from './Item.js'
import { Spawner } from './Spawner.js'
import { Stone } from './Stone.js'


/**
 * Responsible for all items in world
 */
export class Items {

  private readonly _spawner: Spawner
  private _world: World
  private _items: Item[]

  public constructor(args: ItemsArgs) {
    this._spawner = new Spawner(args)
    this._world = args.world
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
    this._items = this._items.filter(item => {

      // keep items that exist
      if (!item.exists) {
        return false
      }

      // keep items still in the bounds of this world
      if (!this._world.bounds.contains(item.position)) {
        console.debug('item pushed off')
        return false
      }
      
      // check for stones that just spawned, if blocked then we don't keep them
      if (item.justSpawned) {
        const blocked = this._world.everything
          .filter(i => i !== item)
          .some(i => i.occupies(item.position))

        // blocked
        if (blocked) {
          console.debug('item blocked!')
          return false
        }
      }

      return true
    })

    // add items from spawner
    this._items.push(...this._spawner.next())
  }

}


type ItemsArgs = {
  world: World
}