import { GoldEffect, RockEaterEffect, type Effect } from '../effects/index.js'
import { Coin, Stone, type Item } from '../items/index.js'
import type { Upgrade } from '../upgrades/index.js'
import { Breed } from './Breed.js'


export class RockEaterBreed extends Breed<RockEaterUpgrade> {

  private _midas = false

  public get upgrades(): ReadonlyArray<Upgrade<RockEaterUpgrade>> {
    return [
      {
        id: 'midas',
        name: 'Midas',
        cost: 5
      }
    ]
  }

  public apply(upgradeId: RockEaterUpgrade): void {
    switch (upgradeId) {
      case 'midas':
        this._midas = true
        break
    }
  }

  public effectsFrom(item: Item): ReadonlyArray<Effect> {
    if (item instanceof Coin) {
      return [new RockEaterEffect({ duration: this._duration })]
    }

    else if (item instanceof Stone && this._midas) {
      return [new GoldEffect({ amount: 1, duration: 1 })]
    }

    else {
      return []
    }
  }

}


type RockEaterUpgrade =
  | 'midas'