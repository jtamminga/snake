import { Effect, type EffectArgs } from './Effect.js'


export class SpeedBoostEffect extends Effect {

  private _boostAmount: number

  public constructor({ boostAmount, ...effectArgs }: SpeedBoostEffectArgs) {
    super(effectArgs)
    this._boostAmount = boostAmount
  }

  public get amount(): number {
    return (this.remaining / this.duration) * this._boostAmount
  }
}


type SpeedBoostEffectArgs = EffectArgs & {
  boostAmount: number
}