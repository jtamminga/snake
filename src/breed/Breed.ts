import type { Effect } from '../effects/index.js'
import type { Item } from '../items/index.js'
import type { Upgrade, UpgradeType } from '../upgrades/index.js'


export abstract class Breed<TUpgrade extends UpgradeType = UpgradeType> {

  protected _duration: number
  protected _upgrades: Map<TUpgrade, Upgrade<TUpgrade>>

  public constructor() {
    this._duration = 5
    this._upgrades = new Map<TUpgrade, Upgrade<TUpgrade>>()
  }

  public get upgrades(): ReadonlyArray<Upgrade<TUpgrade>> {
    return Array.from(this._upgrades.values())
  }

  public isBreedSpecific(upgrade: Upgrade): upgrade is Upgrade<TUpgrade> {
    return this._upgrades.has(upgrade.id as TUpgrade)
  }

  public abstract apply(upgrade: Upgrade<TUpgrade>): void
  
  public abstract effectsFrom(item: Item): ReadonlyArray<Effect>

}