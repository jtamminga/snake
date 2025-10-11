import { Upgrade, type UpgradeType } from './Upgrade.js'


export class MultiUpgrade<TUpgrade extends UpgradeType> extends Upgrade<TUpgrade> {

  public get available(): boolean {
    return true
  }

}