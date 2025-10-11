import { GoldEffect, RockEaterEffect, SpeedEffect, WrapEffect, type Effect } from '../effects/index.js'
import { Coin, Stone, type Item } from '../items/index.js'
import { MultiUpgrade } from '../upgrades/MultiUpgrade.js'
import { SingleUpgrade } from '../upgrades/SingleUpgrade.js'
import { Breed } from './Breed.js'


export class RockEaterBreed extends Breed<RockEaterUpgrade> {

  public constructor() {
    super([
      new MultiUpgrade({
        id: 'increaseDur',
        name: 'Increase duration',
        cost: 1,
        description: 'Increase duration of your power up'
      }),
      new SingleUpgrade({
        id: 'teleporter',
        name: 'Teleporter',
        cost: 5,
        description: 'Teleport to the other side of the map when you hit the edge while powered up'
      }),
      new SingleUpgrade({
        id: 'midas',
        name: 'Midas',
        cost: 10,
        description: 'When you eat a rock gain 1 gold'
      }),
      new MultiUpgrade({
        id: 'speedReduction',
        name: 'Speed reduction',
        cost: 1,
        description: 'Reduce the speed of the snake'
      }),
    ])
  }

  public effectsFromItem(item: Item): ReadonlyArray<Effect> {
    const effects: Effect[] = []

    // coin
    if (item instanceof Coin) {
      effects.push(new RockEaterEffect({ duration: this._duration }))
      if (this._upgrades.get('teleporter')?.purchased) {
        effects.push(new WrapEffect({ duration: this._duration }))
      }
    }

    // stone
    else if (this._upgrades.get('midas')?.purchased && item instanceof Stone) {
      effects.push(new GoldEffect({ amount: 1 }))
    }

    // return
    return effects
  }

  public effectsFromUpgrade(upgradeId: RockEaterUpgrade): ReadonlyArray<Effect> {

    // get upgrade
    const upgrade = this._upgrades.get(upgradeId)
    if (!upgrade) {
      throw new Error(`cannot find upgrade ${upgradeId}`)
    }

    // purchase 
    const effects: Effect[] = [upgrade.purchase()]

    // return any effects the upgrade has
    switch (upgradeId) {
      case 'speedReduction':
        effects.push(new SpeedEffect({ amount: -1 }))
        break
      case 'increaseDur':
        this._duration += 1
        break
    }

    return effects
  }

}


export type RockEaterUpgrade =
  | 'increaseDur'
  | 'teleporter'
  | 'midas'
  | 'speedReduction'