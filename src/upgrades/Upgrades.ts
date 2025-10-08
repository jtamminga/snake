import type { Upgrade } from './Upgrade.js'


export const baseUpgrades: Upgrade<BaseUpgrade>[] = [
  {
    id: 'speedReduct',
    name: 'Speed reduction',
    cost: 1
  },
  {
    id: 'teleporter',
    name: 'Teleporter',
    cost: 5
  },
]


export type BaseUpgrade =
  | 'speedReduct'
  | 'teleporter' 