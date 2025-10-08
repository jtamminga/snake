import type { Effect } from '../effects/index.js'
import type { Item } from '../items/index.js'
import type { Upgrade, UpgradeType } from '../upgrades/index.js'


export abstract class Breed<TUpgrade extends UpgradeType = UpgradeType> {

  protected _duration: number

  public constructor() {
    this._duration = 5
  }

  public upgradeDuration(amount: number): void {
    this._duration += amount
  }

  public abstract upgrades: ReadonlyArray<Upgrade<TUpgrade>>

  public abstract apply(upgradeId: TUpgrade): void
  
  public abstract effectsFrom(item: Item): ReadonlyArray<Effect>

}