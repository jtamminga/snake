import { GoldEffect, RockEaterEffect, WrapEffect, type Effect } from '../effects/index.js'
import { Coin, Stone, type Item } from '../items/index.js'
import type { Upgrade } from '../upgrades/index.js'
import { Breed } from './Breed.js'


export class RockEaterBreed extends Breed<RockEaterUpgrade> {

  public constructor() {
    super()

    this._upgrades.set('increaseDur', {
      id: 'increaseDur',
      name: 'Increase powerup duration',
      cost: 1,
      available: true
    })
    this._upgrades.set('teleporter', {
      id: 'teleporter',
      name: 'Teleporter',
      cost: 1,
      available: true
    })
    this._upgrades.set('midas', {
      id: 'midas',
      name: 'Midas',
      cost: 1,
      available: true
    })
  }

  public apply(upgrade: Upgrade<RockEaterUpgrade>): void {
    switch (upgrade.id) {
      case 'midas':
      case 'teleporter':
        upgrade.available = false
        break
      case 'increaseDur':
        this._duration += 1
        break
    }
  }

  public effectsFrom(item: Item): ReadonlyArray<Effect> {
    const effects: Effect[] = []

    // coin
    if (item instanceof Coin) {
      effects.push(new RockEaterEffect({ duration: this._duration }))
      if (this._upgrades.has('teleporter')) {
        effects.push(new WrapEffect({ duration: this._duration }))
      }
    }

    // stone
    else if (this._upgrades.has('midas') && item instanceof Stone) {
      effects.push(new GoldEffect({ amount: 1, duration: 1 }))
    }

    // return
    return effects
  }

}


export type RockEaterUpgrade =
  | 'increaseDur'
  | 'teleporter'
  | 'midas'