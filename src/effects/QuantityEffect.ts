import { Effect, type EffectArgs } from './Effect.js'


export class QuantityEffect extends Effect {

  protected _amount: number

  public constructor({ amount, ...effectArgs }: QuantityEffectArgs) {
    super(effectArgs)
    this._amount = amount
  }

  public get amount(): number {
    return this._amount
  }

  public addAmount(amount: number): void {
    this._amount += amount
  }

}


type QuantityEffectArgs = EffectArgs & {
  amount: number
}