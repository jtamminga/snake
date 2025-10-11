import type { Effect } from '../effects/index.js'
import type { Item } from '../items/index.js'
import type { Upgrade, UpgradeData, UpgradeType } from '../upgrades/index.js'


export abstract class Breed<TUpgrade extends UpgradeType = UpgradeType> {

  protected _duration: number
  protected _upgrades: Map<TUpgrade, Upgrade<TUpgrade>>

  public constructor(upgrades: ReadonlyArray<Upgrade<TUpgrade>>) {
    this._duration = 5
    this._upgrades = new Map<TUpgrade, Upgrade<TUpgrade>>()
    upgrades.forEach(upgrade => this._upgrades.set(upgrade.id, upgrade))
  }

  public get upgrades(): ReadonlyArray<UpgradeData<TUpgrade>> {
    return Array.from(this._upgrades.values())
  }

  public abstract effectsFromItem(item: Item): ReadonlyArray<Effect>

  public abstract effectsFromUpgrade(upgradeId: TUpgrade): ReadonlyArray<Effect>

}