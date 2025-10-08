export type UpgradeType = string
export type Upgrade<TUpgrade extends UpgradeType = UpgradeType> = {
  id: TUpgrade
  name: string
  cost: number
}