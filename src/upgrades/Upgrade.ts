import { GoldEffect } from '../effects/index.js'


// types
export type UpgradeType = string
export interface UpgradeData<TUpgrade extends UpgradeType = UpgradeType> {
  readonly id: TUpgrade
  readonly name: string
  readonly cost: number
  readonly available: boolean
  readonly description: string
}


// class
export abstract class Upgrade<TUpgrade extends UpgradeType> implements UpgradeData<TUpgrade> {

  public readonly id: TUpgrade
  public readonly name: string
  public readonly cost: number
  public readonly description: string
  protected _quantity: number

  public constructor(args: UpgradeArgs<TUpgrade>) {
    this.id = args.id
    this.name = args.name
    this.cost = args.cost
    this.description = args.description
    this._quantity = 0
  }

  public purchase(): GoldEffect {
    this._quantity += 1
    return new GoldEffect({ amount: -this.cost })
  }

  public get purchased(): boolean {
    return this._quantity > 0
  }

  public abstract available: boolean

}


type UpgradeArgs<TUpgrade extends UpgradeType> = Omit<UpgradeData<TUpgrade>, 'available'>