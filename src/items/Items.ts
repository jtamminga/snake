import type { Notifier } from '../Notifier.js'
import { Position } from '../utils/index.js'
import type { World } from '../World.js'
import type { Item } from './Item.js'
import { Spawner } from './Spawner.js'


/**
 * Responsible for all items in world
 */
export class Items {

  private readonly _spawner: Spawner
  private readonly _notifier: Notifier
  private _world: World
  private _items: Item[]

  public constructor(args: ItemsArgs) {
    this._spawner = new Spawner(args)
    this._notifier = args.notifier
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

    // update and check if items should be marked to destroy
    for (const item of this._items) {
      
      // update item
      item.update()

      // check if items should be marked to destroy
      // items will be actually discarded later (allowing for animations to finish)
      if (!item.exists) {
        continue
      }

      // item outside of bounds
      if (!this._world.bounds.contains(item.position)) {
        item.destroy()
      }

      // check for stones that just spawned, if blocked then we discard
      else if (item.justSpawned) {
        const blocked = this._world.everything
          .filter(i => i !== item)
          .some(i => i.occupies(item.position))

        // blocked
        if (blocked) {
          this._notifier.add({ message: 'stone blocked', position: item.position })
          item.destroy()
        }
      }

    }

    // filter out items that are disposable
    this._items.filter(item => !item.disposable)

    // add items from spawner
    this._items.push(...this._spawner.next())
  }

}


type ItemsArgs = {
  notifier: Notifier
  world: World
}