import { Position } from '../utils/index.js'
import type { World } from '../World.js'
import { Coin } from './Coin.js'
import { Food } from './Food.js'
import type { Item } from './Item.js'
import { Stone } from './Stone.js'


/**
 * Responsible for spawning items at what times, amounts, etc.
 */
export class Spawner {

  private readonly _world: World
  private _updatesSinceStone: number
  private _updatesWithoutCoin: number
  private _spawningItems: Item[]

  public constructor(args: SpawnerArgs) {
    this._world = args.world
    this._updatesSinceStone = 0
    this._updatesWithoutCoin = 0
    this._spawningItems = []
  }

  public next(): Item[] {
    const {snake, items, area} = this._world
    this._spawningItems = []

    // food
    const food = items.filter(item => item instanceof Food)
    if (food.length === 0) {
      this._spawningItems.push(this.createFood())
    }

    // don't spawn eatra items past this threshold
    if (area - snake.length < 20) {
      return [...this._spawningItems]
    }

    // coins
    const coins = items.filter(item => item instanceof Coin)
    if (coins.length === 0) {
      if (this._updatesWithoutCoin >= 15) {
        this._spawningItems.push(this.createCoin())
      }
      this._updatesWithoutCoin += 1
    } else {
      this._updatesWithoutCoin = 0
    }

    // stones
    if (this._updatesSinceStone >= 8) {
      this._spawningItems.push(this.createStone())
      this._updatesSinceStone = 0
    } else {
      this._updatesSinceStone += 1
    }

    // return copy
    return [...this._spawningItems]
  }

  private createFood(): Food {
    const position = this.randomPosition()
    return new Food({ position })
  }

  private createStone(): Stone {
    const position = this.randomPosition()
    return new Stone({ spawningDuration: 5, position })
  }

  private createCoin(): Coin {
    const position = this.randomPosition()
    return new Coin({ position })
  }

  private randomPosition(): Position {
    const world = this._world

    const worldObjects = [...world.existing, ...this._spawningItems]
    const availableSpots = world.area - world.snake.length - world.items.length - this._spawningItems.length
    const randNum = Math.floor(Math.random() * availableSpots)

    let count = 0
    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
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


type SpawnerArgs = {
  world: World
}