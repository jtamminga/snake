import { Effect, type EffectArgs } from './Effect.js'


export class GoldEffect extends Effect {

  private _amount: number

  public constructor({ amount, ...effectArgs }: GoldEffectArgs) {
    super(effectArgs)
    this._amount = amount
  }

  public get amount(): number {
    return this._amount
  }

}


type GoldEffectArgs = EffectArgs & {
  amount: number
}