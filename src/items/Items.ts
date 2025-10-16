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
  private _items: ItemWrapper[]
  private _updates: number

  public constructor(args: ItemsArgs) {
    this._spawner = new Spawner(args)
    this._notifier = args.notifier
    this._world = args.world
    this._items = []
    this._updates = 0
  }

  /**
   * All items including items that might not exist anymore
   */
  public get all(): ReadonlyArray<Item> {
    return this._items
  }

  /**
   * Only existing items
   */
  public get existing(): ReadonlyArray<Item> {
    return this._items.filter(item => item.exists)
  }

  public at(position: Position): Item | undefined {
    return this.existing.find(item => item.occupies(position) && item.spawned)
  }

  public update(): void {

    // filter out items that are disposable
    this._items = this._items.filter(item => 
      item.nonExistentAt === undefined || this._updates <= item.nonExistentAt)

    // update and check if items should be marked to destroy
    for (const item of this._items) {
      
      // update item
      item.update()

      // check if items should be marked to destroy
      // items will be actually discarded later (allowing for animations to finish)
      if (!item.exists) {

        // mark when this item went non existent
        if (item.nonExistentAt === undefined) {
          item.nonExistentAt = this._updates
        }

        // skip to the next item
        continue
      }

      // item outside of bounds
      if (!this._world.bounds.contains(item.position)) {
        item.destroy()
      }

      // check for items that just spawned, if blocked then we discard
      else if (item.justSpawned) {
        const blocked = this._world.existing
          .filter(i => i !== item)
          .some(i => i.occupies(item.position))

        // blocked
        if (blocked) {
          this._notifier.add({ message: 'stone blocked', position: item.position })
          item.destroy()
        }
      }

    }

    // add items from spawner
    this._items.push(...this._spawner.next())

    // track number of updates
    this._updates += 1
  }

}


type ItemsArgs = {
  notifier: Notifier
  world: World
}
type ItemWrapper = Item & {nonExistentAt?: number}