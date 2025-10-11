import type { Upgrade } from './Upgrade.js'


export const baseUpgrades: Upgrade<BaseUpgrade>[] = [
  {
    id: 'speedReduct',
    name: 'Speed reduction',
    cost: 1,
    available: true
  }
]


export type BaseUpgrade =
  | 'speedReduct'