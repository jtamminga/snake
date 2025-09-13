import { Position } from '../utils/index.js'
import type { World } from '../World.js'
import { Food } from './Food.js'
import type { Item } from './Item.js'
import { Stone } from './Stone.js'


export class Items {

  private _world: World
  private _items: Item[]

  // need a better way to manage spawning of items
  private _updatesSinceStoneSpawn: number

  public constructor(args: ItemsArgs) {
    this._world = args.world
    this._items = []

    this._updatesSinceStoneSpawn = 0
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

  public spawnFood(): void {
    const position = this.randomPosition()
    this._items.push(new Food({ position }))
  }

  public spawnStone(): void {
    this._updatesSinceStoneSpawn = 0
    const position = this.randomPosition()
    this._items.push(new Stone({ spawningDuration: 5, duration: 10, position }))
  }

  public update(): void {
    this._items.forEach(item => item.update())
    this._items = this._items.filter(item => item.exists)

    this._updatesSinceStoneSpawn += 1
    if (this._updatesSinceStoneSpawn > 20) {
      this.spawnStone()
    }
  }

  private randomPosition(): Position {
    const worldSize = this._world.width * this._world.height
    const availableSpots = worldSize - this._world.snake.length - this._items.length
    const randNum = Math.floor(Math.random() * availableSpots)
    const worldObjects = [this._world.snake, ...this._items]

    let count = 0
    for (let y = 0; y < this._world.height; y++) {
      for (let x = 0; x < this._world.width; x++) {
        const position = new Position(x, y)
        if (worldObjects.every(obj => !obj.occupies(position))) {
          if (count === randNum) {
            return position
          }
          count += 1
        }
      }
    }

    throw new Error('problem generating random position')
  }
}


type ItemsArgs = {
  world: World
}