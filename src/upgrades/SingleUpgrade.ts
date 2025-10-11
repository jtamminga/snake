import { Upgrade, type UpgradeType } from './Upgrade.js'


export class SingleUpgrade<TUpgrade extends UpgradeType> extends Upgrade<TUpgrade> {

  public get available(): boolean {
    return this._quantity === 0
  }

}